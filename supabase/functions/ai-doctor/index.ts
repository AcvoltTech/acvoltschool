// Edge Function: ai-doctor
// Reads recent failures, asks Claude for a diagnosis + suggested action,
// auto-executes safe whitelist actions, emails Mario for everything else.
//
// Runs every 30 min via pg_cron.
//
// Required secrets: ANTHROPIC_API_KEY, RESEND_API_KEY, ADMIN_EMAILS,
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

// Per Mario's contract (2026-04-24): AI Doctor NEVER auto-executes. Pure
// analyzer mode — collect, diagnose, log. Mario reviews the morning briefing
// and pairs with Claude Code to apply fixes. Empty whitelist enforces this.
const SAFE_ACTIONS = new Set<string>([]);
const AUTO_EXECUTE_CONFIDENCE_THRESHOLD = 99; // unreachable — defensive

// ── Action executors ───────────────────────────────────────────────────
type ActionResult = { ok: boolean; details: Record<string, unknown> };

async function execReactivateAdmin(supabase: any, params: any): Promise<ActionResult> {
  const email = String(params?.email || '');
  if (!email) return { ok: false, details: { error: 'email required' } };
  const { data, error } = await supabase.from('admin_staff').update({ activo: true })
    .eq('email', email).select().single();
  if (error) return { ok: false, details: { error: error.message } };
  return { ok: true, details: { email: data.email, activo: data.activo, rol: data.rol } };
}

async function execFlipUserAccess(supabase: any, params: any): Promise<ActionResult> {
  const email = String(params?.email || '');
  const field = String(params?.field || '');
  const value = params?.value;
  const allowedFields = new Set(['activo', 'acceso_completo']);
  if (!email || !allowedFields.has(field) || typeof value !== 'boolean') {
    return { ok: false, details: { error: 'email + field (activo|acceso_completo) + boolean value required' } };
  }
  const update: Record<string, unknown> = {};
  update[field] = value;
  const { data, error } = await supabase.from('users').update(update).eq('email', email).select().single();
  if (error) return { ok: false, details: { error: error.message } };
  return { ok: true, details: { email: data.email, [field]: data[field] } };
}

async function execHealPlaybackUrl(supabase: any, params: any, supabaseUrl: string, anonKey: string): Promise<ActionResult> {
  // Calls existing live-stream-health-check function which knows how to do this.
  const res = await fetch(`${supabaseUrl}/functions/v1/live-stream-health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` },
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, details: body };
}

async function execClearStaleLiveStream(supabase: any, params: any): Promise<ActionResult> {
  const streamId = String(params?.stream_id || '');
  if (!streamId) return { ok: false, details: { error: 'stream_id required' } };
  const { data, error } = await supabase.from('live_streams').update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('id', streamId).eq('status', 'live').select().single();
  if (error) return { ok: false, details: { error: error.message } };
  return { ok: true, details: { id: data?.id, new_status: data?.status } };
}

async function execBumpLazyLoaderCache(): Promise<ActionResult> {
  // Logs intent — actual cache bump is a code change requiring deploy.
  // For now this records the recommendation; future: trigger GitHub Actions.
  return { ok: true, details: { note: 'Recommendation logged. Cache bump requires deploy via GitHub Actions (not yet wired).' } };
}

async function executeAction(actionType: string, params: any, supabase: any, supabaseUrl: string, anonKey: string): Promise<ActionResult> {
  switch (actionType) {
    case 'reactivate_admin': return await execReactivateAdmin(supabase, params);
    case 'flip_user_access': return await execFlipUserAccess(supabase, params);
    case 'heal_playback_url': return await execHealPlaybackUrl(supabase, params, supabaseUrl, anonKey);
    case 'clear_stale_live_stream': return await execClearStaleLiveStream(supabase, params);
    case 'bump_lazy_loader_cache': return await execBumpLazyLoaderCache();
    case 'noop': return { ok: true, details: { note: 'No action taken — system is healthy.' } };
    default: return { ok: false, details: { error: `Unknown action type: ${actionType}` } };
  }
}

// ── Claude prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the AI Doctor for Maestro HVACR — a Spanish-language HVAC training app on Web (maestrohvacr.com), iOS (TestFlight), and Android (Play Store). You are owned by Mario Flores.

YOUR ROLE IS ANALYZER-ONLY. You do NOT execute fixes. Mario reviews your diagnoses in the morning and pairs with Claude Code (the agent that knows the codebase) to apply fixes. Your output gets logged to ai_actions_log and aggregated by ai-morning-briefing into Mario's wake-up email. Be PRECISE about root cause, citing memory entries and recent action patterns when applicable.

You will receive THREE blocks of context:
1. SYSTEM PROMPT (this) — your role, action vocabulary, output format.
2. PROJECT MEMORY — accumulated facts about the project. Trust these — they're hand-curated.
3. YOUR RECENT ACTIONS — the last ~30 entries from ai_actions_log. DO NOT repeat an action that just ran successfully; if the same FAIL is still showing after a successful action, escalate to manual_review with details.

Your job: read the monitoring snapshot in the user message, cross-reference with memory + recent actions, diagnose the root cause, and propose ONE remediation action. Output STRICT JSON only.

Subsystems you'll encounter:
- admin_staff: master admin login table. Common failure: \`activo=false\` for an email Mario uses (floresmario30@hotmail.com or floresmario30@gmail.com).
- live_streams: classes broadcast via 100ms HLS. Common failure: status='live' but playback_url stale (points to cloudflarestream.com or empty) → students see loading spinner.
- users: student accounts. Common failure: a real user has \`acceso_completo=false\` blocking access; admin needs to flip it.
- push_subscriptions: push delivery. Failures here are usually upstream (browser permission revoked) — not auto-fixable.
- edge functions: hms-token, cf-stream-proxy, send-push-notification. Failures here usually mean a deploy regressed.
- recent_js_errors: count from error_logs. Spikes during dev/testing are normal; sustained high count is real.

Your suggested_action.type vocabulary (NONE are auto-executed — they classify the FIX so Mario+Claude Code can act on it tomorrow):
- "reactivate_admin" — params: { email }. Diagnosis says someone in admin_staff needs activo=true.
- "flip_user_access" — params: { email, field: "activo"|"acceso_completo", value: true|false }. A specific user lost access via flag flip.
- "heal_playback_url" — params: { stream_id?, expected_url? }. live_streams row has stale playback_url; live-stream-health-check should repair it on next tick OR Mario should invoke it manually.
- "clear_stale_live_stream" — params: { stream_id }. live_streams row stuck in status='live' with no real broadcast.
- "bump_lazy_loader_cache" — params: { reason }. Suspect users are getting stale JS — recommend cache bump.
- "code_change" — params: { file_path?, what_to_change, why }. The fix requires a code edit + commit + deploy. Mario will pair with Claude Code.
- "schema_migration" — params: { what, why, sql_sketch? }. Requires a DB migration.
- "secret_rotation" — params: { which_secret, why }. A secret needs to be rotated/updated.
- "noop" — params: {}. Failures are noise or already self-healing; no human action needed.
- "manual_review" — params: { what_to_change, why }. Catch-all for anything that doesn't fit above.

Confidence rules:
- 0.95+ : exact known pattern (e.g., admin hotmail back to inactive after a sync)
- 0.85-0.94 : strong inference from failure pattern
- 0.50-0.84 : plausible but uncertain
- <0.50 : guessing — prefer "manual_review" or "noop"

Output ONLY this JSON shape:
{
  "diagnosis_es": "Brief Spanish explanation of root cause (1-2 sentences).",
  "severity": "low" | "medium" | "high" | "critical",
  "suggested_action": { "type": "<from list>", "params": { ... } },
  "confidence": 0.0-1.0,
  "reasoning": "Why you chose this action."
}`;

async function askClaude(apiKey: string, recentFailures: unknown[], recentErrors: unknown[], memory: unknown[], recentActions: unknown[]): Promise<any> {
  // Build the project-knowledge block as a separate cached system block.
  // This is stable per-night (memory rarely changes within a night) so prompt
  // caching keeps cost low across the ~96 nightly Doctor calls.
  const memoryBlock = memory.length === 0
    ? 'No project memory entries yet.'
    : (memory as Array<{ topic: string; category: string; content: string; importance: number }>)
        .map(m => `[${m.category} · importance ${m.importance}] ${m.topic}\n${m.content}`)
        .join('\n\n');

  const recentActionsBlock = recentActions.length === 0
    ? 'No prior AI Doctor actions logged.'
    : (recentActions as Array<{ created_at: string; diagnosis: string; action_type: string; action_params: unknown; executed: boolean; execution_result: unknown }>)
        .map(a => `${a.created_at} — ${a.action_type} (${a.executed ? 'EXECUTED' : 'PROPOSED'})\n  diagnosis: ${a.diagnosis}\n  params: ${JSON.stringify(a.action_params)}\n  result: ${JSON.stringify(a.execution_result)}`)
        .join('\n\n');

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `# PROJECT MEMORY (persistent — accumulated across all nights)\n\n${memoryBlock}`, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `# YOUR RECENT ACTIONS (last 30 entries from ai_actions_log — so you do not repeat yourself)\n\n${recentActionsBlock}` },
    ],
    messages: [
      {
        role: 'user',
        content: `Current monitoring snapshot:

# Recent health_log failures (last 30 min)
${JSON.stringify(recentFailures, null, 2)}

# Recent error_logs (top 10)
${JSON.stringify(recentErrors, null, 2)}

Diagnose the most pressing issue and propose ONE action. Use your project memory to recognize known patterns and avoid repeating fixes that already executed recently. If everything looks fine or this is just noise, return action.type="noop".

Output JSON only — no prose, no markdown fences.`,
      },
    ],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Claude ${res.status}: ${txt.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text || '';
  // Strip markdown fences just in case
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/m, '').trim();
  return JSON.parse(cleaned);
}

// ── Email Mario when manual review is needed ───────────────────────────
async function emailMario(resendKey: string, adminEmails: string[], diagnosis: any, actionLogId: string, supabaseUrl: string): Promise<boolean> {
  const approveUrl = `${supabaseUrl}/functions/v1/ai-doctor?approve=${actionLogId}`;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0f172a;color:#f1f5f9;padding:24px;">
    <h1 style="margin:0 0 8px;">🩺 AI Doctor — Diagnosis</h1>
    <p style="color:#94a3b8;font-size:13px;margin:0 0 18px;">Severity: <strong style="color:${diagnosis.severity === 'critical' ? '#ef4444' : diagnosis.severity === 'high' ? '#f97316' : '#facc15'}">${diagnosis.severity.toUpperCase()}</strong> · Confidence ${(diagnosis.confidence * 100).toFixed(0)}%</p>
    <div style="background:rgba(255,255,255,0.05);padding:14px 18px;margin-bottom:14px;border-radius:8px;">
      <div style="font-weight:700;color:#f1f5f9;margin-bottom:6px;">Diagnóstico</div>
      <div style="color:#cbd5e1;">${diagnosis.diagnosis_es}</div>
    </div>
    <div style="background:rgba(255,255,255,0.05);padding:14px 18px;margin-bottom:14px;border-radius:8px;">
      <div style="font-weight:700;color:#f1f5f9;margin-bottom:6px;">Razonamiento</div>
      <div style="color:#cbd5e1;font-size:13px;">${diagnosis.reasoning || ''}</div>
    </div>
    <div style="background:rgba(255,255,255,0.05);padding:14px 18px;margin-bottom:18px;border-radius:8px;">
      <div style="font-weight:700;color:#f1f5f9;margin-bottom:6px;">Acción propuesta</div>
      <div style="color:#cbd5e1;font-family:monospace;font-size:12px;">${diagnosis.suggested_action.type}</div>
      <pre style="margin:8px 0 0;color:#94a3b8;font-size:11px;white-space:pre-wrap;">${JSON.stringify(diagnosis.suggested_action.params || {}, null, 2)}</pre>
    </div>
    <p style="margin:0 0 12px;">Esta acción NO se ejecutó automáticamente. Si quieres aplicarla:</p>
    <a href="${approveUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none;">✅ Aplicar acción</a>
    <p style="margin-top:18px;color:#94a3b8;font-size:11px;">Este email se generó automáticamente por el AI Doctor. Si la acción está mal, ignora este email.</p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'AI Doctor <noreply@maestrohvacr.com>',
      to: adminEmails,
      subject: `🩺 AI Doctor: ${diagnosis.severity.toUpperCase()} — ${diagnosis.diagnosis_es.slice(0, 80)}`,
      html,
    }),
  });
  return res.ok;
}

// ── Main handler ───────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
  const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || 'floresmario30@hotmail.com,floresmario30@gmail.com').split(',').map(e => e.trim()).filter(Boolean);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // ── Approval handler: GET ?approve=<id> ──
  const url = new URL(req.url);
  const approveId = url.searchParams.get('approve');
  if (approveId) {
    const { data: actionRow, error: readErr } = await supabase
      .from('ai_actions_log').select('*').eq('id', approveId).single();
    if (readErr || !actionRow) {
      return new Response(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>❌ Acción no encontrada</h2><p>${readErr?.message || ''}</p></body></html>`, { headers: { 'Content-Type': 'text/html' }, status: 404 });
    }
    if (actionRow.executed) {
      return new Response(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>✅ Ya aplicada</h2><p>Esta acción se aplicó el ${actionRow.approved_at}</p></body></html>`, { headers: { 'Content-Type': 'text/html' } });
    }
    const result = await executeAction(actionRow.action_type, actionRow.action_params, supabase, SUPABASE_URL, SUPABASE_ANON_KEY);
    await supabase.from('ai_actions_log').update({
      executed: true, execution_result: result.details,
      approved_at: new Date().toISOString(), approved_by: 'mario_email_link',
    }).eq('id', approveId);
    return new Response(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0f172a;color:#f1f5f9;">
      <h2 style="color:${result.ok ? '#22c55e' : '#ef4444'};">${result.ok ? '✅ Aplicada' : '❌ Falló'}</h2>
      <pre style="background:#1e293b;padding:16px;border-radius:8px;text-align:left;display:inline-block;max-width:600px;overflow:auto;">${JSON.stringify(result.details, null, 2)}</pre>
    </body></html>`, { headers: { 'Content-Type': 'text/html' } });
  }

  if (!ANTHROPIC_API_KEY) return jsonResponse({ error: 'ANTHROPIC_API_KEY not set' }, 500);

  try {
    // Pull recent failures
    const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: failures } = await supabase
      .from('health_log').select('id, subsystem, platform, status, details, checked_at')
      .neq('status', 'OK').gte('checked_at', since).order('checked_at', { ascending: false }).limit(40);

    const { data: errors } = await supabase
      .from('error_logs').select('message, severity, created_at').gte('created_at', since)
      .order('created_at', { ascending: false }).limit(10).then(r => r).catch(() => ({ data: [] }));

    if (!failures || failures.length === 0) {
      return jsonResponse({ note: 'No failures in last 30 min — AI Doctor skipped Claude call.', failures_count: 0 });
    }

    // Load project memory (top 30 active entries by importance)
    const { data: memory } = await supabase
      .from('ai_memory').select('topic, category, content, importance')
      .eq('deprecated', false).order('importance', { ascending: false })
      .order('updated_at', { ascending: false }).limit(30);

    // Load last 30 AI actions so it sees its own history
    const { data: priorActions } = await supabase
      .from('ai_actions_log').select('created_at, diagnosis, action_type, action_params, executed, execution_result')
      .order('created_at', { ascending: false }).limit(30);

    // Bump reference_count on memory entries we're about to use (cheap signal of which entries earn their keep)
    if (memory && memory.length > 0) {
      const ids = (memory as any[]).map((m: any) => m.id).filter(Boolean);
      if (ids.length > 0) {
        await supabase.from('ai_memory')
          .update({ last_referenced_at: new Date().toISOString() })
          .in('id', ids);
      }
    }

    // Ask Claude (with memory + recent actions in cached system blocks)
    const diagnosis = await askClaude(ANTHROPIC_API_KEY, failures, errors || [], memory || [], priorActions || []);

    const isWhitelisted = SAFE_ACTIONS.has(diagnosis.suggested_action.type);
    const meetsConfidence = diagnosis.confidence >= AUTO_EXECUTE_CONFIDENCE_THRESHOLD;
    const willAutoExecute = isWhitelisted && meetsConfidence;

    // Insert action log row
    const { data: logRow, error: logErr } = await supabase.from('ai_actions_log').insert({
      trigger_source: 'cron_30min',
      diagnosis: diagnosis.diagnosis_es,
      severity: diagnosis.severity,
      action_type: diagnosis.suggested_action.type,
      action_params: diagnosis.suggested_action.params || {},
      confidence: diagnosis.confidence,
      requires_approval: !willAutoExecute,
      related_health_log_ids: (failures || []).map(f => f.id),
    }).select().single();

    if (logErr) return jsonResponse({ error: 'log insert failed', details: logErr.message, diagnosis }, 500);

    let executionResult: ActionResult | null = null;
    if (willAutoExecute) {
      executionResult = await executeAction(
        diagnosis.suggested_action.type, diagnosis.suggested_action.params,
        supabase, SUPABASE_URL, SUPABASE_ANON_KEY
      );
      await supabase.from('ai_actions_log').update({
        executed: true, execution_result: executionResult.details,
        approved_at: new Date().toISOString(), approved_by: 'auto_whitelist',
      }).eq('id', logRow.id);
    } else if (RESEND_API_KEY && ADMIN_EMAILS.length > 0) {
      // Email Mario for approval
      await emailMario(RESEND_API_KEY, ADMIN_EMAILS, diagnosis, logRow.id, SUPABASE_URL);
    }

    return jsonResponse({
      diagnosis,
      auto_executed: willAutoExecute,
      execution_result: executionResult,
      action_log_id: logRow.id,
      failures_analyzed: failures.length,
    });
  } catch (e) {
    return jsonResponse({ error: 'AI Doctor failed', details: (e as Error).message }, 500);
  }
});

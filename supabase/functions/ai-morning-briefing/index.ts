// Edge Function: ai-morning-briefing
// Wakes up at 6am Pacific (13:00 UTC PDT). Asks Claude to produce ONE
// prioritized email of: what AI fixed overnight + what Mario needs to do
// today, with time estimates totaling <= 4 hours.
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

const SYSTEM_PROMPT = `You are the AI Doctor's morning briefing writer for Maestro HVACR. Mario sleeps; you analyze everything that happened overnight and produce ONE concise, prioritized email he reads with coffee.

Tone:
- SUCCINCT. No fluff. No philosophy. No "great job" filler.
- Spanish (es-MX). Mario is Mexican-American, comfortable with English tech terms.
- Write like a senior engineer giving a peer a 5-minute brief.

Constraints:
- Mario has MAX 4 hours of focused work in the morning before continuing his day.
- Sort his to-do list by REVENUE/UX impact first, then time-cost.
- For each item: one-line WHAT, one-line WHY, one-line HOW (concrete commands or steps), TIME estimate.
- If the to-do total exceeds 4h, drop the lowest-impact items into a "Defer" section.

Output format — strictly follow these delimiters, no prose, no markdown fences. Output the three sections in this exact order:

===SUBJECT===
🩺 Morning Brief — <one-line summary>
===STATS===
{"todo_count": N, "estimated_total_minutes": N, "diagnoses_logged": N}
===HTML===
<full HTML email body, mobile-friendly, dark theme — newlines OK here, no escaping needed>
===END===

CRITICAL: AI Doctor does NOT auto-fix anything. It only ANALYZES. Mario reviews your briefing, then opens Claude Code (a separate agent that knows his codebase) to actually apply the fixes. So the email is a triage report, not a status report. Your job is to make Mario's morning maximally efficient: clear priorities, sharp diagnoses, copy-paste-ready instructions for Claude Code.

The HTML must include these sections in order:
1. Header with overall severity emoji (✅ todo bien, ⚠️ 2-3 items pendientes, ❌ varios issues serios)
2. "📊 Lo que detecté anoche" — counts: # diagnoses logged, # unique subsystems with issues, # JS errors total, top 3 most-frequent failures
3. "🛠️ Para arreglar hoy con Claude Code (~Xh estimado)" — numbered priority list. For EACH item:
   • WHAT: one-line problem statement
   • WHY: root cause from AI Doctor diagnosis
   • TELL CLAUDE CODE: exact prompt Mario can paste into Claude Code to start the fix (e.g., 'Arregla X en Y. La causa es Z. Espera ~N minutos.')
   • TIME: minute estimate
4. "💡 Defer si no alcanza el tiempo" — items below the 4-hour cutoff
5. (optional) "🧠 Patrón nuevo aprendido" — if you spotted a recurring issue worth saving to ai_memory, propose the entry

Sort by impact: revenue-blocking first (Stripe, login broken), then UX (live streams, video), then nice-to-have (cosmetics).

Use this color palette: bg #0f172a, card bg rgba(255,255,255,0.05), text #f1f5f9, dim #94a3b8, success #22c55e, warn #facc15, fail #ef4444, link #60a5fa.`;

async function askClaude(apiKey: string, memory: any[], actions: any[], failures: any[], errors: any[]): Promise<any> {
  const memoryBlock = memory.length === 0
    ? 'No project memory entries.'
    : memory.map((m: any) => `[${m.category} · imp ${m.importance}] ${m.topic}: ${m.content}`).join('\n');

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `# PROJECT MEMORY\n\n${memoryBlock}`, cache_control: { type: 'ephemeral' } },
    ],
    messages: [
      {
        role: 'user',
        content: `Last 12 hours of activity:

# AI Doctor actions overnight
${JSON.stringify(actions, null, 2)}

# Health failures (last 12h)
${JSON.stringify(failures, null, 2)}

# JS errors (last 12h, top 20)
${JSON.stringify(errors, null, 2)}

Write Mario's morning briefing email per the contract above. Output JSON only.`,
      },
    ],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Claude ${res.status}: ${txt.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text || '';

  const subjectMatch = text.match(/===SUBJECT===\s*\n([\s\S]*?)\n===STATS===/);
  const statsMatch = text.match(/===STATS===\s*\n([\s\S]*?)\n===HTML===/);
  const htmlMatch = text.match(/===HTML===\s*\n([\s\S]*?)(?:\n===END===|\n*$)/);

  if (!subjectMatch || !htmlMatch) {
    throw new Error(`Briefing parse failed. Raw text head: ${text.slice(0, 400)}`);
  }
  const subject = subjectMatch[1].trim();
  const html_body = htmlMatch[1].trim();
  let stats: any = {};
  if (statsMatch) {
    try { stats = JSON.parse(statsMatch[1].trim()); } catch { /* tolerate */ }
  }
  return { subject, html_body, stats };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
  const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || 'floresmario30@hotmail.com,floresmario30@gmail.com').split(',').map(e => e.trim()).filter(Boolean);

  if (!ANTHROPIC_API_KEY || !RESEND_API_KEY) {
    return jsonResponse({ error: 'Missing ANTHROPIC_API_KEY or RESEND_API_KEY' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();

    const { data: memory } = await supabase
      .from('ai_memory').select('topic, category, content, importance')
      .eq('deprecated', false).order('importance', { ascending: false }).limit(30);

    const { data: actions } = await supabase
      .from('ai_actions_log').select('created_at, diagnosis, severity, action_type, action_params, executed, requires_approval, execution_result, confidence')
      .gte('created_at', since).order('created_at', { ascending: false });

    const { data: failures } = await supabase
      .from('health_log').select('subsystem, platform, status, details, checked_at')
      .neq('status', 'OK').gte('checked_at', since).order('checked_at', { ascending: false }).limit(60);

    const { data: errors } = await supabase
      .from('error_logs').select('message, severity, created_at').gte('created_at', since)
      .order('created_at', { ascending: false }).limit(20).then(r => r).catch(() => ({ data: [] }));

    const briefing = await askClaude(ANTHROPIC_API_KEY, memory || [], actions || [], failures || [], errors || []);

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'AI Doctor <noreply@maestrohvacr.com>',
        to: ADMIN_EMAILS,
        subject: briefing.subject,
        html: briefing.html_body,
      }),
    });

    return jsonResponse({
      sent: sendRes.ok,
      stats: briefing.stats,
      counts: { actions: (actions || []).length, failures: (failures || []).length, errors: (errors || []).length },
    });
  } catch (e) {
    return jsonResponse({ error: 'Morning briefing failed', details: (e as Error).message }, 500);
  }
});

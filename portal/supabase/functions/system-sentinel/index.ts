// Edge Function: system-sentinel
// Runs every 5 minutes via pg_cron. Validates the entire app stack across
// Web / iOS / Android and writes one row per subsystem to health_log.
//
// Deploy: supabase functions deploy system-sentinel --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64url } from "https://deno.land/std@0.168.0/encoding/base64url.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

type CheckResult = {
  subsystem: string;
  platform: string | null;
  status: 'OK' | 'WARN' | 'FAIL';
  details: Record<string, unknown>;
  duration_ms: number;
};

async function timed<T>(fn: () => Promise<T>): Promise<{ value: T | null; error: string | null; ms: number }> {
  const t0 = Date.now();
  try {
    const value = await fn();
    return { value, error: null, ms: Date.now() - t0 };
  } catch (e) {
    return { value: null, error: (e as Error).message, ms: Date.now() - t0 };
  }
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(new Uint8Array(sig));
}

async function createMgmtToken(accessKey: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payloadB64 = base64url(enc.encode(JSON.stringify({
    access_key: accessKey, type: 'management', version: 2,
    iat: now, nbf: now, exp: now + 3600, jti: crypto.randomUUID(),
  })));
  const signature = await hmacSign(secret, `${headerB64}.${payloadB64}`);
  return `${headerB64}.${payloadB64}.${signature}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const HMS_ACCESS_KEY = Deno.env.get('HMS_ACCESS_KEY') || '';
  const HMS_APP_SECRET = Deno.env.get('HMS_APP_SECRET') || '';
  const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return jsonResponse({ error: 'Supabase env not configured' }, 500);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const results: CheckResult[] = [];

  // ── CHECK 1: Active admin in admin_staff ──
  {
    const r = await timed(async () => {
      const { data, error } = await supabase.from('admin_staff')
        .select('email, rol, activo').eq('activo', true).eq('rol', 'master');
      if (error) throw new Error(error.message);
      return { count: (data || []).length, masters: (data || []).map((d: any) => d.email) };
    });
    results.push({
      subsystem: 'admin_staff', platform: null,
      status: r.error ? 'FAIL' : (r.value && (r.value as any).count > 0 ? 'OK' : 'FAIL'),
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 2: Active logins by platform (last 24h) ──
  for (const platform of ['web', 'ios', 'android']) {
    const r = await timed(async () => {
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const { count, error } = await supabase.from('users')
        .select('id', { count: 'exact', head: true })
        .eq('last_app', platform).gte('last_active', since);
      if (error) throw new Error(error.message);
      return { active_24h: count || 0 };
    });
    const cnt = (r.value as any)?.active_24h ?? 0;
    results.push({
      subsystem: 'active_users', platform,
      status: r.error ? 'FAIL' : (cnt > 0 ? 'OK' : 'WARN'),
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 3: Stripe payments (web + android) — recent successful subs ──
  {
    const r = await timed(async () => {
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const { count, error } = await supabase.from('memberships')
        .select('id', { count: 'exact', head: true })
        .eq('activa', true).eq('source', 'stripe').gte('updated_at', since);
      if (error) throw new Error(error.message);
      return { active_stripe_7d: count || 0 };
    });
    const cnt = (r.value as any)?.active_stripe_7d ?? 0;
    results.push({
      subsystem: 'stripe_payments', platform: 'web,android',
      status: r.error ? 'FAIL' : (cnt > 0 ? 'OK' : 'WARN'),
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 4: RevenueCat / iOS payments ──
  {
    const r = await timed(async () => {
      const { count, error } = await supabase.from('memberships')
        .select('id', { count: 'exact', head: true })
        .not('revenuecat_customer_id', 'is', null).eq('activa', true);
      if (error) throw new Error(error.message);
      return { active_revenuecat: count || 0 };
    });
    results.push({
      subsystem: 'revenuecat_payments', platform: 'ios',
      status: r.error ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 5: Push subscriptions count by inferred platform ──
  {
    const r = await timed(async () => {
      const { data, error } = await supabase.from('push_subscriptions')
        .select('user_agent, active').eq('active', true);
      if (error) throw new Error(error.message);
      const counts: Record<string, number> = { web: 0, ios: 0, android: 0, unknown: 0 };
      for (const row of data || []) {
        const ua = (row.user_agent || '').toLowerCase();
        if (ua.includes('android')) counts.android++;
        else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) counts.ios++;
        else if (ua) counts.web++;
        else counts.unknown++;
      }
      return counts;
    });
    const total = r.value ? Object.values(r.value as Record<string, number>).reduce((a, b) => a + b, 0) : 0;
    results.push({
      subsystem: 'push_subscriptions', platform: null,
      status: r.error ? 'FAIL' : (total > 0 ? 'OK' : 'WARN'),
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 6: Live streaming infra (100ms reachable) ──
  {
    const r = await timed(async () => {
      if (!HMS_ACCESS_KEY || !HMS_APP_SECRET) return { reachable: false, reason: 'no creds' };
      const mgmt = await createMgmtToken(HMS_ACCESS_KEY, HMS_APP_SECRET);
      const res = await fetch('https://api.100ms.live/v2/live-streams?limit=1', {
        headers: { 'Authorization': `Bearer ${mgmt}` },
      });
      return { reachable: res.ok, http_status: res.status };
    });
    const reachable = (r.value as any)?.reachable;
    results.push({
      subsystem: 'live_streaming_100ms', platform: null,
      status: r.error || !reachable ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 7: Critical edge functions reachable ──
  {
    const fns = ['hms-token', 'cf-stream-proxy', 'send-push-notification', 'get-stripe-data', 'live-stream-health-check'];
    for (const fn of fns) {
      const r = await timed(async () => {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}`, {
          method: 'OPTIONS',
          headers: { 'Origin': 'https://maestrohvacr.com' },
        });
        return { http_status: res.status, reachable: res.status < 500 };
      });
      results.push({
        subsystem: `edge_${fn}`, platform: null,
        status: r.error || !(r.value as any)?.reachable ? 'FAIL' : 'OK',
        details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
        duration_ms: r.ms,
      });
    }
  }

  // ── CHECK 8: Database critical tables readable ──
  {
    const tables = ['users', 'memberships', 'live_streams', 'admin_staff', 'push_subscriptions'];
    for (const tbl of tables) {
      const r = await timed(async () => {
        const { count, error } = await supabase.from(tbl).select('*', { count: 'exact', head: true });
        if (error) throw new Error(error.message);
        return { rows: count || 0 };
      });
      results.push({
        subsystem: `db_${tbl}`, platform: null,
        status: r.error ? 'FAIL' : 'OK',
        details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
        duration_ms: r.ms,
      });
    }
  }

  // ── CHECK 9: Stripe API reachable ──
  if (STRIPE_SECRET_KEY) {
    const r = await timed(async () => {
      const res = await fetch('https://api.stripe.com/v1/balance', {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
      });
      return { http_status: res.status, reachable: res.ok };
    });
    results.push({
      subsystem: 'stripe_api', platform: null,
      status: r.error || !(r.value as any)?.reachable ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 9.1: Web HTTP probe — production homepage reachable ──
  {
    const r = await timed(async () => {
      const res = await fetch('https://maestrohvacr.com/', { redirect: 'follow' });
      const ok = res.ok;
      const contentType = res.headers.get('content-type') || '';
      const isHtml = contentType.includes('text/html');
      return { http_status: res.status, content_type: contentType, is_html: isHtml, ok: ok && isHtml };
    });
    const ok = (r.value as any)?.ok;
    results.push({
      subsystem: 'web_homepage', platform: 'web',
      status: r.error || !ok ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 9.2: Web JS asset MIME type probe — catches CF Pages 404→HTML fallback ──
  // (This is exactly the bug we hit with debug-overlay.js earlier today.)
  {
    const r = await timed(async () => {
      const res = await fetch('https://maestrohvacr.com/js/lazy-loader.js', { redirect: 'follow' });
      const contentType = res.headers.get('content-type') || '';
      const isJs = contentType.includes('javascript') || contentType.includes('application/x-javascript');
      return { http_status: res.status, content_type: contentType, is_js: isJs };
    });
    const isJs = (r.value as any)?.is_js;
    results.push({
      subsystem: 'web_js_mime', platform: 'web',
      status: r.error || !isJs ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 9.3: Synthetic user read — validates user table + RLS doesn't break basic SELECT ──
  {
    const r = await timed(async () => {
      const { data, error } = await supabase.from('users')
        .select('id, email, activo, acceso_completo')
        .eq('email', 'synthetic-monitor@maestrohvacr.com').limit(1).single();
      if (error) throw new Error(error.message);
      const healthy = data && data.activo && data.acceso_completo;
      return { found: !!data, activo: data?.activo, acceso_completo: data?.acceso_completo, healthy };
    });
    const ok = (r.value as any)?.healthy;
    results.push({
      subsystem: 'synthetic_user', platform: null,
      status: r.error || !ok ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 9.4: Anon-key read of live_streams — catches RLS regressions ──
  {
    const r = await timed(async () => {
      // Use anon key (not service role) so we test what students actually hit
      const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
      if (!ANON_KEY) return { skipped: true, reason: 'no anon key' };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/live_streams?select=id,title,status&limit=1`, {
        headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` },
      });
      const ok = res.ok;
      let body: unknown = null;
      try { body = await res.json(); } catch { body = null; }
      return { http_status: res.status, ok, body_preview: ok ? `array of ${(body as any[])?.length ?? 0}` : body };
    });
    const ok = (r.value as any)?.ok;
    results.push({
      subsystem: 'anon_read_live_streams', platform: null,
      status: r.error || !ok ? 'FAIL' : 'OK',
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── CHECK 10: Recent JS errors (from error-tracking client logs) ──
  {
    const r = await timed(async () => {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      // error-tracking writes to error_logs table if present; tolerate missing table.
      const { count, error } = await supabase.from('error_logs')
        .select('id', { count: 'exact', head: true }).gte('created_at', since);
      if (error) {
        return { table_missing: true, error_hour: 0 };
      }
      return { error_hour: count || 0 };
    });
    const errs = (r.value as any)?.error_hour ?? 0;
    results.push({
      subsystem: 'recent_js_errors', platform: null,
      status: errs > 50 ? 'FAIL' : (errs > 10 ? 'WARN' : 'OK'),
      details: r.error ? { error: r.error } : (r.value as Record<string, unknown>),
      duration_ms: r.ms,
    });
  }

  // ── Persist results ──
  const checked_at = new Date().toISOString();
  const rows = results.map(r => ({
    checked_at, subsystem: r.subsystem, platform: r.platform,
    status: r.status, details: r.details, duration_ms: r.duration_ms,
  }));
  const { error: insertErr } = await supabase.from('health_log').insert(rows);
  if (insertErr) {
    return jsonResponse({ error: 'Insert failed', details: insertErr.message, results }, 500);
  }

  // ── Alerting: compute state transitions and dispatch email ──
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
  const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || 'floresmario30@hotmail.com,floresmario30@gmail.com').split(',').map(e => e.trim()).filter(Boolean);
  const alertEvents: Array<{ subsystem: string; platform: string | null; type: 'ALERT' | 'RECOVERY'; details: Record<string, unknown> }> = [];

  for (const r of results) {
    const platformKey = r.platform || '';
    const { data: stateRows } = await supabase
      .from('alert_state').select('*')
      .eq('subsystem', r.subsystem).eq('platform', platformKey).limit(1);
    const state = (stateRows && stateRows[0]) || { subsystem: r.subsystem, platform: platformKey, alerted: false, consecutive_fails: 0 };

    let newConsecutiveFails = state.consecutive_fails || 0;
    let newAlerted = state.alerted || false;
    const updates: Record<string, unknown> = {
      subsystem: r.subsystem, platform: platformKey,
    };

    if (r.status === 'FAIL') {
      newConsecutiveFails = newConsecutiveFails + 1;
      if (newConsecutiveFails >= 3 && !newAlerted) {
        newAlerted = true;
        updates.last_alert_at = checked_at;
        alertEvents.push({ subsystem: r.subsystem, platform: r.platform, type: 'ALERT', details: r.details });
      }
    } else {
      // OK or WARN — reset fail counter
      if (newAlerted && r.status === 'OK') {
        // Recovery transition — only on confirmed OK (not WARN)
        newAlerted = false;
        updates.last_recovery_at = checked_at;
        alertEvents.push({ subsystem: r.subsystem, platform: r.platform, type: 'RECOVERY', details: r.details });
      }
      newConsecutiveFails = 0;
    }

    updates.consecutive_fails = newConsecutiveFails;
    updates.alerted = newAlerted;

    await supabase.from('alert_state').upsert(updates, { onConflict: 'subsystem,platform' });
  }

  // Dispatch alerts via Resend if there are any state transitions and the API key is set.
  let alertsSent = 0;
  if (RESEND_API_KEY && ADMIN_EMAILS.length > 0 && alertEvents.length > 0) {
    const subjectAlert = alertEvents.filter(e => e.type === 'ALERT').length;
    const subjectRec = alertEvents.filter(e => e.type === 'RECOVERY').length;
    const subjectParts: string[] = [];
    if (subjectAlert) subjectParts.push(`${subjectAlert} ALERT`);
    if (subjectRec) subjectParts.push(`${subjectRec} RECOVERY`);
    const subject = `🩺 Maestro System Health: ${subjectParts.join(' + ')}`;

    let html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0f172a;color:#f1f5f9;padding:20px;">`;
    html += `<h2 style="color:#f1f5f9;margin:0 0 16px;">🩺 System Health — ${checked_at}</h2>`;
    for (const ev of alertEvents) {
      const color = ev.type === 'ALERT' ? '#ef4444' : '#22c55e';
      const icon = ev.type === 'ALERT' ? '❌' : '✅';
      const verb = ev.type === 'ALERT' ? 'FAILING (3+ consecutive)' : 'RECOVERED';
      html += `<div style="background:rgba(255,255,255,0.05);border-left:4px solid ${color};padding:14px 18px;margin-bottom:10px;border-radius:6px;">`;
      html += `<div style="font-size:14px;font-weight:700;color:${color};margin-bottom:6px;">${icon} ${ev.subsystem}${ev.platform ? ' · ' + ev.platform : ''} — ${verb}</div>`;
      html += `<pre style="margin:0;color:#cbd5e1;font-size:12px;white-space:pre-wrap;">${JSON.stringify(ev.details, null, 2)}</pre>`;
      html += `</div>`;
    }
    html += `<p style="color:#94a3b8;font-size:11px;margin-top:20px;">Dashboard: <a href="https://maestrohvacr.com/#adminDashboardScreen" style="color:#60a5fa;">🩺 System Health</a></p>`;
    html += `</div>`;

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Maestro Sentinel <noreply@maestrohvacr.com>',
          to: ADMIN_EMAILS,
          subject,
          html,
        }),
      });
      if (resendRes.ok) alertsSent = alertEvents.length;
      else console.error('[Sentinel] Resend error:', await resendRes.text());
    } catch (e) {
      console.error('[Sentinel] Resend threw:', (e as Error).message);
    }
  }

  // Summary
  const summary = {
    checked_at,
    total: results.length,
    ok: results.filter(r => r.status === 'OK').length,
    warn: results.filter(r => r.status === 'WARN').length,
    fail: results.filter(r => r.status === 'FAIL').length,
    alert_events: alertEvents.length,
    alerts_emailed: alertsSent,
    failures: results.filter(r => r.status === 'FAIL').map(r => ({ subsystem: r.subsystem, platform: r.platform, details: r.details })),
  };

  return jsonResponse(summary);
});

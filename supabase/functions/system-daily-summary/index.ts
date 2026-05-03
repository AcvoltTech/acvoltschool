// Edge Function: system-daily-summary
// Runs daily at 7am Pacific (14:00 UTC PDT, 15:00 UTC PST). Reads the last
// 24h of health_log, summarizes per subsystem, emails Mario.
//
// Deploy: supabase functions deploy system-daily-summary --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
  const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || 'floresmario30@hotmail.com,floresmario30@gmail.com').split(',').map(e => e.trim()).filter(Boolean);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return jsonResponse({ error: 'Supabase env not configured' }, 500);
  }
  if (!RESEND_API_KEY) {
    return jsonResponse({ error: 'RESEND_API_KEY not set' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from('health_log').select('subsystem, platform, status, checked_at')
    .gte('checked_at', since);
  if (error) return jsonResponse({ error: error.message }, 500);

  // Aggregate per (subsystem, platform)
  type Agg = { ok: number; warn: number; fail: number; total: number };
  const groups: Record<string, Agg> = {};
  for (const row of data || []) {
    const key = `${row.subsystem}|${row.platform || ''}`;
    if (!groups[key]) groups[key] = { ok: 0, warn: 0, fail: 0, total: 0 };
    groups[key].total++;
    if (row.status === 'OK') groups[key].ok++;
    else if (row.status === 'WARN') groups[key].warn++;
    else if (row.status === 'FAIL') groups[key].fail++;
  }

  // Sort: most failures first
  const sorted = Object.entries(groups).sort((a, b) => {
    if (b[1].fail !== a[1].fail) return b[1].fail - a[1].fail;
    return b[1].warn - a[1].warn;
  });

  const totalChecks = (data || []).length;
  const totalFails = sorted.reduce((s, [, v]) => s + v.fail, 0);
  const totalWarns = sorted.reduce((s, [, v]) => s + v.warn, 0);
  const overall = totalFails > 0 ? '❌' : (totalWarns > 0 ? '⚠️' : '✅');
  const overallVerb = totalFails > 0 ? 'PROBLEMS DETECTED' : (totalWarns > 0 ? 'MINOR WARNINGS' : 'ALL CLEAR');

  let html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0f172a;color:#f1f5f9;padding:24px;">`;
  html += `<h1 style="margin:0 0 4px;font-size:22px;">${overall} Maestro Daily Health — ${overallVerb}</h1>`;
  html += `<p style="margin:0 0 18px;color:#94a3b8;font-size:13px;">Last 24h · ${totalChecks} checks · ${totalFails} fails · ${totalWarns} warns</p>`;

  if (sorted.length === 0) {
    html += `<div style="color:#facc15;padding:14px;">No health_log entries in the last 24h. Sentinel may not be running.</div>`;
  } else {
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px;">`;
    html += `<thead><tr style="background:rgba(255,255,255,0.05);">`;
    html += `<th style="text-align:left;padding:10px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);">Subsystem</th>`;
    html += `<th style="text-align:left;padding:10px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);">Platform</th>`;
    html += `<th style="text-align:right;padding:10px;color:#22c55e;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);">OK</th>`;
    html += `<th style="text-align:right;padding:10px;color:#facc15;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);">WARN</th>`;
    html += `<th style="text-align:right;padding:10px;color:#ef4444;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);">FAIL</th>`;
    html += `</tr></thead><tbody>`;

    for (const [key, agg] of sorted) {
      const [subsystem, platform] = key.split('|');
      const rowColor = agg.fail > 0 ? 'rgba(239,68,68,0.06)' : (agg.warn > 0 ? 'rgba(234,179,8,0.04)' : 'transparent');
      html += `<tr style="background:${rowColor};">`;
      html += `<td style="padding:8px 10px;color:#e2e8f0;border-bottom:1px solid rgba(255,255,255,0.05);">${subsystem}</td>`;
      html += `<td style="padding:8px 10px;color:#94a3b8;border-bottom:1px solid rgba(255,255,255,0.05);">${platform || '—'}</td>`;
      html += `<td style="padding:8px 10px;color:#22c55e;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${agg.ok}</td>`;
      html += `<td style="padding:8px 10px;color:#facc15;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${agg.warn}</td>`;
      html += `<td style="padding:8px 10px;color:#ef4444;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);font-weight:700;">${agg.fail}</td>`;
      html += `</tr>`;
    }
    html += `</tbody></table>`;
  }

  html += `<p style="margin-top:24px;color:#94a3b8;font-size:11px;">Live dashboard: <a href="https://maestrohvacr.com/#adminDashboardScreen" style="color:#60a5fa;">maestrohvacr.com/admin → 🩺 System Health</a></p>`;
  html += `</div>`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Maestro Sentinel <noreply@maestrohvacr.com>',
        to: ADMIN_EMAILS,
        subject: `${overall} Maestro Daily Health — ${overallVerb}`,
        html,
      }),
    });
    const ok = resendRes.ok;
    const txt = ok ? null : await resendRes.text();
    return jsonResponse({ sent: ok, totals: { checks: totalChecks, fails: totalFails, warns: totalWarns }, error: txt });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});

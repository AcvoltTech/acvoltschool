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

// ── Lector paginado (rompe el tope de 1,000 filas de PostgREST) ──
// 🔴 RAÍZ: PostgREST corta TODA consulta en 1,000 filas (max_rows = 1000, del SERVIDOR).
// Sin error, sin aviso: HTTP 200 con exactamente 1,000 filas. 🪤 `.limit(N)` NO sirve.
// 🪤 Se ordena por `id` (ÚNICO): ordenar por `checked_at` (que tiene empates de sobra,
// el sentinel escribe varias filas en el mismo instante) repetiría filas en una página
// y se saltaría otras — el conteo de fallas saldría mal en las dos direcciones.
// 🪤 supabase-js NUNCA tira excepción: se revisa `error` en CADA página y el resumen
// dice que va INCOMPLETO en vez de presentar medio día como si fuera el día entero.
const PAGE_SIZE = 1000;
const MAX_PAGES = 100; // tope de seguridad (100k filas) para no caer en un bucle eterno
async function fetchAllPaged<T>(
  build: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: { message?: string } | null }>,
): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * PAGE_SIZE;
    const { data, error } = await build(offset, offset + PAGE_SIZE - 1);
    if (error) return { rows, error: error.message || String(error) };
    const batch = (data || []) as T[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return { rows, error: null };
  }
  return { rows, error: `Se alcanzó el tope de ${MAX_PAGES} páginas (${MAX_PAGES * PAGE_SIZE} filas)` };
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

  // 🔴 RAÍZ (medido 2026-09-10): en las últimas 24 h hay 6,912 filas en `health_log`
  // (la tabla entera trae 947,252), pero esta lectura devolvía 1,000 — y encima sin
  // `.order()`, así que ni siquiera se sabía CUÁLES 1,000. Síntoma real: el correo
  // diario sub-reportaba las fallas; un subsistema podía estar caído todo el día y no
  // aparecer nunca en el resumen. Ahora se pagina, ordenado por `id`.
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  type HealthRow = { subsystem: string; platform: string | null; status: string; checked_at: string };
  const { rows: data, error } = await fetchAllPaged<HealthRow>(
    (from, to) => supabase
      .from('health_log').select('id, subsystem, platform, status, checked_at')
      .gte('checked_at', since)
      .order('id', { ascending: true })
      .range(from, to),
  );
  // 🪤 Si no se leyó NADA, no hay resumen que mandar: error duro (mandar "ALL CLEAR"
  // cuando en realidad no pudimos leer sería la peor mentira posible de este correo).
  if (error && data.length === 0) return jsonResponse({ error }, 500);
  const partialRead = error;

  // Aggregate per (subsystem, platform)
  type Agg = { ok: number; warn: number; fail: number; total: number };
  const groups: Record<string, Agg> = {};
  for (const row of data) {
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

  const totalChecks = data.length;
  const totalFails = sorted.reduce((s, [, v]) => s + v.fail, 0);
  const totalWarns = sorted.reduce((s, [, v]) => s + v.warn, 0);
  const overall = totalFails > 0 ? '❌' : (totalWarns > 0 ? '⚠️' : '✅');
  const overallVerb = totalFails > 0 ? 'PROBLEMS DETECTED' : (totalWarns > 0 ? 'MINOR WARNINGS' : 'ALL CLEAR');

  let html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0f172a;color:#f1f5f9;padding:24px;">`;
  html += `<h1 style="margin:0 0 4px;font-size:22px;">${overall} Maestro Daily Health — ${overallVerb}</h1>`;
  html += `<p style="margin:0 0 18px;color:#94a3b8;font-size:13px;">Last 24h · ${totalChecks} checks · ${totalFails} fails · ${totalWarns} warns</p>`;
  // 🪤 Si la lectura de health_log se quedó a medias, el correo lo DICE. Un resumen
  // incompleto que se ve completo es exactamente cómo un subsistema caído pasa inadvertido.
  if (partialRead) {
    html += `<div style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:8px;padding:12px;margin:0 0 18px;color:#fecaca;font-size:13px;">⚠️ LECTURA INCOMPLETA de health_log — este resumen cubre solo ${totalChecks} filas de las últimas 24h. Error: ${partialRead}. Los conteos de abajo van POR DEBAJO de la realidad.</div>`;
  }

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
    return jsonResponse({
      sent: ok,
      totals: { checks: totalChecks, fails: totalFails, warns: totalWarns },
      ...(partialRead ? { partial: true, health_log_read_error: partialRead } : {}),
      error: txt,
    });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});

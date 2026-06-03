// Edge Function: zone-visits  (contador de visitas por zona del curso — PRUEBA SOCIAL)
// Anon. El dashboard de la app loguea una visita por zona (dedup por client_id) y
// pide los conteos para mostrar "👁️ N técnicos han entrado" en cada tarjeta.
// "eso los hace que entren a ver también" — Mario 2026-06-03.
// Deploy: supabase functions deploy zone-visits --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED = [
  'https://maestrohvacr.com', 'https://www.maestrohvacr.com',
  'https://clon-ios-googleplay.pages.dev', 'https://maestroac-app-clon.pages.dev',
  'https://acvoltschool.com', 'https://www.acvoltschool.com', 'https://acvoltschool.pages.dev',
  'http://localhost:3000', 'http://127.0.0.1:5500', 'capacitor://localhost', 'http://localhost',
];
let cors: Record<string, string> = {};
function initCors(req: Request) {
  const o = req.headers.get('origin') || '';
  cors = { 'Access-Control-Allow-Origin': ALLOWED.includes(o) ? o : '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
}
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } }); }
const clean = (s: unknown, n: number) => String(s == null ? '' : s).slice(0, n).trim();

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === 'counts') {
      const zones = Array.isArray(body.zones) ? body.zones.map((z: unknown) => clean(z, 40)).filter(Boolean).slice(0, 30) : [];
      if (!zones.length) return json({ counts: {} });
      const { data, error } = await sb.rpc('zone_visit_counts', { p_zones: zones });
      if (error) return json({ error: error.message }, 500);
      const counts: Record<string, number> = {};
      for (const z of zones) counts[z] = 0;
      for (const r of (data || [])) counts[r.zone_key] = Number(r.c) || 0;
      return json({ counts });
    }

    if (action === 'log') {
      const zone = clean(body.zone, 40);
      const client_id = clean(body.client_id, 64) || 'anon';
      if (!zone) return json({ error: 'zone requerido' }, 400);
      // dedup por (zone_key, client_id) gracias al unique index → ignora duplicados
      await sb.from('zone_visits').upsert({ zone_key: zone, client_id }, { onConflict: 'zone_key,client_id', ignoreDuplicates: true });
      return json({ ok: true });
    }

    return json({ error: 'unknown action' }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});

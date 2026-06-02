// Edge Function: cert-request
// Certificados del EXAMEN FINAL de Certificación HVACR.
// Flujo (Mario 2026-06-02): el técnico pasa el examen final (>=80%) en la app →
// se crea una solicitud PENDIENTE aquí → el Director la ve en su CRM y la FIRMA
// (se le estampa la firma guardada en app_config.director_signature) → válido.
//
// Actions (POST body.action):
//   'submit'  → PÚBLICO. Crea/actualiza una solicitud pendiente. body: {name,email,score,lang,cert_id,exam,title,zones}
//   'list'    → ADMIN. Devuelve las solicitudes (pendientes y firmadas). body: {admin_email}
//   'sign'    → ADMIN. Firma una solicitud: status='signed', adjunta la firma del Director. body: {admin_email, cert_id}
//   'revoke'  → ADMIN. Regresa una solicitud a 'pending'. body: {admin_email, cert_id}
//
// Tabla: public.cert_requests (RLS habilitada, sin policies → solo service role).
// Deploy: npx supabase functions deploy cert-request --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com', 'https://www.maestrohvacr.com',
  'https://acvoltschool.com', 'https://www.acvoltschool.com',
  'https://acvoltschool.pages.dev', 'https://clon-ios-googleplay.pages.dev',
  'https://maestroac-app-clon.pages.dev', 'http://localhost:3000', 'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
function clip(s: unknown, n: number) { return String(s == null ? '' : s).slice(0, n); }

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || 'submit');
    const now = () => new Date().toISOString();

    // ── PÚBLICO: el técnico envía su solicitud al pasar el examen final ──
    if (action === 'submit') {
      const cert_id = clip(body.cert_id, 60).trim();
      const name = clip(body.name, 120).trim();
      if (!cert_id || !name) return json({ error: 'cert_id y name son requeridos' }, 400);
      let score = parseInt(String(body.score), 10); if (isNaN(score)) score = 0;
      score = Math.max(0, Math.min(100, score));
      const row = {
        cert_id,
        name,
        email: clip(body.email, 160).trim() || null,
        score,
        lang: clip(body.lang, 4) || 'es',
        exam: clip(body.exam, 24) || 'final',
        title: clip(body.title, 120) || 'Certificación HVACR',
        zones: Array.isArray(body.zones) ? body.zones : null,
        status: 'pending',
        signed_at: null,
        signed_by: null,
      };
      // upsert por cert_id (reintentos no duplican)
      const ex = await sb.from('cert_requests').select('id,status').eq('cert_id', cert_id).limit(1);
      if (ex.error) throw ex.error;
      if (ex.data && ex.data.length) {
        return json({ ok: true, already: true, status: ex.data[0].status });
      }
      const { error } = await sb.from('cert_requests').insert(row);
      if (error) throw error;
      return json({ ok: true, cert_id, status: 'pending' });
    }

    // ── PÚBLICO: el técnico consulta el estado de SU certificado (por folio) ──
    if (action === 'status') {
      const cert_id = clip(body.cert_id, 60).trim();
      if (!cert_id) return json({ error: 'cert_id requerido' }, 400);
      const { data, error } = await sb.from('cert_requests')
        .select('cert_id,name,score,lang,title,status,signed_at').eq('cert_id', cert_id).limit(1);
      if (error) throw error;
      if (!data || !data.length) return json({ ok: true, found: false });
      const r = data[0];
      return json({ ok: true, found: true, status: r.status, signed: r.status === 'signed', name: r.name, score: r.score, title: r.title, lang: r.lang, signed_at: r.signed_at });
    }

    // ── ADMIN: verificar identidad del Director (admin_staff) ──
    const { admin_email } = body;
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    if (action === 'list') {
      const { data, error } = await sb.from('cert_requests')
        .select('cert_id,name,email,score,lang,exam,title,zones,status,created_at,signed_at,signed_by')
        .order('status', { ascending: true })   // pending antes que signed
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return json({ ok: true, requests: data || [] });
    }

    if (action === 'sign') {
      const cert_id = clip(body.cert_id, 60).trim();
      if (!cert_id) return json({ error: 'cert_id requerido' }, 400);
      // confirmar que hay firma del Director guardada
      const sig = await sb.from('app_config').select('value').eq('key', 'director_signature').limit(1);
      const hasSig = !!(sig.data && sig.data[0] && sig.data[0].value);
      if (!hasSig) return json({ error: 'No hay firma del Director guardada. Dibuja tu firma primero.' }, 400);
      const { error } = await sb.from('cert_requests')
        .update({ status: 'signed', signed_at: now(), signed_by: clip(admin_email, 160) })
        .eq('cert_id', cert_id);
      if (error) throw error;
      return json({ ok: true, cert_id, status: 'signed' });
    }

    if (action === 'revoke') {
      const cert_id = clip(body.cert_id, 60).trim();
      if (!cert_id) return json({ error: 'cert_id requerido' }, 400);
      const { error } = await sb.from('cert_requests')
        .update({ status: 'pending', signed_at: null, signed_by: null })
        .eq('cert_id', cert_id);
      if (error) throw error;
      return json({ ok: true, cert_id, status: 'pending' });
    }

    return json({ error: 'Acción no reconocida' }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});

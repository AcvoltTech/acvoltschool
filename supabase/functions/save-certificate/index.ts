// Edge Function: save-certificate
// Guarda/lee certificados de los técnicos con SERVICE ROLE (salta RLS).
//
// CONTEXTO (Mario 2026-06-05): el RLS lockdown de mediados de marzo
// (20260316200000 / 20260321200000) puso policies `user_id = my_user_id()` en
// public.certificates. El cliente guarda con `supabaseUserId` (resuelto vía edge
// function, NO vía auth.uid()), así que TODA inserción directa chocaba con RLS y
// fallaba en silencio desde ~19-mar. Resultado: los certificados ganados desde
// marzo viven SOLO en el localStorage del teléfono, sin respaldo en el servidor.
// Esta función reabre el guardado por el patrón correcto (service role), igual que
// users-data / cta-video-save.
//
// Actions (POST body.action):
//   'save' → PÚBLICO. Sube uno o más certs del técnico. body: {email, certs:[{nivel,score,total_questions,porcentaje,certificate_number,fecha_obtenido,cert_status}]}
//   'list' → PÚBLICO. Devuelve los certs del técnico. body: {email}
//
// Resuelve user_id por email (service role). NO borra nada (upsert idempotente
// onConflict user_id,nivel, sin bajar el score si ya hay uno mayor).
// Deploy: npx supabase functions deploy save-certificate --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

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
function numOr(v: unknown, d = 0) { const n = Number(v); return isFinite(n) ? n : d; }

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
    const action = String(body.action || 'save');
    const email = clip(body.email, 160).toLowerCase().trim();
    if (!email || !/.+@.+\..+/.test(email)) return json({ error: 'email inválido' }, 400);

    // Resolver user_id por email (service role, sin RLS).
    const ures = await sb.from('users').select('id').eq('email', email).limit(1).maybeSingle();
    const userId = ures.data && ures.data.id;
    if (!userId) return json({ error: 'usuario no encontrado' }, 404);

    // ── LIST: devolver los certs del técnico ──
    if (action === 'list') {
      const cres = await sb.from('certificates')
        .select('nivel,score,total_questions,porcentaje,certificate_number,fecha_obtenido,cert_status,certificate_id')
        .eq('user_id', userId);
      return json({ ok: true, certificates: cres.data || [] });
    }

    // ── SAVE: subir/actualizar los certs del técnico ──
    if (action === 'save') {
      const incoming = Array.isArray(body.certs) ? body.certs : (body.cert ? [body.cert] : []);
      if (!incoming.length) return json({ error: 'sin certs' }, 400);

      // Traer los existentes para no DEGRADAR un score ya guardado.
      const existRes = await sb.from('certificates').select('nivel,score').eq('user_id', userId);
      const existScore: Record<string, number> = {};
      (existRes.data || []).forEach((r: any) => { existScore[r.nivel] = numOr(r.score, 0); });

      const rows: any[] = [];
      const seen = new Set<string>();
      for (const c of incoming) {
        const nivel = clip(c.nivel || c.level || c.levelId, 64);
        if (!nivel || seen.has(nivel)) continue;
        seen.add(nivel);
        const score = numOr(c.score, 0);
        // No bajar un score ya existente mayor.
        if (existScore[nivel] != null && existScore[nivel] > score) continue;
        rows.push({
          user_id: userId,
          nivel: nivel,
          score: score,
          total_questions: numOr(c.total_questions ?? c.totalQuestions, 0),
          porcentaje: numOr(c.porcentaje ?? c.percentage ?? c.score, 0),
          certificate_number: clip(c.certificate_number || c.certificateNumber || c.certificateId || '', 64) || null,
          fecha_obtenido: clip(c.fecha_obtenido || c.dateRaw || c.date || new Date().toISOString(), 40),
          cert_status: clip(c.cert_status || 'approved', 20),
        });
      }
      if (!rows.length) return json({ ok: true, saved: 0, note: 'nada nuevo' });

      const up = await sb.from('certificates').upsert(rows, { onConflict: 'user_id,nivel', ignoreDuplicates: false });
      if (up.error) return json({ error: up.error.message }, 500);
      return json({ ok: true, saved: rows.length });
    }

    return json({ error: 'acción desconocida' }, 400);
  } catch (e) {
    return json({ error: (e && (e as Error).message) || 'error' }, 500);
  }
});

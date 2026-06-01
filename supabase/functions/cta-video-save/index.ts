// Edge Function: cta-video-save
// Admin saves the dashboard Call-to-Action video config into app_config
// (key = "cta_video"). The APP reads app_config directly (anon SELECT is allowed),
// so only the WRITE is gated here behind verifyAdminAuth. No new table, no RLS
// change. Mario 2026-05-31 — the "open-loop" strategy: social hook → payoff
// (this explanation video) lives only inside the app, driving downloads.
// Deploy: npx supabase functions deploy cta-video-save --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvoltschool.com',
  'https://www.acvoltschool.com',
  'https://acvoltschool.pages.dev',
  'https://clon-ios-googleplay.pages.dev',
  'https://maestroac-app-clon.pages.dev',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
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

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 20 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json();
    const { admin_email } = body;

    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    const title = String(body.title || '').trim();
    const stream_uid = String(body.stream_uid || '').trim();
    const teaser = String(body.teaser || '').trim();
    const cta_text = String(body.cta_text || '').trim();
    const active = body.active !== false; // default ON

    if (!title || !stream_uid) {
      return json({ error: 'Título y video (Stream UID) son requeridos.' }, 400);
    }

    const now = new Date().toISOString();
    const payload = JSON.stringify({
      title, teaser, stream_uid, cta_text, active,
      updated_by: admin_email || null, updated_at: now,
    });

    // Upsert without assuming a unique constraint: select → update | insert.
    const existing = await sb.from('app_config').select('key').eq('key', 'cta_video').limit(1);
    if (existing.error) throw existing.error;
    if (existing.data && existing.data.length) {
      const { error } = await sb.from('app_config').update({ value: payload, updated_at: now }).eq('key', 'cta_video');
      if (error) throw error;
    } else {
      const { error } = await sb.from('app_config').insert({ key: 'cta_video', value: payload, updated_at: now });
      if (error) throw error;
    }

    return json({ ok: true, cta: JSON.parse(payload) });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

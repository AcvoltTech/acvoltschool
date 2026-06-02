// Edge Function: cta-video-save
// Admin-gated writes for the dashboard "La Explicación" video LIBRARY.
// Storage (all in app_config, anon SELECT allowed so the app reads directly):
//   - key "explicaciones"  → JSON array of videos {id,title,teaser,video,cta_text,date,active,...}
//   - key "social_links"   → JSON {tiktok,instagram,facebook,youtube,whatsapp}
//   - key "cta_video"       → legacy single (kept in sync = most-recent active) for back-compat
// Actions (POST body.action): 'save_video' | 'delete_video' | 'save_social'.
// A legacy body (title+stream_uid, no action) upserts a single 'v_main' video.
// Mario 2026-05-31 — open-loop strategy: social hook → payoff library in-app.
// Deploy: npx supabase functions deploy cta-video-save --no-verify-jwt

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

    const body = await req.json();
    const { admin_email } = body;
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    const now = () => new Date().toISOString();

    async function getKey(key: string): Promise<unknown> {
      const r = await sb.from('app_config').select('value').eq('key', key).limit(1);
      if (r.error) throw r.error;
      if (r.data && r.data[0] && r.data[0].value) { try { return JSON.parse(r.data[0].value); } catch { return null; } }
      return null;
    }
    async function setKey(key: string, val: unknown) {
      const payload = JSON.stringify(val);
      const ex = await sb.from('app_config').select('key').eq('key', key).limit(1);
      if (ex.error) throw ex.error;
      if (ex.data && ex.data.length) {
        const { error } = await sb.from('app_config').update({ value: payload, updated_at: now() }).eq('key', key);
        if (error) throw error;
      } else {
        const { error } = await sb.from('app_config').insert({ key, value: payload, updated_at: now() });
        if (error) throw error;
      }
    }
    // deno-lint-ignore no-explicit-any
    async function readArr(): Promise<any[]> { const v = await getKey('explicaciones'); return Array.isArray(v) ? v : []; }
    // deno-lint-ignore no-explicit-any
    async function syncLegacy(arr: any[]) {
      const latest = arr.filter((v) => v.active).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
      if (latest) await setKey('cta_video', { title: latest.title, teaser: latest.teaser, stream_uid: latest.video, cta_text: latest.cta_text, active: true });
      else await setKey('cta_video', { title: 'placeholder', stream_uid: 'x', active: false });
    }

    const action = String(body.action || '');

    if (action === 'save_social') {
      const s = body.social || {};
      await setKey('social_links', {
        tiktok: String(s.tiktok || '').trim(), instagram: String(s.instagram || '').trim(),
        facebook: String(s.facebook || '').trim(), youtube: String(s.youtube || '').trim(),
        whatsapp: String(s.whatsapp || '').trim(),
      });
      return json({ ok: true });
    }

    if (action === 'save_director_signature') {
      const sig = String(body.signature || '');
      if (sig.indexOf('data:image/') !== 0 || sig.length > 800000) {
        return json({ error: 'Firma inválida.' }, 400);
      }
      // Store RAW (the app reads app_config.director_signature.value directly as
      // an <img> src — do NOT JSON-wrap it).
      const ex = await sb.from('app_config').select('key').eq('key', 'director_signature').limit(1);
      if (ex.error) throw ex.error;
      if (ex.data && ex.data.length) {
        const { error } = await sb.from('app_config').update({ value: sig, updated_at: now() }).eq('key', 'director_signature');
        if (error) throw error;
      } else {
        const { error } = await sb.from('app_config').insert({ key: 'director_signature', value: sig, updated_at: now() });
        if (error) throw error;
      }
      return json({ ok: true });
    }

    // Curso de Refrigeración — overrides de videos (quitar/mover) que el DUEÑO
    // edita desde la app. Solo las cuentas de Mario. Mario 2026-06-02.
    if (action === 'save_curso_overrides') {
      const OWNER = ['floresmario30@hotmail.com', 'floresmario30@gmail.com'];
      if (OWNER.indexOf(String(admin_email || '').toLowerCase().trim()) === -1) {
        return json({ error: 'Solo el dueño puede editar los videos del curso.' }, 403);
      }
      const ov = body.overrides || {};
      const clean = {
        removed: Array.isArray(ov.removed) ? ov.removed.slice(0, 2000).map((s: unknown) => String(s).slice(0, 400)) : [],
        moved: (ov.moved && typeof ov.moved === 'object') ? ov.moved : {},
      };
      await setKey('curso_videos_overrides', clean);
      return json({ ok: true, overrides: clean });
    }

    // Curso de Refrigeración — MAPA de videos clasificado por staff (Manuel) en el CRM.
    // { zona: [ {uid,title} | {url,thumb,title} ] }. Cualquier admin_staff (ya verificado).
    if (action === 'save_curso_map') {
      const m = body.map;
      if (!m || typeof m !== 'object' || Array.isArray(m)) return json({ error: 'map inválido' }, 400);
      await setKey('curso_videos_map', m);
      return json({ ok: true });
    }

    if (action === 'delete_video') {
      const id = String(body.id || '');
      let arr = await readArr();
      arr = arr.filter((v) => v.id !== id);
      await setKey('explicaciones', arr);
      await syncLegacy(arr);
      return json({ ok: true, items: arr });
    }

    // save_video OR legacy single save
    const title = String(body.title || '').trim();
    const video = String(body.video || body.stream_uid || '').trim();
    const teaser = String(body.teaser || '').trim();
    const cta_text = String(body.cta_text || '').trim();
    const active = body.active !== false;
    const date = String(body.date || '').trim() || new Date().toISOString().slice(0, 10);
    if (!title || !video) return json({ error: 'Título y video son requeridos.' }, 400);

    let arr = await readArr();
    let id = String(body.id || '');
    if (!id) id = (action === 'save_video') ? ('v_' + Date.now()) : 'v_main';
    const item = { id, title, teaser, video, cta_text, active, date, updated_by: admin_email || null, updated_at: now() };
    const idx = arr.findIndex((v) => v.id === id);
    if (idx >= 0) arr[idx] = item; else arr.unshift(item);
    await setKey('explicaciones', arr);
    await syncLegacy(arr);
    return json({ ok: true, cta: item, items: arr });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

// Edge Function: explicaciones-engage
// ANON-friendly engagement for the app's Explicaciones video library (no login —
// the just-downloaded user must be able to like/comment/request). Service role
// inside, so no RLS exposure. Reuses existing tables:
//   likes     → daily_video_likes (video_id, email)
//   comments  → daily_video_comments (video_id, email, display_name, comment_text, is_hidden, reported_count)
//   views     → video_views (video_id, email)
//   peticiones→ suggestions (user_email, user_name, suggestion_text)
// Anon identity = 'anon:' + client_id (a random id the app keeps in localStorage).
// Actions: engagement | toggle_like | comments | add_comment | report_comment | log_view | add_request
// Deploy: npx supabase functions deploy explicaciones-engage --no-verify-jwt
// Mario 2026-05-31.

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
function clean(s: unknown, max: number) { return String(s == null ? '' : s).trim().slice(0, max); }

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 60 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json();
    const action = String(body.action || '');
    const clientId = clean(body.client_id, 64) || 'anon';
    const anonEmail = 'anon:' + clientId;

    if (action === 'engagement') {
      const ids: string[] = (Array.isArray(body.video_ids) ? body.video_ids : []).map((x: unknown) => String(x)).slice(0, 50);
      if (!ids.length) return json({ engagement: {} });
      // OJO: las VISTAS se cuentan con un RPC (count distinct en Postgres), NO con un
      // SELECT de todas las filas — PostgREST topa a ~1000 filas y con varios videos
      // (>1000 vistas en total) los conteos salían en 0/truncados. Misma lección del
      // email batch (anti-join en BD). Mario 2026-06-03: el de ayer mostraba 0 vistas.
      const [likesRes, commentsRes, viewsRpc] = await Promise.all([
        sb.from('daily_video_likes').select('video_id, email').in('video_id', ids),
        sb.from('daily_video_comments').select('video_id').in('video_id', ids).eq('is_hidden', false),
        sb.rpc('video_view_counts', { p_ids: ids }),
      ]);
      const eng: Record<string, { likes: number; liked: boolean; comments: number; views: number }> = {};
      for (const id of ids) eng[id] = { likes: 0, liked: false, comments: 0, views: 0 };
      for (const r of (likesRes.data || [])) { const e = eng[r.video_id]; if (e) { e.likes++; if (r.email === anonEmail) e.liked = true; } }
      for (const r of (commentsRes.data || [])) { const e = eng[r.video_id]; if (e) e.comments++; }
      for (const r of (viewsRpc.data || [])) { const e = eng[r.video_id]; if (e) e.views = Number(r.c) || 0; }
      return json({ engagement: eng });
    }

    if (action === 'toggle_like') {
      const vid = clean(body.video_id, 64);
      if (!vid) return json({ error: 'video_id required' }, 400);
      const ex = await sb.from('daily_video_likes').select('video_id').eq('video_id', vid).eq('email', anonEmail).limit(1);
      let liked: boolean;
      if (ex.data && ex.data.length) {
        await sb.from('daily_video_likes').delete().eq('video_id', vid).eq('email', anonEmail);
        liked = false;
      } else {
        await sb.from('daily_video_likes').insert({ video_id: vid, email: anonEmail });
        liked = true;
      }
      const cnt = await sb.from('daily_video_likes').select('video_id', { count: 'exact', head: true }).eq('video_id', vid);
      return json({ ok: true, liked, count: cnt.count || 0 });
    }

    if (action === 'comments') {
      const vid = clean(body.video_id, 64);
      const r = await sb.from('daily_video_comments').select('id, display_name, comment_text, created_at')
        .eq('video_id', vid).eq('is_hidden', false).order('created_at', { ascending: false }).limit(60);
      return json({ comments: r.data || [] });
    }

    if (action === 'add_comment') {
      const vid = clean(body.video_id, 64);
      const name = clean(body.name, 40) || 'Técnico';
      const text = clean(body.text, 600);
      if (!vid || !text) return json({ error: 'Falta el comentario.' }, 400);
      const ins = await sb.from('daily_video_comments').insert({ video_id: vid, email: anonEmail, display_name: name, comment_text: text }).select('id, display_name, comment_text, created_at').limit(1);
      if (ins.error) throw ins.error;
      return json({ ok: true, comment: ins.data && ins.data[0] });
    }

    if (action === 'report_comment') {
      const id = clean(body.comment_id, 64);
      if (!id) return json({ error: 'comment_id required' }, 400);
      // increment reported_count; auto-hide at >=3 reports
      const c = await sb.from('daily_video_comments').select('reported_count').eq('id', id).limit(1);
      const rc = (c.data && c.data[0] ? (c.data[0].reported_count || 0) : 0) + 1;
      await sb.from('daily_video_comments').update({ reported_count: rc, is_hidden: rc >= 3 }).eq('id', id);
      return json({ ok: true });
    }

    if (action === 'log_view') {
      const vid = clean(body.video_id, 64);
      if (!vid) return json({ error: 'video_id required' }, 400);
      const ex = await sb.from('video_views').select('id').eq('video_id', vid).eq('email', anonEmail).limit(1);
      if (!(ex.data && ex.data.length)) await sb.from('video_views').insert({ video_id: vid, email: anonEmail });
      return json({ ok: true });
    }

    if (action === 'add_request') {
      const name = clean(body.name, 40) || 'Técnico';
      const text = clean(body.text, 400);
      if (!text) return json({ error: 'Escribe tu petición.' }, 400);
      const ins = await sb.from('suggestions').insert({ user_email: anonEmail, user_name: name, suggestion_text: '🎬 PETICIÓN VIDEO: ' + text });
      if (ins.error) throw ins.error;
      return json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

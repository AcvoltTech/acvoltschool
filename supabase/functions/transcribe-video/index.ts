// Edge Function: transcribe-video
// Uses Deepgram Nova-3 pre-recorded API for fast server-side transcription.
// Supports two modes:
//   1. JSON body with { video_url, language } — Deepgram downloads & transcribes (fastest)
//   2. FormData with 'file' audio/video blob + 'language' — direct upload to Deepgram
// Deploy: supabase functions deploy transcribe-video --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://www.maestrohvacr.com',
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvolttech.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-email',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 5 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const DEEPGRAM_API_KEY = Deno.env.get('DEEPGRAM_API_KEY');
    if (!DEEPGRAM_API_KEY) {
      throw new Error('DEEPGRAM_API_KEY not configured');
    }

    const contentType = req.headers.get('content-type') || '';
    let language = 'es';

    // ── Admin verification (extract admin_email from header since body varies) ──
    const adminEmailHeader = req.headers.get('x-admin-email') || '';
    if (!adminEmailHeader) return jsonResponse({ error: 'Authentication required' }, 401);
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const _sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const emailLower = adminEmailHeader.toLowerCase().trim();
    const { data: admins } = await _sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
    if (!admins || admins.length === 0) {
      // Fallback: check admin_staff table
      const { data: staff } = await _sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
      if (!staff || staff.length === 0) return jsonResponse({ error: 'Unauthorized' }, 403);
    }

    // Build Deepgram query params
    const dgParams = new URLSearchParams({
      model: 'nova-3',
      language: language,
      smart_format: 'true',
      punctuate: 'true',
      paragraphs: 'true',
    });

    let dgBody: BodyInit;
    let dgContentType: string;

    if (contentType.includes('application/json')) {
      // Mode 1: JSON with video_url — Deepgram fetches the video server-side (fastest)
      // Mode 1b (Mario 2026-06-06): JSON with stream_uid (Cloudflare Stream, los 427
      // videos del Course Editor) — activamos la descarga MP4 vía la API de Cloudflare,
      // esperamos a que esté lista y la pasamos a Deepgram.
      const body = await req.json();
      let videoUrl = body.video_url;
      language = body.language || 'es';
      dgParams.set('language', language);

      if (!videoUrl && body.stream_uid) {
        const acct = Deno.env.get('CF_ACCOUNT_ID');
        const token = Deno.env.get('CF_API_TOKEN');
        if (!acct || !token) return jsonResponse({ error: 'Cloudflare no configurado (CF_ACCOUNT_ID/CF_API_TOKEN)' }, 500);
        const uid = String(body.stream_uid).trim();
        const base = `https://api.cloudflare.com/client/v4/accounts/${acct}/stream/${uid}/downloads`;
        const cfHeaders = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
        try {
          let r = await fetch(base, { method: 'POST', headers: cfHeaders });
          let j = await r.json();
          let dl = j?.result?.default;
          for (let i = 0; i < 25 && (!dl || dl.status !== 'ready'); i++) {
            await new Promise((res) => setTimeout(res, 3000));
            r = await fetch(base, { method: 'GET', headers: cfHeaders });
            j = await r.json();
            dl = j?.result?.default;
          }
          if (!dl || !dl.url || dl.status !== 'ready') {
            return jsonResponse({ error: 'No se pudo preparar el MP4 del video en Cloudflare (intenta de nuevo en un minuto).' }, 502);
          }
          videoUrl = dl.url;
          console.log('Cloudflare MP4 listo para', uid, '→', videoUrl);
        } catch (e) {
          return jsonResponse({ error: 'Error preparando el video en Cloudflare: ' + ((e as Error).message || e) }, 502);
        }
      }

      if (!videoUrl) {
        return jsonResponse({ error: 'video_url o stream_uid requerido' }, 400);
      }

      console.log('Sending URL to Deepgram:', videoUrl);
      dgBody = JSON.stringify({ url: videoUrl });
      dgContentType = 'application/json';

    } else {
      // Mode 2: FormData with file blob — upload directly to Deepgram
      const formData = await req.formData();
      const file = formData.get('file');
      language = (formData.get('language') as string) || 'es';
      dgParams.set('language', language);

      if (!file || !(file instanceof File)) {
        return jsonResponse({ error: 'Audio file is required (FormData field "file")' }, 400);
      }

      console.log('Uploading file to Deepgram:', file.name, '(' + (file.size / (1024*1024)).toFixed(1) + ' MB)');
      dgBody = await file.arrayBuffer();
      dgContentType = file.type || 'audio/wav';
    }

    // Call Deepgram pre-recorded API
    const dgUrl = 'https://api.deepgram.com/v1/listen?' + dgParams.toString();
    const dgResponse = await fetch(dgUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + DEEPGRAM_API_KEY,
        'Content-Type': dgContentType,
      },
      body: dgBody,
    });

    if (!dgResponse.ok) {
      const errText = await dgResponse.text();
      throw new Error('Deepgram API error: ' + dgResponse.status + ' - ' + errText);
    }

    const dgResult = await dgResponse.json();

    // Extract transcript — paragraphs join with newlines for readability
    let transcript = '';
    const paragraphs = dgResult?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript;
    if (paragraphs) {
      transcript = paragraphs.trim();
    } else {
      // Fallback to flat transcript
      transcript = (dgResult?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '').trim();
    }

    const wordCount = transcript ? transcript.split(/\s+/).length : 0;
    console.log('Transcription complete:', wordCount, 'words');

    return jsonResponse({ text: transcript });

  } catch (error) {
    console.error('transcribe-video error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

// Edge Function: youtube-proxy
// Proxies YouTube Data API v3 calls server-side to hide API key
// Deploy: supabase functions deploy youtube-proxy --no-verify-jwt
// Secrets needed: YOUTUBE_API_KEY

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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

const VALID_ACTIONS = ['channels', 'playlistItems', 'videos'];

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limit: 50 req/min (loading videos needs ~13 sequential calls)
  const rl = await checkRateLimit(req, { maxRequests: 50 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) throw new Error('YOUTUBE_API_KEY not configured');

    const { action, params } = await req.json();

    if (!action || !VALID_ACTIONS.includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be one of: ' + VALID_ACTIONS.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build YouTube API URL
    const url = new URL(`https://www.googleapis.com/youtube/v3/${action}`);
    url.searchParams.set('key', YOUTUBE_API_KEY);

    // Add whitelisted params from the request
    const ALLOWED_PARAMS = ['part', 'playlistId', 'pageToken', 'maxResults', 'id', 'forHandle', 'channelId', 'order', 'type', 'q'];
    if (params && typeof params === 'object') {
      for (const [key, value] of Object.entries(params)) {
        if (key !== 'key' && ALLOWED_PARAMS.includes(key)) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    // Proxy the request to YouTube
    const ytResponse = await fetch(url.toString());
    const ytData = await ytResponse.json();

    if (!ytResponse.ok) {
      console.error('[youtube-proxy] YouTube API error:', ytData);
      return new Response(
        JSON.stringify({ error: ytData.error?.message || 'YouTube API error' }),
        { status: ytResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(ytData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[youtube-proxy] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

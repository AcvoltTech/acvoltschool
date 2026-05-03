// Edge Function: log-error
// Receives frontend errors and inserts into error_logs table
// Deploy: supabase functions deploy log-error --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

const ALLOWED_ORIGINS = [
  // Production web
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  // Active clon (iOS staging + Android native WebView, both load this URL)
  'https://clon-ios-googleplay.pages.dev',
  // Acvolt school + GH pages
  'https://acvolttech.github.io',
  // Legacy clones — kept temporarily in case any old build still posts here
  'https://maestroac-app-clon.pages.dev',
  'https://maestroac-clon.netlify.app',
  // Local dev
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

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limit: 100 req/min
  const rl = await checkRateLimit(req, { maxRequests: 100 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const body = await req.json();
    const { message, stack, url, user_email, user_agent, metadata } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const { error } = await supabase.from('error_logs').insert({
      message: String(message).substring(0, 2000),
      stack: stack ? String(stack).substring(0, 5000) : null,
      url: url ? String(url).substring(0, 2000) : null,
      user_email: user_email ? String(user_email).substring(0, 255) : null,
      user_agent: user_agent ? String(user_agent).substring(0, 500) : null,
      metadata: metadata || {},
    });

    if (error) {
      console.error('[log-error] Insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[log-error] Exception:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

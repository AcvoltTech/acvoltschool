// Edge Function: instructor-ai-chat
// Deploy: supabase functions deploy instructor-ai-chat
// Uses existing ANTHROPIC_API_KEY secret
// Supabase Project: htklsowiyjwsjnacnvnr

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  initCors(req);
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const { messages, system, max_tokens = 500, admin_email } = await req.json();

    // ========== AUTH: admin_email verification ==========
    if (!admin_email) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const SB_URL = Deno.env.get('SUPABASE_URL') || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    const SB_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (SB_SERVICE_KEY) {
      const sb = createClient(SB_URL, SB_SERVICE_KEY);
      const emailLower = admin_email.toLowerCase().trim();
      const { data: admins } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
      if (!admins || admins.length === 0) {
        const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
        if (!staff || staff.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Input length limits (prevent token bombing / cost explosion) ──
    if (messages.length > 30) {
      return new Response(
        JSON.stringify({ error: 'Too many messages (max 30)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    for (const msg of messages) {
      if (typeof msg.content === 'string' && msg.content.length > 12000) {
        return new Response(
          JSON.stringify({ error: 'Message too long (max 12000 chars)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Build Claude API request
    const apiBody: Record<string, unknown> = {
      model: 'claude-sonnet-4-6',
      max_tokens: Math.min(max_tokens, 4096),
      messages: messages,
    };
    if (system) {
      apiBody.system = system;
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(apiBody)
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      throw new Error('Anthropic API error: ' + anthropicResponse.status + ' - ' + errText);
    }

    const aiResult = await anthropicResponse.json();
    const reply = aiResult.content?.[0]?.text || '';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

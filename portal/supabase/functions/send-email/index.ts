// Edge Function: send-email
// General email sender via Resend API
// Deploy: supabase functions deploy send-email --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
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

  const rl = await checkRateLimit(req, { maxRequests: 20 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const { to, subject, html, body, from, admin_email } = await req.json();
    const emailHtml = html || body;

    if (!to || !subject || !emailHtml) {
      return jsonResponse({ error: 'to, subject, and html (or body) are required' }, 400);
    }

    // ── Admin verification via JWT (primary) or body email (fallback) ──
    const SB_URL = Deno.env.get('SUPABASE_URL');
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SB_URL || !SB_KEY) return jsonResponse({ error: 'Server configuration error' }, 500);
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return jsonResponse({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Maestro HVACR <noreply@maestrohvacr.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Resend API error: ' + response.status + ' - ' + errText);
    }

    const result = await response.json();
    console.log('Email sent to:', to, 'id:', result.id);
    return jsonResponse({ success: true, id: result.id });
  } catch (error) {
    console.error('send-email error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

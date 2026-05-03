// Edge Function: gdrive-token
// Exchanges Google OAuth auth code for tokens, and refreshes access tokens
// Deploy: supabase functions deploy gdrive-token --no-verify-jwt
// Secrets needed: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getSupabaseAdmin() {
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(url, key);
}

serve(async (req: Request) => {
  initCors(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { action, code, admin_email, redirect_uri } = await req.json();
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID') || '';
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';

    if (!clientId || !clientSecret) {
      return jsonResponse({ error: 'Google OAuth not configured on server' }, 500);
    }

    // ── Exchange auth code for tokens ──
    if (action === 'exchange') {
      if (!code || !admin_email) {
        return jsonResponse({ error: 'Missing code or admin_email' }, 400);
      }

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || 'https://maestrohvacr.com',
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.error) {
        console.error('[gdrive-token] Exchange error:', tokenData);
        return jsonResponse({ error: tokenData.error_description || tokenData.error }, 400);
      }

      // Store refresh_token in DB (upsert)
      if (tokenData.refresh_token) {
        const sb = getSupabaseAdmin();
        const { error: dbErr } = await sb
          .from('admin_oauth_tokens')
          .upsert({
            admin_email,
            provider: 'google_drive',
            refresh_token: tokenData.refresh_token,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'admin_email,provider' });

        if (dbErr) console.error('[gdrive-token] DB upsert error:', dbErr);
      }

      return jsonResponse({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      });
    }

    // ── Refresh access token ──
    if (action === 'refresh') {
      if (!admin_email) {
        return jsonResponse({ error: 'Missing admin_email' }, 400);
      }

      const sb = getSupabaseAdmin();
      const { data: tokenRow, error: dbErr } = await sb
        .from('admin_oauth_tokens')
        .select('refresh_token')
        .eq('admin_email', admin_email)
        .eq('provider', 'google_drive')
        .single();

      if (dbErr || !tokenRow) {
        return jsonResponse({ error: 'No refresh token found — re-authorize Google Drive' }, 401);
      }

      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: tokenRow.refresh_token,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const refreshData = await refreshRes.json();

      if (refreshData.error) {
        // Refresh token revoked — user must re-authorize
        if (refreshData.error === 'invalid_grant') {
          await sb.from('admin_oauth_tokens')
            .delete()
            .eq('admin_email', admin_email)
            .eq('provider', 'google_drive');
          return jsonResponse({ error: 'Token revoked — re-authorize Google Drive' }, 401);
        }
        return jsonResponse({ error: refreshData.error_description || refreshData.error }, 400);
      }

      return jsonResponse({
        access_token: refreshData.access_token,
        expires_in: refreshData.expires_in,
        token_type: refreshData.token_type,
      });
    }

    return jsonResponse({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    console.error('[gdrive-token] Error:', err);
    return jsonResponse({ error: 'Internal error: ' + (err as Error).message }, 500);
  }
});

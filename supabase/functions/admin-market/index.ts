// Edge Function: admin-market
// Handles market_products CRUD with admin verification.
// Uses service role key so RLS doesn't need anon access.
// Deploy: supabase functions deploy admin-market --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

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

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json();
    const { action, admin_email, product } = body;

    // ── Verify admin ────────────────────────────────────────────
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }

    // ── Actions ─────────────────────────────────────────────────
    if (action === 'list') {
      const { data, error } = await sb.from('market_products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return json({ data });
    }

    if (action === 'get') {
      const { data, error } = await sb.from('market_products').select('*').eq('id', body.id).single();
      if (error) throw error;
      return json({ data });
    }

    if (action === 'insert') {
      if (!product) return json({ error: 'Missing product data' }, 400);
      const { data, error } = await sb.from('market_products').insert([product]).select().single();
      if (error) throw error;
      return json({ data });
    }

    if (action === 'update') {
      if (!body.id || !product) return json({ error: 'Missing id or product data' }, 400);
      const { data, error } = await sb.from('market_products').update(product).eq('id', body.id).select().single();
      if (error) throw error;
      return json({ data });
    }

    if (action === 'delete') {
      if (!body.id) return json({ error: 'Missing id' }, 400);
      const { error } = await sb.from('market_products').delete().eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: 'Unknown action: ' + action }, 400);
  } catch (err) {
    console.error('[admin-market] Error:', err);
    return json({ error: err.message }, 500);
  }
});

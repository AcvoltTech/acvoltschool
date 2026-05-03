// Edge Function: stripe-membership-admin
// Admin actions: fetch customer subscriptions, cancel subscription
// Deploy: supabase functions deploy stripe-membership-admin --no-verify-jwt
// Secrets needed: STRIPE_SECRET_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const { action, admin_email, customer_id, subscription_id, email } = await req.json();

    // ── Admin verification ──────────────────────────────────────
    const SB_URL = Deno.env.get('SUPABASE_URL') || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    const SB_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(SB_URL, SB_SERVICE_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      return new Response(
        JSON.stringify({ error: auth.error || 'Unauthorized' }),
        { status: auth.status || 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Action: get_customer_subs ──────────────────────────────
    if (action === 'get_customer_subs') {
      if (!customer_id) {
        return new Response(
          JSON.stringify({ error: 'customer_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const url = new URL('https://api.stripe.com/v1/subscriptions');
      url.searchParams.set('customer', customer_id);
      url.searchParams.set('limit', '20');
      url.searchParams.set('expand[]', 'data.items.data.price');

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${STRIPE_KEY}` },
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }

      const subs = (data.data || []).map((sub: any) => ({
        id: sub.id,
        status: sub.status,
        amount: sub.items?.data?.[0]?.price?.unit_amount || 0,
        currency: sub.items?.data?.[0]?.price?.currency || 'usd',
        interval: sub.items?.data?.[0]?.price?.recurring?.interval || 'month',
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end,
        created: sub.created,
      }));

      console.log('[stripe-membership-admin] Fetched subs for', customer_id, ':', subs.length);

      return new Response(
        JSON.stringify({ subscriptions: subs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Action: cancel_subscription ────────────────────────────
    if (action === 'cancel_subscription') {
      if (!subscription_id) {
        return new Response(
          JSON.stringify({ error: 'subscription_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Cancel immediately in Stripe
      const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscription_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${STRIPE_KEY}` },
      });
      const canceled = await res.json();

      if (canceled.error) {
        throw new Error(canceled.error.message || JSON.stringify(canceled.error));
      }

      // Also block in Supabase memberships if email provided
      if (email && SB_SERVICE_KEY) {
        const sb = createClient(SB_URL, SB_SERVICE_KEY);
        await sb.from('memberships').update({
          activa: false,
          updated_at: new Date().toISOString(),
        }).eq('email', email.toLowerCase().trim());
        console.log('[stripe-membership-admin] Blocked membership in Supabase for:', email);
      }

      console.log('[stripe-membership-admin] Canceled subscription:', subscription_id);

      return new Response(
        JSON.stringify({ success: true, subscription: { id: canceled.id, status: canceled.status } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Unknown action ─────────────────────────────────────────
    return new Response(
      JSON.stringify({ error: 'Unknown action: ' + action }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[stripe-membership-admin] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Edge Function: get-stripe-data
// Fetches Stripe dashboard data (subscriptions, balance, charges) for the admin panel
// Deploy: supabase functions deploy get-stripe-data --no-verify-jwt
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

// Helper: single Stripe API call
async function stripeGet(endpoint: string, apiKey: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`https://api.stripe.com/v1/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Stripe API error: ${res.status}`);
  }
  return res.json();
}

// Helper: paginated Stripe API call — fetches ALL items (up to maxPages * 100)
async function stripeGetAll(endpoint: string, apiKey: string, params?: Record<string, string>, maxPages = 10): Promise<any> {
  const allData: any[] = [];
  let startingAfter: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const pageParams: Record<string, string> = { ...params, limit: '100' };
    if (startingAfter) pageParams['starting_after'] = startingAfter;

    const result = await stripeGet(endpoint, apiKey, pageParams);
    const items = result.data || [];
    allData.push(...items);

    if (!result.has_more || items.length === 0) break;
    startingAfter = items[items.length - 1].id;
  }

  return { data: allData };
}

serve(async (req) => {
  initCors(req);
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const { action, admin_email } = await req.json();

    if (action !== 'dashboard') {
      return new Response(
        JSON.stringify({ error: 'Unknown action: ' + action }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // ========== FETCH ALL DATA IN PARALLEL ==========
    const [activeSubs, canceledSubs, pausedSubs, balance, charges] = await Promise.all([
      // Active subscriptions — paginated to get ALL (expand items for price data)
      stripeGetAll('subscriptions', STRIPE_KEY, {
        status: 'active',
        'expand[]': 'data.items.data.price',
      }),
      // Canceled subscriptions — paginated
      stripeGetAll('subscriptions', STRIPE_KEY, {
        status: 'canceled',
      }),
      // Paused (past_due / unpaid treated as paused) — paginated
      stripeGetAll('subscriptions', STRIPE_KEY, {
        status: 'past_due',
      }),
      // Account balance
      stripeGet('balance', STRIPE_KEY),
      // All charges — paginated to get ALL (not just last 100)
      stripeGetAll('charges', STRIPE_KEY, {}),
    ]);

    // ---- Build customer_phones map from charges ----
    const customerPhones: Record<string, string> = {};
    if (charges.data) {
      for (const ch of charges.data) {
        const email = ch.billing_details?.email || ch.receipt_email || '';
        const phone = ch.billing_details?.phone || '';
        if (email && phone) {
          customerPhones[email.toLowerCase()] = phone;
        }
      }
    }

    // ---- Build subscriptions_detail for reconciliation ----
    const subscriptionsDetail = (activeSubs.data || []).map((sub: any) => ({
      id: sub.id,
      status: sub.status,
      customer_email: sub.customer_email || (sub.customer_details?.email) || '',
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      plan_amount: sub.items?.data?.[0]?.price?.unit_amount || 0,
      plan_interval: sub.items?.data?.[0]?.price?.recurring?.interval || 'month',
    }));

    // ---- Build response in the raw format expected by processStripeRawData() ----
    const responseData = {
      subscriptions: {
        active: activeSubs.data || [],
        canceled: canceledSubs.data || [],
        paused: pausedSubs.data || [],
      },
      subscriptions_detail: subscriptionsDetail,
      balance: balance,
      charges: charges.data || [],
      customer_phones: customerPhones,
    };

    console.log('[get-stripe-data] Dashboard fetched:', {
      active: (activeSubs.data || []).length,
      canceled: (canceledSubs.data || []).length,
      paused: (pausedSubs.data || []).length,
      charges: (charges.data || []).length,
    });

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[get-stripe-data] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

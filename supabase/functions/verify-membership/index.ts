// Edge Function: verify-membership
// Verifies student memberships directly against Stripe (source of truth)
// Actions: verify_single (per-student) | batch_sync (admin reconciliation)
// Deploy: supabase functions deploy verify-membership --no-verify-jwt

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// ── Stripe helpers (same pattern as get-stripe-data) ──
async function stripeGet(endpoint: string, apiKey: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`https://api.stripe.com/v1/${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Stripe API error: ${res.status}`);
  }
  return res.json();
}

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

// ── JSON response helper ──
function jsonResponse(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ── Verify admin against admin_students / admin_staff ──
async function isAdmin(sb: any, email: string): Promise<boolean> {
  const emailLower = email.toLowerCase().trim();
  const { data: admins } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
  if (admins && admins.length > 0) return true;
  const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
  return !!(staff && staff.length > 0);
}

// ═══════════════════════════════════════════════════════
// ACTION: verify_single — verify one student's membership
// ═══════════════════════════════════════════════════════
async function verifySingle(sb: any, stripeKey: string, email: string): Promise<any> {
  email = email.toLowerCase().trim();
  if (!email) return { error: 'Email required' };

  // 1. Find customer in Stripe by email
  const customers = await stripeGet('customers', stripeKey, { email, limit: '1' });
  const customer = customers.data?.[0];

  let stripeActive = false;
  let stripeAmount = 0;
  let stripeStatus = 'no_customer';
  let subscriptionId: string | null = null;

  if (customer) {
    // 2. Get active/trialing subscriptions for this customer
    const subs = await stripeGet('subscriptions', stripeKey, {
      customer: customer.id,
      status: 'active',
      'expand[]': 'data.items.data.price',
      limit: '10',
    });

    // Also check trialing
    const trialSubs = await stripeGet('subscriptions', stripeKey, {
      customer: customer.id,
      status: 'trialing',
      'expand[]': 'data.items.data.price',
      limit: '10',
    });

    const allActiveSubs = [...(subs.data || []), ...(trialSubs.data || [])];

    if (allActiveSubs.length > 0) {
      // Pick the highest-amount subscription
      let bestSub = allActiveSubs[0];
      let bestAmount = bestSub.items?.data?.[0]?.price?.unit_amount || 0;
      for (const s of allActiveSubs) {
        const amt = s.items?.data?.[0]?.price?.unit_amount || 0;
        if (amt > bestAmount) { bestSub = s; bestAmount = amt; }
      }
      stripeActive = true;
      stripeAmount = bestAmount / 100; // cents → dollars
      stripeStatus = bestSub.status;
      subscriptionId = bestSub.id;
    } else {
      stripeStatus = 'inactive';
    }
  }

  // 3. Fetch current Supabase membership
  const { data: existing } = await sb
    .from('memberships')
    .select('*')
    .eq('email', email)
    .order('amount', { ascending: false, nullsFirst: false })
    .limit(1);

  const current = existing?.[0] || null;
  let action = 'no_change';

  // 4. Sync logic — ONLY touch tipo='stripe' or stripe_sync memberships
  if (stripeActive) {
    // Stripe says active → upsert
    const upsertData: any = {
      email,
      user_email: email,
      activa: true,
      amount: stripeAmount,
      stripe_subscription_id: subscriptionId,
      tipo: current?.tipo || 'stripe',
    };

    if (!current) {
      // No membership row → insert
      upsertData.tipo = 'stripe';
      upsertData.fecha_inicio = new Date().toISOString();
      await sb.from('memberships').insert(upsertData);
      action = 'activated';
    } else if ((!current.tipo || current.tipo === 'stripe' || current.tipo === 'stripe_sync') &&
               (!current.activa || current.amount !== stripeAmount || current.stripe_subscription_id !== subscriptionId)) {
      // Membership exists (stripe type) but differs → update
      await sb.from('memberships')
        .update({ activa: true, amount: stripeAmount, stripe_subscription_id: subscriptionId })
        .eq('id', current.id);
      action = !current.activa ? 'activated' : 'updated';
    }
  } else if (current && current.activa && (current.tipo === 'stripe' || current.tipo === 'stripe_sync')) {
    // Stripe says NOT active, Supabase says active, and it's a stripe-type membership → deactivate
    await sb.from('memberships')
      .update({ activa: false })
      .eq('id', current.id);
    action = 'deactivated';
  }
  // If tipo is 'manual', 'verified', 'invoice2go', etc. → do NOT touch

  return {
    email,
    activa: stripeActive || (current?.activa && current?.tipo !== 'stripe' && current?.tipo !== 'stripe_sync'),
    amount: stripeActive ? stripeAmount : (current?.amount || 0),
    stripe_status: stripeStatus,
    subscription_id: subscriptionId,
    action,
  };
}

// ═══════════════════════════════════════════════════════
// ACTION: batch_sync — full reconciliation (admin only)
// ═══════════════════════════════════════════════════════
async function batchSync(sb: any, stripeKey: string): Promise<any> {
  // 1. Fetch ALL active + trialing subs from Stripe (paginated)
  const [activeSubs, trialSubs] = await Promise.all([
    stripeGetAll('subscriptions', stripeKey, {
      status: 'active',
      'expand[]': 'data.items.data.price',
    }),
    stripeGetAll('subscriptions', stripeKey, {
      status: 'trialing',
      'expand[]': 'data.items.data.price',
    }),
  ]);

  const allStripeSubs = [...(activeSubs.data || []), ...(trialSubs.data || [])];

  // Build map: email → best subscription
  const stripeMap = new Map<string, { sub: any; amount: number }>();
  for (const sub of allStripeSubs) {
    const email = (sub.customer_email || sub.customer_details?.email || '').toLowerCase().trim();
    if (!email) continue;
    const amount = (sub.items?.data?.[0]?.price?.unit_amount || 0) / 100;
    const existing = stripeMap.get(email);
    if (!existing || amount > existing.amount) {
      stripeMap.set(email, { sub, amount });
    }
  }

  // 2. Fetch ALL memberships from Supabase
  const { data: memberships } = await sb.from('memberships').select('*');
  const allMemberships = memberships || [];
  const supaMap = new Map<string, any>();
  for (const m of allMemberships) {
    const email = (m.email || m.user_email || '').toLowerCase().trim();
    if (email) supaMap.set(email, m);
  }

  const details: any[] = [];
  let activated = 0;
  let deactivated = 0;
  let updated = 0;

  // 3. Stripe active → ensure Supabase active
  for (const [email, { sub, amount }] of stripeMap) {
    const supaM = supaMap.get(email);
    const subId = sub.id;

    if (!supaM) {
      // Missing in Supabase → insert
      await sb.from('memberships').insert({
        email,
        user_email: email,
        activa: true,
        tipo: 'stripe',
        stripe_subscription_id: subId,
        amount,
        fecha_inicio: new Date(sub.start_date * 1000).toISOString(),
      });
      activated++;
      details.push({ email, action: 'activated', amount, stripe_status: sub.status });
    } else if ((!supaM.tipo || supaM.tipo === 'stripe' || supaM.tipo === 'stripe_sync') &&
               (!supaM.activa || supaM.amount !== amount || supaM.stripe_subscription_id !== subId)) {
      // Exists (stripe type) but needs update
      await sb.from('memberships')
        .update({ activa: true, amount, stripe_subscription_id: subId })
        .eq('id', supaM.id);
      if (!supaM.activa) activated++;
      else updated++;
      details.push({ email, action: !supaM.activa ? 'activated' : 'updated', amount, stripe_status: sub.status });
    }
  }

  // 4. Supabase active (tipo=stripe/stripe_sync) NOT in Stripe → deactivate
  for (const m of allMemberships) {
    if (!m.activa) continue;
    if (m.tipo && m.tipo !== 'stripe' && m.tipo !== 'stripe_sync') continue; // skip manual/invoice2go
    const email = (m.email || m.user_email || '').toLowerCase().trim();
    if (!email) continue;
    if (!stripeMap.has(email)) {
      await sb.from('memberships')
        .update({ activa: false })
        .eq('id', m.id);
      deactivated++;
      details.push({ email, action: 'deactivated', amount: m.amount, stripe_status: 'not_found' });
    }
  }

  return {
    stripe_active: stripeMap.size,
    supabase_total: allMemberships.length,
    activated,
    deactivated,
    updated,
    details,
  };
}

// ═══════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════
serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const SB_URL = Deno.env.get('SUPABASE_URL') || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    const SB_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SB_SERVICE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');

    const sb = createClient(SB_URL, SB_SERVICE_KEY);
    const body = await req.json();
    const { action } = body;

    // ── verify_single ──
    if (action === 'verify_single') {
      const rl = await checkRateLimit(req, { maxRequests: 30, windowSeconds: 60 });
      if (!rl.allowed) return rateLimitResponse(corsHeaders);

      const { email } = body;
      if (!email) return jsonResponse({ error: 'email is required' }, 400);

      const result = await verifySingle(sb, STRIPE_KEY, email);
      console.log('[verify-membership] verify_single:', email, result.action);
      return jsonResponse(result);
    }

    // ── batch_sync ──
    if (action === 'batch_sync') {
      const rl = await checkRateLimit(req, { maxRequests: 2, windowSeconds: 60 });
      if (!rl.allowed) return rateLimitResponse(corsHeaders);

      const { admin_email } = body;
      if (!admin_email) return jsonResponse({ error: 'admin_email is required' }, 401);

      const authorized = await isAdmin(sb, admin_email);
      if (!authorized) {
        console.warn('[verify-membership] Unauthorized batch_sync attempt by:', admin_email);
        return jsonResponse({ error: 'Unauthorized' }, 403);
      }

      const result = await batchSync(sb, STRIPE_KEY);
      console.log('[verify-membership] batch_sync by', admin_email, ':', {
        stripe_active: result.stripe_active,
        activated: result.activated,
        deactivated: result.deactivated,
        updated: result.updated,
      });
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    console.error('[verify-membership] Error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
});

// Edge Function: admin-dashboard-stats
// Returns dashboard KPI counts using service role key (bypasses RLS)
// Deploy: npx supabase functions deploy admin-dashboard-stats --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

// Mario 2026-05-29: pull live Stripe data so the dashboard reflects the
// actual money flowing in, not just cached webhook events. Returns:
//   mrr_real          — MRR computed from active subscription line items
//   active_subs_real  — # of subscriptions in status=active
//   failed_revenue    — recoverable $$ from failed charges (last 60d)
//   ltv_avg           — avg lifetime spend per paying customer
//   stripe_balance    — funds available to transfer
async function fetchStripeStats(apiKey: string) {
  if (!apiKey) return null;
  async function sGet(path: string, params: Record<string, string> = {}) {
    const url = new URL('https://api.stripe.com/v1/' + path);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), { headers: { Authorization: 'Bearer ' + apiKey } });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'Stripe ' + res.status); }
    return res.json();
  }
  async function sGetAll(path: string, params: Record<string, string> = {}, maxPages = 10) {
    const all: Record<string, unknown>[] = [];
    let cursor: string | undefined;
    for (let i = 0; i < maxPages; i++) {
      const pp: Record<string, string> = { ...params, limit: '100' };
      if (cursor) pp.starting_after = cursor;
      const r = await sGet(path, pp);
      const items = r.data || [];
      all.push(...items);
      if (!r.has_more || items.length === 0) break;
      cursor = items[items.length - 1].id;
    }
    return all;
  }
  try {
    const sixtyDaysAgo = Math.floor((Date.now() - 60 * 86400 * 1000) / 1000);
    const [activeSubs, balance, failedChargesPage1, allCharges] = await Promise.all([
      sGetAll('subscriptions', { status: 'active', 'expand[]': 'data.items.data.price' }, 10),
      sGet('balance'),
      sGet('charges', { 'created[gte]': String(sixtyDaysAgo), limit: '100' }),
      sGetAll('charges', { 'created[gte]': String(sixtyDaysAgo) }, 10),
    ]);
    // MRR = sum of active sub monthly equivalents
    let mrrCents = 0;
    for (const sub of activeSubs) {
      // deno-lint-ignore no-explicit-any
      const items = (sub as any).items?.data || [];
      for (const it of items) {
        const price = it.price || {};
        const amt = Number(price.unit_amount || 0);
        const interval = price.recurring?.interval || 'month';
        const interval_count = Number(price.recurring?.interval_count || 1);
        const qty = Number(it.quantity || 1);
        // Convert to monthly
        let monthly = 0;
        if (interval === 'month') monthly = amt / interval_count;
        else if (interval === 'year') monthly = amt / (12 * interval_count);
        else if (interval === 'week') monthly = (amt * 4.345) / interval_count;
        else if (interval === 'day') monthly = (amt * 30) / interval_count;
        mrrCents += monthly * qty;
      }
    }
    const charges = allCharges as { status?: string; amount?: number; customer?: string }[];
    const failedRev = charges
      .filter(c => c.status === 'failed')
      .reduce((a, c) => a + Number(c.amount || 0), 0);
    const failedCount = charges.filter(c => c.status === 'failed').length;
    const succeeded = charges.filter(c => c.status === 'succeeded');
    const lifetimePaying = new Set(succeeded.map(c => c.customer).filter(Boolean)).size;
    const lifetimeRev = succeeded.reduce((a, c) => a + Number(c.amount || 0), 0);
    // deno-lint-ignore no-explicit-any
    const bal = balance as any;
    const availCents = (bal.available || []).reduce((a: number, b: { amount?: number }) => a + Number(b.amount || 0), 0);
    return {
      mrr_real: Math.round(mrrCents / 100),
      active_subs_real: activeSubs.length,
      failed_revenue: Math.round(failedRev / 100),
      failed_count: failedCount,
      ltv_avg: lifetimePaying > 0 ? Math.round(lifetimeRev / lifetimePaying / 100) : 0,
      stripe_balance: Math.round(availCents / 100),
      _src: 'stripe_live',
    };
  } catch (e) {
    console.warn('[fetchStripeStats] failed:', e);
    return { _src: 'stripe_live_failed', _err: String((e as Error).message || e) };
  }
}

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvoltschool.com',
  'https://www.acvoltschool.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://clon-ios-googleplay.pages.dev',
  'https://acvoltschool.pages.dev',
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

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 20 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');

    const body = await req.json();
    const { admin_email } = body;

    const sb = createClient(SB_URL, SB_KEY);

    // Verify admin via JWT (primary) or body email (fallback)
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }

    // Get counts in parallel
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Month-to-date window for revenue
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    // Mario 2026-05-29: IAP breakdown — memberships grouped by source so we
    // see iOS vs Android vs Stripe individually + total. Will fill in as
    // RevenueCat syncs more iOS / Google Play purchases via the sync edge fns.
    const iapBreakdownPromise = sb.from('memberships')
      .select('source, activa')
      .eq('activa', true);

    const [usersRes, certsRes, activeRes, membershipsRes, progressRes, revenueRes, recentPayRes, recentSignupsRes, iapBreakdownRes] = await Promise.all([
      sb.from('users').select('*', { count: 'exact', head: true }),
      sb.from('certificates').select('*', { count: 'exact', head: true }),
      sb.from('users').select('*', { count: 'exact', head: true }).gte('ultimo_acceso', today.toISOString()),
      sb.from('memberships').select('*', { count: 'exact', head: true }).eq('activa', true),
      // Mario 2026-05-29: avg score from user_progress.porcentaje — replaces broken
      // client-side calc that always returned 0%. Filters NULL + zeros so we only
      // average real attempts.
      sb.from('user_progress').select('porcentaje').not('porcentaje', 'is', null).gt('porcentaje', 0),
      // Revenue MTD — sum of successful Stripe events in current month
      sb.from('stripe_payments').select('amount').eq('status', 'succeeded').gte('created_at', monthStart),
      // Recent payments stream — last 10 succeeded Stripe events with customer info
      sb.from('stripe_payments')
        .select('amount, currency, customer_email, customer_name, event_type, created_at, description')
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(10),
      // Recent signups — last 10 users for the live activity feel
      // (users table uses fecha_registro, not created_at)
      sb.from('users')
        .select('nombre, email, ciudad, estado, fecha_registro')
        .order('fecha_registro', { ascending: false })
        .limit(10),
      iapBreakdownPromise,
    ]);

    // Compute average score
    let avg_score = 0;
    if (progressRes.data && progressRes.data.length > 0) {
      const sum = progressRes.data.reduce((a: number, r: { porcentaje: number }) => a + Number(r.porcentaje || 0), 0);
      avg_score = Math.round(sum / progressRes.data.length);
    }

    // Compute revenue MTD (Stripe amounts are in cents)
    let revenue_mtd = 0;
    if (revenueRes.data && revenueRes.data.length > 0) {
      const cents = revenueRes.data.reduce((a: number, r: { amount: number }) => a + Number(r.amount || 0), 0);
      revenue_mtd = Math.round(cents / 100);
    }

    // Recent payments — normalize for client (dollars not cents, name fallback to email)
    interface PayRow { amount: number; currency?: string; customer_email?: string; customer_name?: string; event_type?: string; created_at: string; description?: string }
    const recent_payments = (recentPayRes.data || []).map((p: PayRow) => ({
      amount_dollars: Math.round((p.amount || 0) / 100),
      currency: (p.currency || 'usd').toUpperCase(),
      name: p.customer_name || (p.customer_email ? p.customer_email.split('@')[0] : 'Anónimo'),
      email: p.customer_email || '',
      event: p.event_type || '',
      when: p.created_at,
      description: p.description || '',
    }));

    interface UserRow { nombre?: string; email?: string; ciudad?: string; estado?: string; fecha_registro: string }
    const recent_signups = (recentSignupsRes.data || []).map((u: UserRow) => ({
      name: u.nombre || (u.email ? u.email.split('@')[0] : 'Anónimo'),
      email: u.email || '',
      location: [u.ciudad, u.estado].filter(Boolean).join(', '),
      when: u.fecha_registro,
    }));

    // IAP breakdown by source (iOS, Android, Stripe, etc.)
    // Mario 2026-05-29: DB constraint enforces source ∈ {stripe, ios_iap, play_billing, manual}.
    // 'play_billing' is the canonical name for Google Play (not 'google_play_iap').
    const iapRows = (iapBreakdownRes.data || []) as { source: string }[];
    const iap_breakdown = {
      ios: iapRows.filter(r => r.source === 'ios_iap').length,
      android: iapRows.filter(r => r.source === 'play_billing').length,
      stripe_membership: iapRows.filter(r => r.source === 'stripe').length,
      manual: iapRows.filter(r => r.source === 'manual').length,
      other: iapRows.filter(r => !['ios_iap', 'play_billing', 'stripe', 'manual'].includes(r.source)).length,
      total: iapRows.length,
    };

    // Live Stripe data — runs in parallel with the Supabase queries above so
    // total response time stays under ~3s. If Stripe fails, the dashboard
    // still gets all the Supabase-derived metrics — Stripe block just shows
    // null and the frontend renders "—".
    const stripeStats = await fetchStripeStats(Deno.env.get('STRIPE_SECRET_KEY') || '');

    const stats = {
      total_users: usersRes.count || 0,
      total_certs: certsRes.count || 0,
      active_today: activeRes.count || 0,
      active_memberships: membershipsRes.count || 0,
      avg_score,
      revenue_mtd,
      recent_payments,
      recent_signups,
      // Live Stripe block (mrr_real, active_subs_real, failed_revenue, ltv_avg, stripe_balance)
      stripe: stripeStats,
      // IAP active subscriptions by source (iOS, Android, Stripe-membership)
      iap_breakdown,
    };

    console.log('[admin-dashboard-stats]', stats);
    return json(stats);

  } catch (err) {
    console.error('[admin-dashboard-stats] Error:', err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

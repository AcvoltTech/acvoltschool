// Edge Function: reconcile-stripe-memberships — Mario 2026-05-29
// Pulls active subscriptions from Stripe (live API), compares against the
// memberships table where source='stripe' AND activa=true, and marks the
// orphans (no matching active Stripe sub) as activa=false.
//
// Why: webhook handlers sometimes miss customer.subscription.deleted /
// invoice.payment_failed events, so memberships.activa drifts above the
// real paying base. 2026-05-29: 511 activa=true vs 178 live = 333 ghosts.
//
// Modes:
//   { "dry_run": true }   — counts what WOULD change, no writes
//   { "dry_run": false }  — performs the update
//
// Returns counts: { active_stripe_subs, active_memberships, would_deactivate,
//                   matched_by_sub_id, matched_by_email, no_match, updated }
//
// Auth: admin-only via verifyAdminAuth (same pattern as admin-dashboard-stats).
// Deploy: supabase functions deploy reconcile-stripe-memberships --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvoltschool.com',
  'https://www.acvoltschool.com',
  'https://maestroac-app-clon.pages.dev',
  'https://clon-ios-googleplay.pages.dev',
  'https://acvoltschool.pages.dev',
  'http://localhost:3000',
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

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function stripeGet(path: string, apiKey: string, params: Record<string, string> = {}): Promise<Record<string, unknown>> {
  const url = new URL('https://api.stripe.com/v1/' + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString(), { headers: { Authorization: 'Bearer ' + apiKey } });
  if (!r.ok) {
    const e = await r.json();
    throw new Error(e.error?.message || 'Stripe ' + r.status);
  }
  return r.json();
}

async function stripeGetAll(path: string, apiKey: string, params: Record<string, string> = {}, maxPages = 15): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < maxPages; i++) {
    const pp: Record<string, string> = { ...params, limit: '100' };
    if (cursor) pp.starting_after = cursor;
    const r = await stripeGet(path, apiKey, pp);
    const items = (r.data as Record<string, unknown>[]) || [];
    all.push(...items);
    if (!r.has_more || items.length === 0) break;
    cursor = (items[items.length - 1] as { id: string }).id;
  }
  return all;
}

interface MembershipRow {
  id: string;
  user_id: string | null;
  email: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

interface StripeSub { id: string; customer: string | { id?: string; email?: string }; status: string }
interface StripeCustomer { id: string; email?: string }

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const rl = await checkRateLimit(req, { maxRequests: 3 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const body = await req.json().catch(() => ({}));
    const { admin_email, dry_run = true, mode = 'deactivate_ghosts' } = body;

    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    // ── 1. Pull all active Stripe subscriptions (with customer expanded) ──
    const activeSubs = await stripeGetAll('subscriptions', STRIPE_KEY, {
      status: 'active',
      'expand[]': 'data.customer',
    }) as unknown as StripeSub[];

    const activeSubIds = new Set<string>();
    const activeEmails = new Set<string>();
    const activeCustomerIds = new Set<string>();

    for (const sub of activeSubs) {
      activeSubIds.add(sub.id);
      const cust = sub.customer;
      if (typeof cust === 'object' && cust) {
        if (cust.id) activeCustomerIds.add(cust.id);
        if (cust.email) activeEmails.add(cust.email.toLowerCase().trim());
      } else if (typeof cust === 'string') {
        activeCustomerIds.add(cust);
      }
    }

    // ── 2. Pull stripe-source memberships ──
    // For "deactivate_ghosts" mode: only active rows.
    // For "restore_orphans" mode: ALL stripe rows so we can find inactive ones to reactivate.
    const baseQuery = sb
      .from('memberships')
      .select('id, user_id, email, stripe_subscription_id, stripe_customer_id, activa, updated_at')
      .eq('source', 'stripe');
    const { data: memberships, error: mErr } = (mode === 'restore_orphans')
      ? await baseQuery
      : await baseQuery.eq('activa', true);
    if (mErr) throw mErr;

    const rows = (memberships || []) as (MembershipRow & { activa?: boolean; updated_at?: string })[];

    // ── 3z. CREATE_ORPHANS mode — insert new memberships for paying Stripe customers with NO DB row ──
    if (mode === 'create_orphans') {
      // Pull Stripe active subs with customer expanded (items/prices are included by default)
      const activeSubsWithItems = activeSubs as unknown as Array<StripeSub & {
        customer: string | { id?: string; email?: string };
        items?: { data?: Array<{ price?: { unit_amount?: number } }> };
      }>;

      // Pull all stripe memberships (any activa) to skip emails already present
      const { data: allMs, error: allErr } = await sb
        .from('memberships')
        .select('email')
        .eq('source', 'stripe');
      if (allErr) throw allErr;
      const existingEmails = new Set<string>(
        (allMs || []).map(r => (r.email || '').toLowerCase().trim()).filter(Boolean)
      );

      // Build list of orphan subs (customer.email NOT in existingEmails)
      const orphanInserts: Array<Record<string, unknown>> = [];
      const seen = new Set<string>();
      for (const sub of activeSubsWithItems) {
        const cust = sub.customer;
        let email = '';
        let customerId = '';
        if (typeof cust === 'object' && cust) {
          email = (cust.email || '').toLowerCase().trim();
          customerId = cust.id || '';
        }
        if (!email || existingEmails.has(email) || seen.has(email)) continue;
        seen.add(email);

        const amountCents = sub.items?.data?.[0]?.price?.unit_amount || 0;
        // memberships.amount/price are integer columns — round so e.g. $123.60 (12360¢)
        // becomes 124 instead of failing the insert with "invalid input syntax for type integer".
        const amountDollars = Math.round(amountCents / 100);
        // tipo guess: < $25 = basico, >= $25 = premium, >= $100 = platino
        const tipo = amountDollars >= 100 ? 'platino' : amountDollars >= 25 ? 'premium' : 'basico';

        orphanInserts.push({
          email,
          tipo,
          activa: true,
          source: 'stripe',
          stripe_subscription_id: sub.id,
          stripe_customer_id: customerId,
          amount: amountDollars,
          price: amountDollars,
          payment_status: 'active',
          student_status: 'activo',
          fecha_inicio: new Date().toISOString(),
        });
      }

      // Resolve user_id by looking up auth.users via email (so login picks up access)
      if (orphanInserts.length > 0) {
        // Resolve user_id from public.users (the memberships.user_id FK target) — NOT
        // auth.users, whose id may not exist in public.users and breaks the FK.
        // No match → user_id stays null (column is nullable), insert still succeeds.
        const emails = orphanInserts.map(r => r.email as string);
        const { data: pubUsers } = await sb.from('users').select('id, email').in('email', emails);
        const emailToUid = new Map<string, string>();
        for (const u of (pubUsers || [])) {
          if (u.email) emailToUid.set((u.email as string).toLowerCase().trim(), u.id as string);
        }
        for (const r of orphanInserts) {
          const uid = emailToUid.get(r.email as string);
          if (uid) r.user_id = uid;
        }
      }

      let inserted = 0;
      if (!dry_run && orphanInserts.length > 0) {
        const { error: insErr, count } = await sb
          .from('memberships')
          .insert(orphanInserts, { count: 'exact' });
        if (insErr) throw insErr;
        inserted = count || orphanInserts.length;
      }

      return json({
        mode: 'create_orphans',
        dry_run,
        active_stripe_subs: activeSubsWithItems.length,
        existing_email_count: existingEmails.size,
        orphans_found: orphanInserts.length,
        with_user_id: orphanInserts.filter(r => !!r.user_id).length,
        inserted,
        sample_orphans: orphanInserts.slice(0, 10).map(r => ({
          email: r.email,
          tipo: r.tipo,
          amount: r.amount,
          has_user_id: !!r.user_id,
        })),
      });
    }

    // ── 3a. RESTORE_ORPHANS mode — reactivate inactive memberships for paying Stripe customers ──
    if (mode === 'restore_orphans') {
      // Group ALL stripe memberships by email
      const allByEmail = new Map<string, typeof rows>();
      for (const m of rows) {
        const k = (m.email || '').toLowerCase().trim();
        if (!k) continue;
        const arr = allByEmail.get(k) || [];
        arr.push(m);
        allByEmail.set(k, arr);
      }

      const toReactivate: string[] = [];
      const noMembershipAtAll: string[] = []; // active in Stripe but no DB row at all
      let alreadyActive = 0;

      for (const email of activeEmails) {
        const group = allByEmail.get(email) || [];
        if (group.length === 0) {
          noMembershipAtAll.push(email);
          continue;
        }
        const anyActive = group.some(m => m.activa === true);
        if (anyActive) { alreadyActive++; continue; }
        // None active. Pick the most recent inactive and reactivate it.
        group.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
        toReactivate.push(group[0].id);
      }

      let reactivated = 0;
      if (!dry_run && toReactivate.length > 0) {
        for (let i = 0; i < toReactivate.length; i += 500) {
          const chunk = toReactivate.slice(i, i + 500);
          const { error: upErr, count } = await sb
            .from('memberships')
            .update({ activa: true, updated_at: new Date().toISOString() }, { count: 'exact' })
            .in('id', chunk);
          if (upErr) throw upErr;
          reactivated += (count || chunk.length);
        }
      }

      return json({
        mode: 'restore_orphans',
        dry_run,
        active_stripe_subs: activeSubs.length,
        unique_active_emails: activeEmails.size,
        already_active: alreadyActive,
        would_reactivate: toReactivate.length,
        reactivated,
        no_membership_at_all: noMembershipAtAll.length,
        no_membership_emails: noMembershipAtAll.slice(0, 20), // first 20 for review
      });
    }

    // ── 3. Classify each membership + DEDUPE within same email ──
    // A single Stripe customer can have multiple memberships rows (signup duplicates).
    // For each email in Stripe active set, we KEEP only the best membership and
    // deactivate the rest. Best = has-active-sub-id > has-customer-id > most-recent.
    const toDeactivate: string[] = [];
    let matchedBySubId = 0;
    let matchedByCustomerId = 0;
    let matchedByEmail = 0;
    let noMatch = 0;
    let dedupedDuplicates = 0;

    // Group memberships by normalized email
    const byEmail = new Map<string, MembershipRow[]>();
    const noEmailRows: MembershipRow[] = [];
    for (const m of rows) {
      const key = (m.email || '').toLowerCase().trim();
      if (!key) { noEmailRows.push(m); continue; }
      const arr = byEmail.get(key) || [];
      arr.push(m);
      byEmail.set(key, arr);
    }

    // Process each email group
    for (const [email, group] of byEmail.entries()) {
      const emailInStripe = activeEmails.has(email);

      // Score each row: has-active-sub-id (3) > has-customer-id-in-stripe (2) > nothing (0)
      const scored = group.map(m => {
        let score = 0;
        if (m.stripe_subscription_id && activeSubIds.has(m.stripe_subscription_id)) score = 3;
        else if (m.stripe_customer_id && activeCustomerIds.has(m.stripe_customer_id)) score = 2;
        else if (emailInStripe) score = 1;
        return { m, score };
      });

      // Sort by score desc
      scored.sort((a, b) => b.score - a.score);

      if (!emailInStripe) {
        // Email NOT in Stripe at all — deactivate every membership for this email
        for (const { m } of scored) { toDeactivate.push(m.id); noMatch++; }
        continue;
      }

      // Email IS in Stripe — keep the top-scored row, deactivate the rest as duplicates
      const winner = scored[0];
      if (winner.score === 3) matchedBySubId++;
      else if (winner.score === 2) matchedByCustomerId++;
      else matchedByEmail++;

      for (let i = 1; i < scored.length; i++) {
        toDeactivate.push(scored[i].m.id);
        dedupedDuplicates++;
      }
    }

    // Rows without email — fall back to sub_id / customer_id direct match
    for (const m of noEmailRows) {
      if (m.stripe_subscription_id && activeSubIds.has(m.stripe_subscription_id)) {
        matchedBySubId++;
      } else if (m.stripe_customer_id && activeCustomerIds.has(m.stripe_customer_id)) {
        matchedByCustomerId++;
      } else {
        noMatch++;
        toDeactivate.push(m.id);
      }
    }

    // ── 4. Apply update (unless dry_run) ──
    let updated = 0;
    if (!dry_run && toDeactivate.length > 0) {
      // Chunk into batches of 500 to stay under Supabase IN-clause limits
      for (let i = 0; i < toDeactivate.length; i += 500) {
        const chunk = toDeactivate.slice(i, i + 500);
        const { error: upErr, count } = await sb
          .from('memberships')
          .update({ activa: false, updated_at: new Date().toISOString() }, { count: 'exact' })
          .in('id', chunk);
        if (upErr) throw upErr;
        updated += (count || chunk.length);
      }
    }

    return json({
      dry_run,
      active_stripe_subs: activeSubs.length,
      active_memberships_before: rows.length,
      matched_by_sub_id: matchedBySubId,
      matched_by_customer_id: matchedByCustomerId,
      matched_by_email: matchedByEmail,
      deduped_duplicates: dedupedDuplicates,
      no_match: noMatch,
      would_deactivate: toDeactivate.length,
      updated,
      active_memberships_after: rows.length - updated,
    });
  } catch (err) {
    console.error('[reconcile-stripe-memberships]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

// Edge Function: admin-dashboard-stats
// Returns dashboard KPI counts using service role key (bypasses RLS)
// Deploy: npx supabase functions deploy admin-dashboard-stats --no-verify-jwt

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

    const [usersRes, certsRes, activeRes, membershipsRes, progressRes, revenueRes] = await Promise.all([
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

    const stats = {
      total_users: usersRes.count || 0,
      total_certs: certsRes.count || 0,
      active_today: activeRes.count || 0,
      active_memberships: membershipsRes.count || 0,
      avg_score,
      revenue_mtd,
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

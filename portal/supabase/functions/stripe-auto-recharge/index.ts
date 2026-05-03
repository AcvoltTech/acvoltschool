// Edge Function: stripe-auto-recharge
// Auto-charges saved Stripe payment method when CRITICAL billing thresholds hit
// Deploy: supabase functions deploy stripe-auto-recharge --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

// ── CORS ──
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

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 10, windowSeconds: 300 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY');
    const CUSTOMER_ID = Deno.env.get('STRIPE_MARIO_CUSTOMER_ID');
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!STRIPE_SECRET) return jsonResponse({ error: 'STRIPE_SECRET_KEY not configured' }, 500);
    if (!CUSTOMER_ID) return jsonResponse({ error: 'STRIPE_MARIO_CUSTOMER_ID not configured — need Mario\'s Stripe customer ID' }, 500);

    const supabase = createClient(SB_URL, SB_KEY);
    const { api_name, amount, admin_email, cron_secret } = await req.json();

    // Auth: cron_secret or admin_email
    const validCronSecret = Deno.env.get('CRON_SECRET');
    const isCron = validCronSecret && cron_secret === validCronSecret;

    if (!isCron) {
      if (!admin_email) return jsonResponse({ error: 'Authentication required' }, 401);
      const _e = admin_email.toLowerCase().trim();
      const { data: admins } = await supabase.from('admin_students').select('id').eq('email', _e).limit(1);
      if (!admins || admins.length === 0) {
        const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', _e).limit(1);
        if (!staff || staff.length === 0) return jsonResponse({ error: 'Unauthorized' }, 403);
      }
    }

    if (!api_name || !amount || amount <= 0) {
      return jsonResponse({ error: 'api_name and positive amount required' }, 400);
    }

    // Safety: max 1 recharge per API per 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: recentRecharges } = await supabase
      .from('api_billing_events')
      .select('id')
      .eq('api_name', api_name)
      .eq('event_type', 'recharge_success')
      .gte('created_at', oneDayAgo)
      .limit(1);

    if (recentRecharges && recentRecharges.length > 0) {
      const msg = `Auto-recharge skipped for ${api_name}: already recharged in last 24h`;
      console.log('[auto-recharge]', msg);
      await supabase.from('api_billing_events').insert({
        api_name,
        event_type: 'recharge_failed',
        severity: 'info',
        message: msg,
        details: { reason: '24h_cooldown' },
      });
      return jsonResponse({ success: false, reason: '24h_cooldown', message: msg });
    }

    // Get customer's default payment method
    const custRes = await fetch(`https://api.stripe.com/v1/customers/${CUSTOMER_ID}`, {
      headers: { 'Authorization': 'Basic ' + btoa(STRIPE_SECRET + ':') },
    });

    if (!custRes.ok) {
      const errText = await custRes.text();
      throw new Error('Stripe customer fetch failed: ' + errText);
    }

    const customer = await custRes.json();
    const paymentMethod = customer.invoice_settings?.default_payment_method
      || customer.default_source;

    if (!paymentMethod) {
      const msg = `No default payment method found for customer ${CUSTOMER_ID}`;
      await supabase.from('api_billing_events').insert({
        api_name,
        event_type: 'recharge_failed',
        severity: 'critical',
        message: msg,
        details: { customer_id: CUSTOMER_ID },
      });
      return jsonResponse({ error: msg }, 400);
    }

    // Create PaymentIntent (amount in cents)
    const amountCents = Math.round(amount * 100);
    const piBody = new URLSearchParams({
      amount: String(amountCents),
      currency: 'usd',
      customer: CUSTOMER_ID,
      payment_method: paymentMethod,
      confirm: 'true',
      off_session: 'true',
      description: `Auto-recharge: ${api_name} API billing (ACVOLT)`,
      'metadata[api_name]': api_name,
      'metadata[source]': 'api-billing-monitor',
    });

    const piRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(STRIPE_SECRET + ':'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: piBody.toString(),
    });

    const piData = await piRes.json();

    if (piData.status === 'succeeded') {
      const msg = `Auto-recharge $${amount} for ${api_name} — PaymentIntent ${piData.id} succeeded`;
      console.log('[auto-recharge]', msg);

      await supabase.from('api_billing_events').insert({
        api_name,
        event_type: 'recharge_success',
        severity: 'info',
        message: msg,
        details: { payment_intent_id: piData.id, amount, currency: 'usd' },
      });

      return jsonResponse({ success: true, payment_intent_id: piData.id, amount });
    }

    if (piData.status === 'requires_action') {
      // SCA / 3D Secure required — can't complete off-session
      const msg = `Auto-recharge for ${api_name} requires 3D Secure — manual action needed. PI: ${piData.id}`;
      console.warn('[auto-recharge]', msg);

      await supabase.from('api_billing_events').insert({
        api_name,
        event_type: 'recharge_failed',
        severity: 'critical',
        message: msg,
        details: { payment_intent_id: piData.id, status: 'requires_action' },
      });

      return jsonResponse({ success: false, reason: 'requires_action', payment_intent_id: piData.id });
    }

    // Other failure
    const msg = `Auto-recharge failed for ${api_name}: ${piData.status || 'unknown'} — ${piData.last_payment_error?.message || JSON.stringify(piData)}`;
    console.error('[auto-recharge]', msg);

    await supabase.from('api_billing_events').insert({
      api_name,
      event_type: 'recharge_failed',
      severity: 'critical',
      message: msg,
      details: piData,
    });

    return jsonResponse({ success: false, reason: piData.status, error: piData.last_payment_error?.message });

  } catch (err) {
    console.error('[stripe-auto-recharge] error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: errMsg }, 500);
  }
});

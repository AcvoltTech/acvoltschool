// Edge Function: create-checkout-session
// Creates a Stripe Checkout Session with a dynamic/custom amount
// Deploy: supabase functions deploy create-checkout-session --no-verify-jwt
// Secrets needed: STRIPE_SECRET_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

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

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Tighter rate limit — 5 per minute to prevent checkout spam
  const rl = await checkRateLimit(req, { maxRequests: 5 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const { amount, concept, email, name, return_url, mode, months, interval, addons, price_id } = await req.json();
    // NOTE: trial_days and discount are NOT accepted from client to prevent manipulation
    // Trials must be configured in Stripe Dashboard or via admin-only endpoints

    // If a Stripe price_id is provided, use it directly (pre-configured subscriptions)
    const ALLOWED_PRICE_IDS = [
      'price_1Sy3EEEHIPukEiZCLQXBwPF4', // Standard $119/mo
      'price_1T7itgEHIPukEiZCyxpVGN2M', // Premium $149/mo
      'price_1SyHZREHIPukEiZCpt88XKru', // VIP $299/mo
    ];
    const usePriceId = price_id && ALLOWED_PRICE_IDS.includes(price_id);

    const isSubscription = mode === 'subscription' || usePriceId;
    const subInterval = interval === 'year' ? 'year' : 'month';
    const maxAmount = isSubscription ? (subInterval === 'year' ? 5000 : 2000) : 25000;

    if (!usePriceId && (!amount || !Number.isFinite(amount) || amount < 1 || amount > maxAmount)) {
      return new Response(
        JSON.stringify({ error: `Amount must be between $1 and $${maxAmount.toLocaleString()}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate concept is from allowed list
    const validConcepts = ['mensualidad', 'inscripcion', 'certificacion_epa', 'certificacion_osha', 'materiales', 'examen', 'curso_presencial', 'curso_en_linea', 'membresia_anual', 'marketplace_seller', 'otro'];
    if (concept && !validConcepts.includes(concept)) {
      return new Response(
        JSON.stringify({ error: 'Invalid concept' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Per-concept minimum amounts (prevent paying $1 for a $299 course)
    const conceptMinAmounts: Record<string, number> = {
      mensualidad: 50,
      inscripcion: 50,
      certificacion_epa: 100,
      certificacion_osha: 100,
      materiales: 10,
      examen: 50,
      curso_presencial: 100,
      curso_en_linea: 50,
      membresia_anual: 100,
      marketplace_seller: 4999,
      otro: 1,
    };
    const minAmount = conceptMinAmounts[concept] || 1;
    if (amount < minAmount) {
      return new Response(
        JSON.stringify({ error: `Minimum amount for ${concept} is $${minAmount}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Require email for checkout
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Concept labels in Spanish
    const conceptLabels: Record<string, string> = {
      mensualidad: 'Mensualidad de Clases',
      inscripcion: 'Inscripción',
      certificacion_epa: 'Certificación EPA 608',
      certificacion_osha: 'Certificación OSHA',
      materiales: 'Materiales de Estudio',
      examen: 'Examen de Certificación',
      curso_presencial: 'Curso Presencial HVAC',
      curso_en_linea: 'Curso En Línea HVAC',
      membresia_anual: 'Membresía Anual ACVOLT',
      marketplace_seller: 'Maestro Marketplace — Cuenta de Vendedor',
      otro: 'Pago ACVOLT',
    };

    const productName = conceptLabels[concept] || concept || 'Pago ACVOLT';
    // Discount is server-enforced only via Stripe Coupons — never trust client-side discount parameter
    // Client-sent "discount" field is IGNORED to prevent price manipulation
    const amountCents = Math.round(amount * 100);

    // Validate return_url to prevent open redirect — must be from allowed origins
    const ALLOWED_RETURN_ORIGINS = ['https://maestrohvacr.com', 'https://www.maestrohvacr.com', 'https://maestroac-clon.netlify.app', 'https://acvolttech.github.io', 'http://localhost:3000', 'http://127.0.0.1:5500'];
    let safeReturnUrl = 'https://maestrohvacr.com/?payment=success';
    let safeCancelUrl = 'https://maestrohvacr.com/?payment=cancelled';
    if (return_url) {
      try {
        const parsed = new URL(return_url);
        if (ALLOWED_RETURN_ORIGINS.includes(parsed.origin)) {
          safeReturnUrl = return_url;
          safeCancelUrl = parsed.origin + parsed.pathname + '?payment=cancelled';
        }
      } catch (_) { /* invalid URL, use default */ }
    }

    // Create Stripe Checkout Session via API
    const params = new URLSearchParams();
    params.append('success_url', safeReturnUrl);
    params.append('cancel_url', safeCancelUrl);

    if (usePriceId) {
      // Use pre-configured Stripe price (subscriptions with fixed pricing)
      params.append('mode', 'subscription');
      params.append('line_items[0][price]', price_id);
      params.append('line_items[0][quantity]', '1');
      params.append('subscription_data[metadata][concept]', concept || 'mensualidad');
      params.append('subscription_data[metadata][student_name]', name || '');
      params.append('subscription_data[metadata][price_id]', price_id);
      // Trial periods are configured in Stripe Dashboard, not accepted from client
      params.append('payment_method_types[0]', 'card');
    } else {
      params.append('line_items[0][price_data][currency]', 'usd');
      params.append('line_items[0][price_data][unit_amount]', String(amountCents));
      params.append('line_items[0][price_data][product_data][name]', productName);
      params.append('line_items[0][price_data][product_data][description]', 'ACVOLT Tech School - ' + productName);
      params.append('line_items[0][quantity]', '1');

      if (isSubscription) {
        // Subscription mode — recurring charge (monthly or yearly)
        params.append('mode', 'subscription');
        params.append('line_items[0][price_data][recurring][interval]', subInterval);
        params.append('line_items[0][price_data][recurring][interval_count]', '1');
        const totalMonths = months || (subInterval === 'year' ? 12 : 36);
        params.append('subscription_data[metadata][concept]', concept || 'curso_presencial');
        params.append('subscription_data[metadata][interval]', subInterval);
        params.append('subscription_data[metadata][total_months]', String(totalMonths));
        params.append('subscription_data[metadata][total_amount]', String(subInterval === 'year' ? amount : amount * totalMonths));
        params.append('subscription_data[metadata][student_name]', name || '');
        // Trial periods are configured in Stripe Dashboard, not accepted from client
        params.append('payment_method_types[0]', 'card');
      } else {
        // One-time payment mode
        params.append('mode', 'payment');
        params.append('metadata[concept]', concept || 'otro');
        params.append('metadata[plan]', concept || 'payment');
        params.append('metadata[student_name]', name || '');
        params.append('payment_method_types[0]', 'card');
      }
    }

    // Add one-time addon items (e.g. credential + uniform)
    // Max 5 addons to prevent abuse; each addon amount validated server-side
    if (addons && Array.isArray(addons)) {
      if (addons.length > 5) {
        return new Response(
          JSON.stringify({ error: 'Maximum 5 addon items allowed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Allowlist of valid addon names (prevents arbitrary product injection)
      const validAddonNames = ['credencial', 'uniforme', 'material_extra', 'libro', 'herramienta', 'examen_extra'];
      for (const addon of addons) {
        if (!addon.name || !addon.amount || !Number.isFinite(addon.amount) || addon.amount < 5 || addon.amount > 500) {
          return new Response(
            JSON.stringify({ error: 'Each addon must have a valid name and amount between $5-$500' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (!validAddonNames.includes(addon.name)) {
          return new Response(
            JSON.stringify({ error: 'Invalid addon name: ' + addon.name }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      addons.forEach((addon: { name: string; amount: number }, idx: number) => {
        const i = idx + 1; // line_items[1], [2], etc.
        params.append(`line_items[${i}][price_data][currency]`, 'usd');
        params.append(`line_items[${i}][price_data][unit_amount]`, String(Math.round(addon.amount * 100)));
        params.append(`line_items[${i}][price_data][product_data][name]`, addon.name);
        params.append(`line_items[${i}][quantity]`, '1');
      });
    }

    if (email) {
      params.append('customer_email', email);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (session.error) {
      throw new Error(session.error.message || JSON.stringify(session.error));
    }

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[create-checkout-session] Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

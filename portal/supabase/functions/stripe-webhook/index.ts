import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

/* ── Stripe webhook signature verification (HMAC-SHA256) ────── */
async function verifyStripeSignature(body: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts: Record<string, string> = {};
  sigHeader.split(',').forEach(item => {
    const [key, value] = item.split('=');
    if (key && value) parts[key.trim()] = value;
  });
  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;
  // Reject if timestamp is older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;
  // Compute HMAC-SHA256
  const payload = timestamp + '.' + body;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  initCors(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const rl = await checkRateLimit(req, { maxRequests: 100 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);
  const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://htklsowiyjwsjnacnvnr.supabase.co";
  const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!STRIPE_KEY || !SUPABASE_SERVICE_KEY) { return new Response(JSON.stringify({error:"Missing config"}),{status:500,headers:{...corsHeaders,"Content-Type":"application/json"}}); }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Helper: write to payment_records so students see it in "Mis Pagos"
  async function writePaymentRecord(email: string, name: string, amount: number, desc: string, chargeId: string, date: string) {
    if (!email) return;
    try {
      const { data: existing } = await supabase.from("payment_records").select("id").eq("nota", chargeId).limit(1);
      if (existing && existing.length > 0) return; // already synced
      await supabase.from("payment_records").insert({
        student_email: email.toLowerCase().trim(),
        student_name: name,
        monto: amount / 100,
        concepto: desc || "Pago Stripe",
        metodo_pago: "stripe",
        nota: chargeId,
        fecha_pago: date
      });
    } catch (e) { console.warn("[webhook] payment_records write error:", e); }
  }

  // Helper: activate membership
  async function activateMembership(email: string, planName: string, amount: number, stripeSubId?: string) {
    if (!email) return;
    const emailLower = email.toLowerCase().trim();
    try {
      const record: any = {
        email: emailLower,
        user_email: emailLower,
        activa: true,
        plan_name: planName,
        amount: Math.round(amount / 100),
        tipo: "stripe"
      };
      if (stripeSubId) record.stripe_subscription_id = stripeSubId;
      await supabase.from("memberships").upsert(record, { onConflict: "email" });
      console.log("[webhook] Membership activated for " + emailLower + (stripeSubId ? " (sub: " + stripeSubId + ")" : ""));
    } catch (e) { console.warn("[webhook] membership upsert error:", e); }
  }

  // Helper: derive tier group from amount (cents)
  function deriveGroup(amountCents: number, isTrial: boolean): string {
    if (isTrial) return "trial_14";
    const dollars = Math.round(amountCents / 100);
    if (dollars >= 250) return "membresia_299"; // $299 premium
    if (dollars >= 90) return "membresia_119";   // $119 standard
    return "";
  }

  // Helper: auto-assign student to tier group in zoom_recordings student_groups
  const TIER_GROUPS = ["trial_14", "membresia_119", "membresia_299", "bloqueado"];

  async function assignStudentGroup(email: string, name: string, groupId: string) {
    if (!email || !groupId) return;
    const lowerEmail = email.toLowerCase().trim();
    try {
      // Read current student_groups
      const { data } = await supabase.from("zoom_recordings").select("data").eq("id", "student_groups").maybeSingle();
      let groups: any[] = [];
      if (data && data.data) {
        groups = JSON.parse(data.data);
      }

      // Find or create student entry
      let student = groups.find((s: any) => s.email && s.email.toLowerCase() === lowerEmail);
      if (!student) {
        student = { name: name || lowerEmail, email: lowerEmail, groups: [] };
        groups.push(student);
      }
      if (name) student.name = name;
      if (!student.groups) student.groups = [];

      // Remove all other tier groups (avoid conflicts)
      student.groups = student.groups.filter((g: string) => !TIER_GROUPS.includes(g));

      // Add the new group
      student.groups.push(groupId);

      // Write back
      await supabase.from("zoom_recordings").upsert({
        id: "student_groups",
        data: JSON.stringify(groups),
        updated_at: new Date().toISOString()
      });
      console.log("[webhook] Student group assigned: " + lowerEmail + " → " + groupId);
    } catch (e) { console.warn("[webhook] assignStudentGroup error:", e); }
  }

  // Helper: derive plan name from amount (cents)
  function derivePlan(amountCents: number, desc: string): string {
    const d = (desc || "").toLowerCase();
    if (d.includes("epa") || d.includes("608")) return "epa608";
    if (d.includes("osha")) return "osha";
    if (d.includes("mario") || d.includes("ai")) return "ai_mario";
    if (d.includes("annual") || d.includes("anual") || amountCents === 24000) return "annual";
    if (d.includes("video") || d.includes("tutorial")) return "video_tutoriales";
    if (amountCents === 9900) return "monthly";
    if (amountCents === 4900) return "ai_mario";
    return "membership";
  }

  // ── Allowed event types whitelist ──
  const HANDLED_EVENT_TYPES = new Set([
    "checkout.session.completed",
    "charge.succeeded",
    "payment_intent.succeeded",
    "charge.failed",
    "payment_intent.payment_failed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "charge.refunded",
    "invoice.paid",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
  ]);

  try {
    const body = await req.text();

    // ── Verify Stripe signature (CRITICAL — prevents forged webhooks) ──
    const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const sigHeader = req.headers.get("stripe-signature");
    if (!WEBHOOK_SECRET) {
      console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured — rejecting");
      return new Response(JSON.stringify({error:"Webhook secret not configured"}),{status:500,headers:{...corsHeaders,"Content-Type":"application/json"}});
    }
    if (!sigHeader) {
      console.warn("[webhook] Missing stripe-signature header — rejected");
      return new Response(JSON.stringify({error:"Missing signature"}),{status:401,headers:{...corsHeaders,"Content-Type":"application/json"}});
    }
    const signatureValid = await verifyStripeSignature(body, sigHeader, WEBHOOK_SECRET);
    if (!signatureValid) {
      console.warn("[webhook] Invalid stripe signature — rejected");
      return new Response(JSON.stringify({error:"Invalid signature"}),{status:401,headers:{...corsHeaders,"Content-Type":"application/json"}});
    }

    const event = JSON.parse(body);
    console.log("[webhook] Verified event: " + event.type);

    // ── Reject unrecognized event types ──
    if (!HANDLED_EVENT_TYPES.has(event.type)) {
      console.log("[webhook] Ignoring unhandled event type: " + event.type);
      return new Response(JSON.stringify({received:true,ignored:true,type:event.type}),{headers:{...corsHeaders,"Content-Type":"application/json"}});
    }

    // ── Idempotency: deduplicate retried Stripe events ──
    // Insert the Stripe event ID into webhook_events; if it already exists, this is a retry
    const eventId = event.id;
    if (eventId) {
      try {
        const { error: dedupeErr } = await supabase.from("webhook_events").insert({ event_id: eventId, event_type: event.type, received_at: new Date().toISOString() });
        if (dedupeErr && dedupeErr.code === "23505") {
          // Unique constraint violation — already processed
          console.log("[webhook] Duplicate event skipped: " + eventId);
          return new Response(JSON.stringify({received:true,duplicate:true}),{headers:{...corsHeaders,"Content-Type":"application/json"}});
        }
      } catch (_) {
        // webhook_events table may not exist yet — fall through and process
        // (idempotent upserts in handlers provide secondary protection)
        console.warn("[webhook] webhook_events table not available — processing without dedup guard");
      }
    }

    const obj = event.data && event.data.object ? event.data.object : null;
    if (!obj) return new Response(JSON.stringify({received:true}),{headers:{...corsHeaders,"Content-Type":"application/json"}});

    // ========== CHECKOUT SESSION COMPLETED (Payment Links) ==========
    if (event.type === "checkout.session.completed") {
      const email = obj.customer_email || (obj.customer_details ? obj.customer_details.email : "") || "";
      const name = obj.customer_details ? obj.customer_details.name || "" : "";
      const amountTotal = obj.amount_total || 0;
      const desc = obj.metadata && obj.metadata.plan ? obj.metadata.plan : "";
      const plan = derivePlan(amountTotal, desc || (obj.display_items ? JSON.stringify(obj.display_items) : ""));

      // Activate membership (store stripe subscription ID for cancellation matching)
      await activateMembership(email, plan, amountTotal, obj.subscription || undefined);

      // Auto-assign tier group
      const isTrial = obj.subscription && (amountTotal === 0 || (obj.payment_status === "no_payment_required"));
      const tierGroup = deriveGroup(isTrial ? (obj.metadata && obj.metadata.plan_amount ? parseInt(obj.metadata.plan_amount) : 11900) : amountTotal, isTrial);
      if (email && tierGroup) await assignStudentGroup(email, name, tierGroup);

      // Write payment record
      await writePaymentRecord(email, name, amountTotal, plan || "Pago Stripe Checkout", obj.id, new Date((obj.created || Math.floor(Date.now()/1000)) * 1000).toISOString());

      // Log to stripe_payments
      await supabase.from("stripe_payments").upsert({
        stripe_id: obj.id, event_type: event.type, amount: amountTotal,
        currency: obj.currency || "usd", status: "succeeded",
        customer_email: email, customer_name: name,
        customer_id: obj.customer || "", subscription_id: obj.subscription || "",
        description: "Checkout: " + plan,
        created_at: new Date((obj.created || Math.floor(Date.now()/1000)) * 1000).toISOString(),
        received_at: new Date().toISOString()
      }, { onConflict: "stripe_id" }).catch(() => {});

      // Resolve any failed payment flow
      if (email) {
        await fetch(SUPABASE_URL + "/functions/v1/failed-payment-flow", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY) }, body: JSON.stringify({ action: "resolve", email: email }) }).catch(() => {});
      }

    // ========== CHARGE SUCCEEDED ==========
    } else if (event.type === "charge.succeeded" || event.type === "payment_intent.succeeded") {
      const amount = obj.amount || obj.amount_received || 0;
      const email = (obj.billing_details ? obj.billing_details.email : "") || obj.receipt_email || "";
      const name = obj.billing_details ? obj.billing_details.name || "" : "";
      const desc = obj.description || "";

      await supabase.from("stripe_payments").upsert({
        stripe_id: obj.id, event_type: event.type, amount: amount,
        currency: obj.currency || "usd", status: "succeeded",
        customer_email: email, customer_name: name,
        customer_id: obj.customer || "", subscription_id: obj.subscription || "",
        description: desc, created_at: new Date(obj.created * 1000).toISOString(),
        received_at: new Date().toISOString()
      }, { onConflict: "stripe_id" });

      // Write to payment_records for student visibility
      await writePaymentRecord(email, name, amount, desc, obj.id, new Date(obj.created * 1000).toISOString());

      // Activate membership
      const plan = derivePlan(amount, desc);
      await activateMembership(email, plan, amount, obj.subscription || undefined);

      if (email) {
        await fetch(SUPABASE_URL + "/functions/v1/failed-payment-flow", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY) }, body: JSON.stringify({ action: "resolve", email: email }) }).catch(() => {});
      }

    // ========== CHARGE FAILED ==========
    } else if (event.type === "charge.failed" || event.type === "payment_intent.payment_failed") {
      const amount = obj.amount || 0;
      const email = (obj.billing_details ? obj.billing_details.email : "") || obj.receipt_email || "";
      const failMsg = obj.failure_message || (obj.outcome ? obj.outcome.seller_message : "") || "Unknown";
      const name = obj.billing_details ? obj.billing_details.name || "" : "";
      await supabase.from("stripe_payments").upsert({ stripe_id: obj.id, event_type: event.type, amount: amount, currency: obj.currency || "usd", status: "failed", customer_email: email, customer_name: name, customer_id: obj.customer || "", failure_message: failMsg, created_at: new Date(obj.created * 1000).toISOString(), received_at: new Date().toISOString() },{ onConflict: "stripe_id" });
      if (email) {
        await supabase.from("student_success_tickets").insert({ student_email: email, student_name: name || email, tipo: "pago_fallido", estado: "abierto", prioridad: "alta", descripcion: "COBRO FALLIDO $" + (amount/100).toFixed(2) + " - " + failMsg, monto: amount/100, stripe_subscription_id: obj.subscription || "" }).catch(() => {});
        await fetch(SUPABASE_URL + "/functions/v1/failed-payment-flow", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY) }, body: JSON.stringify({ action: "register", email: email, name: name, amount: amount, charge_id: obj.id, failure_message: failMsg }) }).catch(() => {});
      }

    // ========== SUBSCRIPTION CREATED/UPDATED ==========
    } else if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const email = obj.customer_email || "";
      const status = obj.status;
      const planAmount = obj.items && obj.items.data && obj.items.data[0] && obj.items.data[0].price ? obj.items.data[0].price.unit_amount || 0 : 0;
      const plan = derivePlan(planAmount, "");
      if (email) {
        const emailLower = email.toLowerCase().trim();
        await supabase.from("memberships").upsert({
          email: emailLower,
          user_email: emailLower,
          activa: status === "active" || status === "trialing",
          plan_name: status === "trialing" ? "trial" : plan,
          amount: Math.round(planAmount / 100),
          tipo: "stripe",
          stripe_subscription_id: obj.id
        }, { onConflict: "email" });

        // Auto-assign tier group
        const subIsTrial = status === "trialing";
        const subGroup = deriveGroup(planAmount, subIsTrial);
        if (subGroup && (status === "active" || status === "trialing")) {
          await assignStudentGroup(emailLower, "", subGroup);
        } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
          await assignStudentGroup(emailLower, "", "bloqueado");
        }
      }

    // ========== SUBSCRIPTION DELETED ==========
    } else if (event.type === "customer.subscription.deleted") {
      const email = obj.customer_email || "";
      const subId = obj.id || "";
      // Try matching by stripe_subscription_id first (reliable), then fallback to email
      let deactivated = false;
      if (subId) {
        const { data: subMatch } = await supabase.from("memberships").update({ activa: false }).eq("stripe_subscription_id", subId).select("email");
        if (subMatch && subMatch.length > 0) {
          deactivated = true;
          console.log("[webhook] Subscription deleted — deactivated by sub ID: " + subId);
          const matchedEmail = subMatch[0].email;
          if (matchedEmail) await assignStudentGroup(matchedEmail, "", "bloqueado");
        }
      }
      if (!deactivated && email) {
        await supabase.from("memberships").update({ activa: false }).eq("email", email.toLowerCase().trim());
        console.log("[webhook] Subscription deleted — deactivated by email fallback: " + email);
        await assignStudentGroup(email.toLowerCase().trim(), "", "bloqueado");
      }

    // ========== CHARGE REFUNDED ==========
    } else if (event.type === "charge.refunded") {
      const refundEmail = ((obj.billing_details ? obj.billing_details.email : "") || obj.receipt_email || "").toLowerCase().trim();
      const refundAmount = obj.amount_refunded || obj.amount || 0;
      const isFullRefund = obj.refunded === true || (refundAmount >= (obj.amount || 0));

      await supabase.from("stripe_payments").upsert({ stripe_id: obj.id, event_type: event.type, amount: refundAmount, status: "refunded", customer_email: refundEmail, customer_id: obj.customer || "", created_at: new Date(obj.created * 1000).toISOString(), received_at: new Date().toISOString() },{ onConflict: "stripe_id" });

      // Full refund: deactivate membership and block student access
      if (isFullRefund && refundEmail) {
        await supabase.from("memberships").update({ activa: false }).eq("email", refundEmail);
        await assignStudentGroup(refundEmail, "", "bloqueado");
        // Create support ticket for admin awareness
        await supabase.from("student_success_tickets").insert({
          student_email: refundEmail,
          tipo: "reembolso",
          estado: "abierto",
          prioridad: "alta",
          descripcion: "REEMBOLSO COMPLETO $" + (refundAmount / 100).toFixed(2) + " — Membresía desactivada automáticamente",
          monto: refundAmount / 100,
        }).catch(() => {});
        console.log("[webhook] Full refund — membership deactivated for: " + refundEmail);
      } else if (refundEmail) {
        console.log("[webhook] Partial refund $" + (refundAmount / 100).toFixed(2) + " for " + refundEmail + " — membership kept active");
      }

    // ========== INVOICE PAID ==========
    } else if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
      const email = obj.customer_email || "";
      await supabase.from("stripe_payments").upsert({ stripe_id: obj.id, event_type: "invoice.paid", amount: obj.amount_paid || 0, currency: obj.currency || "usd", status: "succeeded", customer_email: email, customer_id: obj.customer || "", subscription_id: obj.subscription || "", description: "Invoice: " + (obj.number || obj.id), created_at: new Date(obj.created * 1000).toISOString(), received_at: new Date().toISOString() },{ onConflict: "stripe_id" });

      // Also write to payment_records
      if (email) {
        await writePaymentRecord(email, "", obj.amount_paid || 0, "Invoice: " + (obj.number || obj.id), obj.id, new Date(obj.created * 1000).toISOString());
      }

      // Activate membership on successful invoice
      if (email) {
        await activateMembership(email, "membership", obj.amount_paid || 0, obj.subscription || undefined);
        // Auto-assign tier group based on invoice amount (subscription renewal)
        const invGroup = deriveGroup(obj.amount_paid || 0, false);
        if (invGroup) await assignStudentGroup(email.toLowerCase().trim(), "", invGroup);
        await fetch(SUPABASE_URL + "/functions/v1/failed-payment-flow", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY) }, body: JSON.stringify({ action: "resolve", email: email }) }).catch(() => {});
      }

    // ========== INVOICE PAYMENT FAILED ==========
    } else if (event.type === "invoice.payment_failed") {
      const email = obj.customer_email || "";
      const attemptCount = obj.attempt_count || 0;
      if (email) {
        const emailLower = email.toLowerCase().trim();
        await supabase.from("student_success_tickets").insert({
          student_email: emailLower,
          tipo: "pago_fallido",
          estado: "abierto",
          prioridad: attemptCount >= 3 ? "critica" : "alta",
          descripcion: "Invoice fallido $" + ((obj.amount_due||0)/100).toFixed(2) + " (intento #" + attemptCount + ")",
          monto: (obj.amount_due||0)/100,
          stripe_subscription_id: obj.subscription || "",
        }).catch(() => {});

        // After 3+ failed attempts, deactivate membership to prevent indefinite free access
        if (attemptCount >= 3) {
          await supabase.from("memberships")
            .update({ activa: false })
            .eq("email", emailLower)
            .in("tipo", ["stripe", "stripe_sync"]);
          await assignStudentGroup(emailLower, "", "bloqueado");
          console.log("[webhook] Invoice failed " + attemptCount + "x — membership deactivated for: " + emailLower);
        }

        // Trigger failed payment flow
        await fetch(SUPABASE_URL + "/functions/v1/failed-payment-flow", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY) }, body: JSON.stringify({ action: "register", email: emailLower, name: "", amount: obj.amount_due || 0, charge_id: obj.id, failure_message: "Invoice payment failed (attempt #" + attemptCount + ")" }) }).catch(() => {});
      }
    }

    return new Response(JSON.stringify({received:true,type:event.type}),{headers:{...corsHeaders,"Content-Type":"application/json"}});
  } catch (err) {
    console.error("[webhook] ERROR:", err);
    return new Response(JSON.stringify({received:true,error:err.message}),{status:200,headers:{...corsHeaders,"Content-Type":"application/json"}});
  }
});

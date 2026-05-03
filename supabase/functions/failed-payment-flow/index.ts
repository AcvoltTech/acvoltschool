// Edge Function: failed-payment-flow
// Handles failed payment registration and resolution when payments succeed.
// Called by stripe-webhook with two actions:
//   - "register": logs a failed payment attempt and notifies the student
//   - "resolve": closes open pago_fallido tickets when payment succeeds
// Deploy: supabase functions deploy failed-payment-flow --no-verify-jwt

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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  initCors(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  const SUPABASE_URL =
    Deno.env.get("SUPABASE_URL") ||
    "https://htklsowiyjwsjnacnvnr.supabase.co";
  const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  if (!SUPABASE_SERVICE_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const payload = await req.json();

    // ========== AUTH: shared secret or admin_email fallback ==========
    const INTERNAL_SECRET = Deno.env.get('INTERNAL_WEBHOOK_SECRET');
    const headerSecret = req.headers.get('x-webhook-secret') || '';
    let authenticated = false;

    if (INTERNAL_SECRET && headerSecret === INTERNAL_SECRET) {
      authenticated = true;
    }

    if (!authenticated) {
      const { admin_email } = payload;
      if (!admin_email) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const emailLowerAuth = admin_email.toLowerCase().trim();
      const { data: admins } = await supabase.from('admin_students').select('id').eq('email', emailLowerAuth).limit(1);
      if (!admins || admins.length === 0) {
        const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLowerAuth).limit(1);
        if (!staff || staff.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const { action } = payload;

    // ========== ACTION: REGISTER (failed payment) ==========
    if (action === "register") {
      const {
        email,
        name,
        amount,
        charge_id,
        failure_message,
      } = payload;

      if (!email) {
        return new Response(
          JSON.stringify({ error: "email is required for register action" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const emailLower = email.toLowerCase().trim();
      const amountDollars = typeof amount === "number" ? amount / 100 : 0;

      // 1. Log the failed attempt in failed_payment_attempts
      //    If the table doesn't exist yet, we catch and continue gracefully.
      try {
        await supabase.from("failed_payment_attempts").insert({
          student_email: emailLower,
          student_name: name || emailLower,
          amount: amountDollars,
          charge_id: charge_id || null,
          failure_message: failure_message || "Unknown",
          created_at: new Date().toISOString(),
        });
        console.log(
          `[failed-payment-flow] Registered failed attempt for ${emailLower} — $${amountDollars}`
        );
      } catch (e) {
        // Table may not exist yet — log and continue
        console.warn(
          "[failed-payment-flow] Could not insert into failed_payment_attempts:",
          e
        );
      }

      // 2. Send push notification to the student
      try {
        await fetch(SUPABASE_URL + "/functions/v1/send-push-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY),
          },
          body: JSON.stringify({
            recipient_emails: [emailLower],
            title: "Problema con tu pago",
            body: `Tu pago de $${amountDollars.toFixed(2)} no pudo ser procesado. ${failure_message || ""} Por favor verifica tu metodo de pago.`,
            type: "pago_fallido",
            url: "./",
          }),
        });
        console.log(
          `[failed-payment-flow] Push notification sent to ${emailLower}`
        );
      } catch (e) {
        console.warn(
          "[failed-payment-flow] Push notification failed (non-critical):",
          e
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          action: "register",
          email: emailLower,
          amount: amountDollars,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );

      // ========== ACTION: RESOLVE (successful payment clears tickets) ==========
    } else if (action === "resolve") {
      const { email } = payload;

      if (!email) {
        return new Response(
          JSON.stringify({ error: "email is required for resolve action" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const emailLower = email.toLowerCase().trim();

      // 1. Close all open pago_fallido tickets for this student
      const { data: openTickets, error: fetchErr } = await supabase
        .from("student_success_tickets")
        .select("id")
        .eq("student_email", emailLower)
        .eq("tipo", "pago_fallido")
        .eq("estado", "abierto");

      if (fetchErr) {
        console.warn(
          "[failed-payment-flow] Error fetching open tickets:",
          fetchErr
        );
      }

      let resolved = 0;

      if (openTickets && openTickets.length > 0) {
        const ticketIds = openTickets.map((t: any) => t.id);

        const { error: updateErr } = await supabase
          .from("student_success_tickets")
          .update({
            estado: "resuelto",
            resuelto_por: "stripe-auto",
            resuelto_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .in("id", ticketIds);

        if (updateErr) {
          console.warn(
            "[failed-payment-flow] Error resolving tickets:",
            updateErr
          );
        } else {
          resolved = ticketIds.length;
          console.log(
            `[failed-payment-flow] Resolved ${resolved} pago_fallido ticket(s) for ${emailLower}`
          );
        }
      } else {
        console.log(
          `[failed-payment-flow] No open pago_fallido tickets for ${emailLower}`
        );
      }

      // 2. Mark failed_payment_attempts as resolved (if the table exists)
      try {
        await supabase
          .from("failed_payment_attempts")
          .update({ resolved_at: new Date().toISOString() })
          .eq("student_email", emailLower)
          .is("resolved_at", null);
      } catch (e) {
        // Table may not exist — non-critical
        console.warn(
          "[failed-payment-flow] Could not update failed_payment_attempts:",
          e
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          action: "resolve",
          email: emailLower,
          tickets_resolved: resolved,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );

      // ========== UNKNOWN ACTION ==========
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown action: " + action }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (err: any) {
    console.error("[failed-payment-flow] ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

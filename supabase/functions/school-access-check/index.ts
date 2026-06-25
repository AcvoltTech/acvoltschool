// Edge Function: school-access-check
// Decide si un usuario tiene acceso a las clases/grabaciones de la escuela.
// Regla (Mario 2026-06-25): SOLO quien PAGA por Stripe (suscripción activa) entra. Nadie más.
// Red de seguridad: admins + lista verificada manual (becados/casos) NO se bloquean.
//
// El cliente manda su JWT (sesión Supabase). Verificamos el JWT → email → preguntamos a Stripe
// EN VIVO si ese email tiene una suscripción activa. Devuelve { access: boolean, reason }.
//
// Secrets: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED = [
  "https://acvoltschool.com", "https://www.acvoltschool.com",
  "https://maestrohvacr.com", "https://www.maestrohvacr.com",
  "https://clon-ios-googleplay.pages.dev",
  "http://localhost:3000", "http://127.0.0.1:5500",
];
function cors(req: Request): Record<string, string> {
  const o = req.headers.get("origin") || "";
  const allow = ALLOWED.includes(o) ? o : (o.endsWith(".pages.dev") ? o : ALLOWED[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

async function stripeActiveSub(email: string, key: string): Promise<boolean> {
  // 1) customers por email
  const cu = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=100`, {
    headers: { "Authorization": `Bearer ${key}` },
  });
  if (!cu.ok) throw new Error("stripe customers " + cu.status);
  const customers = (await cu.json()).data || [];
  for (const c of customers) {
    // 2) suscripciones de ese customer (active o trialing = está pagando / en prueba)
    const su = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${c.id}&status=all&limit=100`, {
      headers: { "Authorization": `Bearer ${key}` },
    });
    if (!su.ok) continue;
    const subs = (await su.json()).data || [];
    if (subs.some((s: any) => s.status === "active" || s.status === "trialing")) return true;
  }
  return false;
}

serve(async (req) => {
  const headers = { ...cors(req), "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  try {
    const SB_URL = Deno.env.get("SUPABASE_URL")!;
    const SB_SR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const sb = createClient(SB_URL, SB_SR);

    // ── Identifica al usuario por su JWT (solo puede checar SU propio acceso) ──
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return new Response(JSON.stringify({ access: false, reason: "no_token" }), { status: 200, headers });
    const { data: u } = await sb.auth.getUser(token);
    const email = (u?.user?.email || "").toLowerCase().trim();
    if (!email) return new Response(JSON.stringify({ access: false, reason: "no_user" }), { status: 200, headers });

    // ── Admins SIEMPRE pasan ──
    const { data: staff } = await sb.from("admin_staff").select("email").eq("email", email).eq("activo", true).limit(1);
    if (staff && staff.length) return new Response(JSON.stringify({ access: true, reason: "admin", email }), { status: 200, headers });

    // ── ¿Paga por Stripe? (verdad en vivo) ──
    if (STRIPE_KEY) {
      try {
        if (await stripeActiveSub(email, STRIPE_KEY)) {
          return new Response(JSON.stringify({ access: true, reason: "stripe_active", email }), { status: 200, headers });
        }
      } catch (e) {
        // Stripe caído/lento → NO bloqueamos a los conocidos: caemos a la lista verificada.
        console.warn("[school-access-check] stripe error:", String(e));
        const known = await inVerifiedList(sb, email);
        return new Response(JSON.stringify({ access: known, reason: known ? "verified_fallback" : "stripe_error", email }), { status: 200, headers });
      }
    }

    // ── Red de seguridad: lista verificada manual (becados/casos especiales que Mario aprueba) ──
    const known = await inVerifiedList(sb, email);
    return new Response(JSON.stringify({ access: known, reason: known ? "verified" : "not_paying", email }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ access: false, reason: "error", detail: String(e).slice(0, 200) }), { status: 200, headers });
  }
});

async function inVerifiedList(sb: any, email: string): Promise<boolean> {
  try {
    const { data } = await sb.from("zoom_recordings").select("data").eq("id", "verified").maybeSingle();
    if (!data?.data) return false;
    let arr: any[] = [];
    try { arr = JSON.parse(data.data); } catch (_) { return false; }
    return arr.some((v) => v && v.email && String(v.email).toLowerCase().trim() === email);
  } catch (_) { return false; }
}

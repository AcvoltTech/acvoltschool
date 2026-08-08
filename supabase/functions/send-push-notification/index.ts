import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";
import { getFcmAccessToken, fcmSend } from "../_shared/fcm.ts";

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

const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@acvolt.com";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// FCM (push nativo para usuarios de la APP iOS+Android — tienen device_token, no endpoint web).
const FCM_SA_RAW = Deno.env.get("FCM_SERVICE_ACCOUNT_JSON") || "";

serve(async (req) => {
  initCors(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const reqBody = await req.json();
    const { recipient_emails, title, type, url, admin_email } = reqBody;
    // Truncate notification body to prevent sensitive data leakage in logs
    const body = typeof reqBody.body === 'string' ? reqBody.body.substring(0, 200) : (reqBody.body || '');

    if (!recipient_emails || !recipient_emails.length || !title) {
      return new Response(
        JSON.stringify({ error: "recipient_emails[] and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── Auth verification ──
    // Group chat notifications: verify sender exists in users table (any authenticated user)
    // Other notifications: require admin_email in admin_students or admin_staff
    if (type === 'group_chat') {
      // For group chat, verify the JWT token to ensure sender is authenticated
      const authHeader = req.headers.get('authorization') || '';
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // Verify the token by checking the user via Supabase auth
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid authentication token' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else {
      // Admin notifications: verify via JWT (primary) or fallback (body email + apikey)
      const auth = await verifyAdminAuth(req, supabase, admin_email);
      if (!auth.verified) {
        return new Response(JSON.stringify({ error: auth.error || 'Unauthorized' }), { status: auth.status || 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    let sent = 0;
    let failed = 0;

    // Handle broadcast to all users (send_to_all or __all__ sentinel)
    let finalEmails = recipient_emails;
    if (recipient_emails.includes('__all__')) {
      const { data: allSubs } = await supabase
        .from("push_subscriptions")
        .select("user_email")
        .eq("active", true);
      if (allSubs && allSubs.length > 0) {
        finalEmails = [...new Set(allSubs.map((s: any) => s.user_email).filter(Boolean))];
      } else {
        finalEmails = [];
      }
    }

    // Prepara FCM (para usuarios de la app iOS/Android con device_token). Token de acceso perezoso.
    let _fcmSA: any = null;
    if (FCM_SA_RAW) { try { _fcmSA = JSON.parse(FCM_SA_RAW); } catch (_) { _fcmSA = null; } }
    let _fcmAccess: string | null = null;
    const ensureFcm = async (): Promise<string | null> => {
      if (!_fcmSA) return null;
      if (_fcmAccess) return _fcmAccess;
      try { _fcmAccess = await getFcmAccessToken(_fcmSA); return _fcmAccess; } catch (_) { return null; }
    };

    const isLive = type === 'clase' || (title && title.includes('EN VIVO'));
    const targetUrl = isLive ? './index.html#liveStreamingScreen' : (url || './');

    for (const email of finalEmails) {
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_email", email)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!subs || subs.length === 0) {
        failed++;
        await supabase.from("notification_log").insert({
          recipient_email: email, title, body,
          type: type || "general", channel: "push", status: "no_subscription", metadata: { url },
        });
        continue;
      }

      // Rutea por transporte: web-push (endpoint) vs FCM nativo (device_token). Antes SOLO web-push,
      // por eso los usuarios de iOS/app (sin endpoint) nunca recibían nada. Mario 2026-07-02.
      const webSubs = subs.filter((s: any) => s.endpoint);
      const fcmSubs = subs.filter((s: any) => !s.endpoint && s.device_token);
      const latestWeb = webSubs[0];
      const latestFcm = fcmSubs[0];

      // Solo el más reciente por transporte; desactiva los viejos de cada tipo.
      const staleIds = [...webSubs.slice(1), ...fcmSubs.slice(1)].map((s: any) => s.id);
      if (staleIds.length) await supabase.from("push_subscriptions").update({ active: false }).in("id", staleIds);

      let emailSent = 0;

      // 1) Web-push (VAPID) — navegador / PWA con endpoint.
      if (latestWeb) {
        try {
          await webpush.sendNotification(
            { endpoint: latestWeb.endpoint, keys: { p256dh: latestWeb.p256dh, auth: latestWeb.auth } },
            JSON.stringify({ title, body, url: targetUrl }),
            { TTL: isLive ? 600 : 86400, urgency: isLive ? 'very-high' : 'high', topic: isLive ? 'live-stream' : undefined }
          );
          sent++; emailSent++;
        } catch (e: any) {
          console.error("web-push error for", latestWeb.endpoint, e.statusCode, e.body);
          if (e.statusCode === 410 || e.statusCode === 404) await supabase.from("push_subscriptions").update({ active: false }).eq("id", latestWeb.id);
        }
      }

      // 2) FCM nativo — app iOS/Android con device_token.
      if (latestFcm) {
        const at = await ensureFcm();
        if (at && _fcmSA) {
          const res = await fcmSend(_fcmSA.project_id, at, latestFcm.device_token, title, body, targetUrl, !!isLive);
          if (res.ok) { sent++; emailSent++; }
          else { console.error("fcm error for", email, res.err); if (res.stale) await supabase.from("push_subscriptions").update({ active: false }).eq("id", latestFcm.id); }
        }
      }

      if (emailSent === 0) failed++;

      await supabase.from("notification_log").insert({
        recipient_email: email, title, body,
        type: type || "general", channel: "push", status: emailSent > 0 ? "sent" : "failed",
        metadata: { url, web: !!latestWeb, fcm: !!latestFcm, subs_sent: emailSent },
      });
    }

    return new Response(
      JSON.stringify({ sent, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

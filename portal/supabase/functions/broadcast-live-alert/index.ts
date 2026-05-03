// Edge Function: broadcast-live-alert
// Sends a high-priority live-class alert via EMAIL to every user in the
// `users` table (iOS TestFlight users don't receive Web Push, so email
// is the universal backup until APNs is wired up natively).
//
// Companion to send-push-notification — the admin "📣 ALERTA A TODOS"
// button calls BOTH so that web/Android get push AND iOS gets email.
//
// Deploy: supabase functions deploy broadcast-live-alert --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// HTML template — bold red banner so the email is unmistakable in a crowded inbox
function emailHtml(title: string, body: string, url: string): string {
  const safe = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#dc2626 0%,#ef4444 60%,#f87171 100%);border-radius:16px;padding:28px;text-align:center;color:#fff;box-shadow:0 12px 40px rgba(220,38,38,0.35);">
      <div style="font-size:48px;line-height:1;margin-bottom:8px;">🔴</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;letter-spacing:0.5px;">${safe(title)}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.5;opacity:0.95;">${safe(body)}</p>
      <a href="${safe(url)}" style="display:inline-block;background:#fff;color:#dc2626;padding:14px 32px;border-radius:10px;font-weight:900;font-size:16px;text-decoration:none;letter-spacing:0.3px;">VER EN VIVO →</a>
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:20px;line-height:1.5;">
      Este aviso lo envió Maestro Mario desde la aplicación Maestro HVACR.<br>
      Si no querés recibir más alertas, <a href="https://maestrohvacr.com/#miPerfilScreen" style="color:#60a5fa;">ajusta tus preferencias en tu perfil</a>.
    </p>
  </div>
</body></html>`;
}

// Resend supports up to 100 emails per batch POST to /emails/batch
async function sendBatch(apiKey: string, from: string, subject: string, htmlBody: string, recipients: string[]): Promise<{ ok: number; fail: number }> {
  const payload = recipients.map((to) => ({ from, to: [to], subject, html: htmlBody }));
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[broadcast] Resend batch error', res.status, err.slice(0, 300));
    return { ok: 0, fail: recipients.length };
  }
  // Resend returns { data: [ { id }, ... ] } — each entry is one accepted email
  const data = await res.json().catch(() => ({}));
  const accepted = Array.isArray(data?.data) ? data.data.length : 0;
  return { ok: accepted, fail: recipients.length - accepted };
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM_EMAIL = Deno.env.get('RESEND_FROM') || 'Maestro Mario <noreply@maestrohvacr.com>';
    if (!RESEND_API_KEY) return jsonResponse({ error: 'RESEND_API_KEY not configured' }, 500);

    const { title, body, url, admin_email } = await req.json();
    if (!title || !body) return jsonResponse({ error: 'title and body required' }, 400);

    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SB_URL, SB_KEY);

    // Admin gate — only allow logged-in admins (via JWT) or a verified admin_email in body.
    const auth = await verifyAdminAuth(req, supabase, admin_email);
    if (!auth.verified) {
      return jsonResponse({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }

    // Pull every user email. Skip rows without an email (shouldn't exist, but guard).
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('email')
      .not('email', 'is', null);

    if (usersErr) return jsonResponse({ error: 'Could not list users', details: usersErr.message }, 500);
    const emails: string[] = [...new Set((users || []).map((u: any) => (u.email || '').toLowerCase().trim()).filter(Boolean))];

    if (emails.length === 0) return jsonResponse({ sent: 0, failed: 0, total: 0, note: 'no users' });

    const html = emailHtml(title, body, url || 'https://maestrohvacr.com/#liveStreamingScreen');
    const subject = title;

    // Batch in chunks of 100 (Resend limit).
    let sent = 0;
    let failed = 0;
    for (let i = 0; i < emails.length; i += 100) {
      const slice = emails.slice(i, i + 100);
      const r = await sendBatch(RESEND_API_KEY, FROM_EMAIL, subject, html, slice);
      sent += r.ok;
      failed += r.fail;
    }

    // Log to notification_log so Mario can audit who was reached
    try {
      await supabase.from('notification_log').insert({
        recipient_email: admin_email || 'broadcast@system',
        title,
        body,
        type: 'live_broadcast',
        channel: 'email',
        status: failed > 0 ? 'partial' : 'sent',
        metadata: { total: emails.length, sent, failed, url },
      });
    } catch (_e) { /* best-effort */ }

    return jsonResponse({ sent, failed, total: emails.length });
  } catch (e) {
    console.error('[broadcast-live-alert] error', e);
    return jsonResponse({ error: (e as Error).message || String(e) }, 500);
  }
});

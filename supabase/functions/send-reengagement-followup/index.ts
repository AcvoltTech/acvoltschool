// Edge Function: send-reengagement-followup — Mario 2026-05-29
// "Regresa, te extrañamos" message for users who WERE engaged but went
// dormant 14+ days ago. Different from send-onboarding-followup which
// targets users who downloaded but never opened.
//
// Buckets:
//   "critical"  → 14+ days dormant + had prior ultimo_acceso (1,344 users)
//   "warning"   → 7-13 days dormant (147 users)
//
// Tracking column: users.reengagement_sent_at
//
// Auth: admin via verifyAdminAuth
// Deploy: supabase functions deploy send-reengagement-followup --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvoltschool.com',
  'https://www.acvoltschool.com',
  'https://maestroac-app-clon.pages.dev',
  'https://clon-ios-googleplay.pages.dev',
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

// Buckets define days-since-last-activity windows
const BUCKETS: Record<string, { min_days: number; max_days: number }> = {
  warning:  { min_days: 7,  max_days: 13 },
  critical: { min_days: 14, max_days: 9999 },  // 14+ days dormant
};

const EMAIL_SUBJECT = '👋 Ya lo pasado pasado — descarga la app y nos ponemos al corriente';
function emailHTML(name: string): string {
  const safeName = String(name || 'Técnico').replace(/[<>]/g, '');
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 20px;color:#0f172a;">
  <p style="font-size:18px;font-weight:700;margin:0 0 18px;color:#0f172a;">Hola ${safeName},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;"><b>Ya lo pasado pasado y lo malo olvidado.</b></p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 22px;">Ahora con nuestra app <b>Maestro HVACR</b> nos ponemos al corriente. <b>Descárgala, pruébala y nos das tu opinión honesta.</b></p>
  <p style="font-size:15px;line-height:1.55;margin:0 0 24px;color:#475569;">Después de eso no te volvemos a molestar.</p>
  <p style="margin:0 0 28px;text-align:center;line-height:2.2;">
    <a href="https://maestrohvacr.com/get?s=reengage&c=critical" style="display:inline-block;background:#000;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin:4px 6px;">🍎 Descargar para iOS</a>
    <a href="https://maestrohvacr.com/get?s=reengage&c=critical" style="display:inline-block;background:#34a853;color:#fff;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin:4px 6px;">📥 Google Play</a>
  </p>
  <p style="font-size:15px;color:#0f172a;margin:0;">Buen día!</p>
  <p style="font-size:14px;color:#475569;margin:6px 0 0;">— Mario Flores</p>
</div>`;
}
const SMS_BODY = 'Ya lo pasado pasado. Descarga Maestro HVACR, pruébala y nos das tu opinión honesta. Después no te volvemos a molestar. https://maestrohvacr.com/get?s=reengage STOP=baja';

interface UserRow { id: string; nombre: string | null; email: string | null; telefono: string | null; ultimo_acceso: string | null; }

function normPhone(raw: string | null): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  if (digits.length >= 10 && digits.length <= 15) return '+' + digits;
  return null;
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const rl = await checkRateLimit(req, { maxRequests: 3 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || '';
    const TW_SID = Deno.env.get('TWILIO_ACCOUNT_SID') || '';
    const TW_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') || '';
    const TW_MSG_SVC = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || '';
    const TW_FROM = Deno.env.get('TWILIO_FROM_NUMBER') || '';

    const body = await req.json().catch(() => ({}));
    const { admin_email, bucket = 'critical', dry_run = true, channels = ['email', 'sms'] } = body;

    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    if (!BUCKETS[bucket]) return json({ error: 'Invalid bucket. Use: critical | warning' }, 400);
    const { min_days, max_days } = BUCKETS[bucket];

    // Reengagement target = had ultimo_acceso before (engaged at some point)
    // and ultimo_acceso is between min_days and max_days ago.
    const maxDate = new Date(Date.now() - min_days * 86400 * 1000).toISOString();
    const minDate = new Date(Date.now() - max_days * 86400 * 1000).toISOString();

    const { data: users, error: uErr } = await sb
      .from('users')
      .select('id, nombre, email, telefono, ultimo_acceso, reengagement_sent_at')
      .not('ultimo_acceso', 'is', null)
      .lt('ultimo_acceso', maxDate)
      .gte('ultimo_acceso', minDate)
      .is('reengagement_sent_at', null)
      .not('email', 'ilike', '%synthetic%')
      .not('email', 'ilike', '%@maestrohvacr.com')
      .not('email', 'ilike', '%@acvolt%')
      .limit(5000);
    if (uErr) throw uErr;

    const eligible = (users || []) as (UserRow & { id: string })[];

    if (dry_run) {
      return json({
        dry_run: true,
        bucket,
        target_size: eligible.length,
        with_email: eligible.filter(u => !!u.email).length,
        with_phone: eligible.filter(u => !!normPhone(u.telefono)).length,
        sample: eligible.slice(0, 3).map(u => ({ name: u.nombre, email: u.email, last_active: u.ultimo_acceso })),
      });
    }

    // CRITICAL: mark all eligible IDs as "sent" SYNCHRONOUSLY before background
    // send starts. Otherwise a fast 2nd call picks up the same cohort and
    // sends duplicates. Mario 2026-05-29: lesson learned the hard way.
    const nowIso = new Date().toISOString();
    const ids = eligible.map(u => u.id);
    for (let i = 0; i < ids.length; i += 500) {
      const chunk = ids.slice(i, i + 500);
      await sb.from('users').update({ reengagement_sent_at: nowIso }).in('id', chunk);
    }

    const sendAll = async () => {
      let emails_sent = 0, emails_failed = 0, sms_sent = 0, sms_failed = 0;

      if (channels.includes('email') && RESEND_KEY) {
        for (const u of eligible) {
          if (!u.email) continue;
          try {
            const r = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'Maestro Mario <mario@maestrohvacr.com>',
                to: [u.email],
                subject: EMAIL_SUBJECT,
                html: emailHTML(u.nombre || ''),
                tags: [{ name: 'campaign', value: 'reengagement-' + bucket }],
              }),
            });
            if (r.ok) emails_sent++;
            else emails_failed++;
          } catch (_) { emails_failed++; }
        }
      }

      if (channels.includes('sms') && TW_SID && TW_TOKEN && (TW_FROM || TW_MSG_SVC)) {
        const tw_auth = btoa(`${TW_SID}:${TW_TOKEN}`);
        for (const u of eligible) {
          const phone = normPhone(u.telefono);
          if (!phone) continue;
          try {
            const params = new URLSearchParams({ To: phone, Body: SMS_BODY });
            if (TW_MSG_SVC) params.append('MessagingServiceSid', TW_MSG_SVC);
            else params.append('From', TW_FROM);
            const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`, {
              method: 'POST',
              headers: { Authorization: `Basic ${tw_auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params.toString(),
            });
            if (r.ok) sms_sent++;
            else sms_failed++;
          } catch (_) { sms_failed++; }
        }
      }

      console.log('[send-reengagement-followup] done', { bucket, emails_sent, emails_failed, sms_sent, sms_failed, marked: ids.length });
    };

    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(sendAll());
    else sendAll().catch(e => console.error('[reengagement] async:', e));

    return json({
      dry_run: false,
      bucket,
      started: true,
      target_size: eligible.length,
      message: 'Background send started.',
    });
  } catch (err) {
    console.error('[send-reengagement-followup]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

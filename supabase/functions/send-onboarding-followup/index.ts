// Edge Function: send-onboarding-followup — Mario 2026-05-29
// One-shot onboarding re-engagement for FREE users who downloaded but never
// engaged. Targets dormant users registered N days ago with no recent ultimo_acceso
// and no active membership.
//
// Bucket params:
//   "hot"   → 8-14 days since signup    (165 users at run time)
//   "warm"  → 15-30 days                (76 users)
//   "cool"  → 31-60 days                (39 users)
//   "cold"  → 60+ days  (default OFF — high unsubscribe risk)
//
// Channels:
//   email  → Resend (always, if email present)
//   sms    → Twilio (only if phone present + valid)
//
// Tracking:
//   users.onboarding_sent_at column prevents re-sending the same user.
//
// Auth: admin via verifyAdminAuth
// Deploy: supabase functions deploy send-onboarding-followup --no-verify-jwt

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

const BUCKETS: Record<string, { min_days: number; max_days: number }> = {
  hot:  { min_days: 3, max_days: 14 },
  warm: { min_days: 15, max_days: 30 },
  cool: { min_days: 31, max_days: 60 },
  cold: { min_days: 61, max_days: 365 },
};

const EMAIL_SUBJECT = '¿Bajaste Maestro HVACR y se te olvidó?';
function emailHTML(name: string): string {
  const safeName = String(name || 'Técnico').replace(/[<>]/g, '');
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 20px;color:#0f172a;">
  <p style="font-size:17px;margin:0 0 16px;">Hola <b>${safeName}</b>,</p>
  <p style="font-size:15px;line-height:1.55;margin:0 0 18px;">Bajaste Maestro HVACR pero <b>no la has abierto todavía</b>. Acuérdate que tienes:</p>
  <ul style="font-size:14px;line-height:1.7;color:#334155;padding-left:20px;margin:0 0 22px;">
    <li>Diagnósticos en tiempo real con sensores <b>Fieldpiece + Testo</b></li>
    <li><b>AI Chaka</b> — tu asistente HVAC en español</li>
    <li>EPA 608, NATE, OSHA — preparación completa</li>
    <li>Bolsa de trabajo y marketplace de herramientas</li>
  </ul>
  <p style="font-size:15px;font-weight:600;margin:0 0 14px;">Abre la app y empieza:</p>
  <p style="margin:0 0 28px;">
    <a href="https://maestrohvacr.com/get?s=onboarding&c=hot" style="display:inline-block;background:#000;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin:4px 6px 4px 0;">🍎 Descargar para iOS</a>
    <a href="https://maestrohvacr.com/get?s=onboarding&c=hot" style="display:inline-block;background:#34a853;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin:4px 0;">📥 Google Play</a>
  </p>
  <p style="font-size:14px;color:#475569;margin:0;">— Maestro Mario</p>
</div>`;
}
const SMS_BODY = 'Hola técnico, bajaste Maestro HVACR pero no la has abierto. Tienes BLE, AI Chaka, cursos EPA. Empieza: https://maestrohvacr.com/get?s=onboarding STOP=baja';

interface UserRow { id: string; nombre: string | null; email: string | null; telefono: string | null; }

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
    const { admin_email, bucket = 'hot', dry_run = true, channels = ['email', 'sms'] } = body;

    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    if (!BUCKETS[bucket]) return json({ error: 'Invalid bucket. Use: hot | warm | cool | cold' }, 400);
    const { min_days, max_days } = BUCKETS[bucket];

    // Query target users (dormant + no active membership + not already sent)
    const minDate = new Date(Date.now() - max_days * 86400 * 1000).toISOString();
    const maxDate = new Date(Date.now() - min_days * 86400 * 1000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 3 * 86400 * 1000).toISOString();

    // Two-step query: 1) get IDs with active memberships, 2) exclude them
    const { data: activeMemberRows } = await sb
      .from('memberships')
      .select('user_id')
      .eq('activa', true)
      .not('user_id', 'is', null);
    const activeUserIds = new Set(((activeMemberRows || []) as { user_id: string }[]).map(r => r.user_id));

    const { data: users, error: uErr } = await sb
      .from('users')
      .select('id, nombre, email, telefono, fecha_registro, ultimo_acceso, onboarding_sent_at')
      .gte('fecha_registro', minDate)
      .lt('fecha_registro', maxDate)
      .or(`ultimo_acceso.is.null,ultimo_acceso.lt.${threeDaysAgo}`)
      .is('onboarding_sent_at', null)
      .limit(2000);
    if (uErr) throw uErr;

    const eligible = ((users || []) as (UserRow & { id: string })[]).filter(u => !activeUserIds.has(u.id));

    if (dry_run) {
      return json({
        dry_run: true,
        bucket,
        target_size: eligible.length,
        with_email: eligible.filter(u => !!u.email).length,
        with_phone: eligible.filter(u => !!normPhone(u.telefono)).length,
        sample: eligible.slice(0, 3).map(u => ({ name: u.nombre, email: u.email, has_phone: !!normPhone(u.telefono) })),
      });
    }

    // Send for real — async via waitUntil so we don't block the response
    const sendAll = async () => {
      const nowIso = new Date().toISOString();
      let emails_sent = 0, emails_failed = 0, sms_sent = 0, sms_failed = 0;

      // Send emails
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
                tags: [{ name: 'campaign', value: 'onboarding-followup-' + bucket }],
              }),
            });
            if (r.ok) emails_sent++;
            else emails_failed++;
          } catch (_) { emails_failed++; }
        }
      }

      // Send SMS to those with phone
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

      // Mark all eligible as sent so we never double-send
      const idsToMark = eligible.map(u => u.id);
      for (let i = 0; i < idsToMark.length; i += 500) {
        const chunk = idsToMark.slice(i, i + 500);
        await sb.from('users').update({ onboarding_sent_at: nowIso }).in('id', chunk);
      }

      console.log('[send-onboarding-followup] done', { bucket, emails_sent, emails_failed, sms_sent, sms_failed, marked: idsToMark.length });
    };

    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(sendAll());
    } else {
      // Fallback: fire-and-forget
      sendAll().catch(e => console.error('[onboarding] async error:', e));
    }

    return json({
      dry_run: false,
      bucket,
      started: true,
      target_size: eligible.length,
      message: 'Background send started. Check users.onboarding_sent_at after a few minutes.',
    });
  } catch (err) {
    console.error('[send-onboarding-followup]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

// sms-students — Envía SMS SOLO a estudiantes registrados (users.telefono).
// Distinto de sms-live-alert (que pega a los ~18,544 contactos de marketing).
// Admin-auth gated. Soporta dry_run (solo cuenta) y test_phone (manda a 1 número).
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

function normPhone(raw: string | null): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  if (digits.length >= 10 && digits.length <= 15) return '+' + digits;
  return null;
}

async function twilioSend(sid: string, token: string, msgSvc: string, from: string, to: string, body: string): Promise<{ ok: boolean; sid: string | null; err: string | null }> {
  const auth = btoa(`${sid}:${token}`);
  const params = new URLSearchParams({ To: to, Body: body });
  if (msgSvc) params.append('MessagingServiceSid', msgSvc);
  else params.append('From', from);
  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (r.ok) { const j = await r.json().catch(() => ({})); return { ok: true, sid: j.sid || null, err: null }; }
    const t = await r.text();
    return { ok: false, sid: null, err: t.slice(0, 200) };
  } catch (e) {
    return { ok: false, sid: null, err: (e as Error).message };
  }
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const rl = await checkRateLimit(req, { maxRequests: 5 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const TW_SID = Deno.env.get('TWILIO_ACCOUNT_SID') || '';
    const TW_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') || '';
    const TW_MSG_SVC = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || '';
    const TW_FROM = Deno.env.get('TWILIO_FROM_NUMBER') || '';

    const { body, admin_email, dry_run, test_phone } = await req.json();
    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    if (!TW_SID || !TW_TOKEN || !(TW_FROM || TW_MSG_SVC)) return json({ error: 'Twilio no configurado' }, 500);

    const smsBody = (body && String(body).slice(0, 600)) || '🔴 EN VIVO AHORA: Clase de HVAC GRATIS con el Maestro. Entra ya. STOP=baja';

    // Modo prueba: manda solo a 1 número (para que Mario valide antes del envío masivo)
    if (test_phone) {
      const phone = normPhone(test_phone);
      if (!phone) return json({ error: 'Teléfono de prueba inválido' }, 400);
      const res = await twilioSend(TW_SID, TW_TOKEN, TW_MSG_SVC, TW_FROM, phone, smsBody);
      return json({ test: true, phone, sent: res.ok, error: res.err });
    }

    // Estudiantes registrados con teléfono (excluye cuentas internas/sintéticas)
    const { data: users, error: uErr } = await sb
      .from('users')
      .select('id, telefono, email')
      .not('telefono', 'is', null)
      .not('email', 'ilike', '%synthetic%')
      .not('email', 'ilike', '%@maestrohvacr.com')
      .not('email', 'ilike', '%@acvolt%')
      .limit(20000);
    if (uErr) throw uErr;

    const seen = new Set<string>();
    const phones: string[] = [];
    for (const u of (users || []) as { telefono: string | null }[]) {
      const p = normPhone(u.telefono);
      if (p && !seen.has(p)) { seen.add(p); phones.push(p); }
    }

    if (dry_run) return json({ dry_run: true, target: phones.length });

    const broadcastKey = 'live-students-' + Date.now();
    const sendAll = async () => {
      let sent = 0, failed = 0;
      for (const phone of phones) {
        const res = await twilioSend(TW_SID, TW_TOKEN, TW_MSG_SVC, TW_FROM, phone, smsBody);
        if (res.ok) sent++; else failed++;
        try {
          await sb.from('sms_send_log').insert({
            phone, status: res.ok ? 'sent' : 'failed', twilio_sid: res.sid,
            broadcast_key: broadcastKey, sent_at: new Date().toISOString(),
          });
        } catch (_) { /* best effort */ }
      }
      console.log('[sms-students] done', { sent, failed, total: phones.length });
    };

    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(sendAll());
    else sendAll().catch((e) => console.error('[sms-students] async:', e));

    return json({ started: true, target: phones.length, broadcast_key: broadcastKey });
  } catch (err) {
    console.error('[sms-students]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

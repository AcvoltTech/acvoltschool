// Edge Function: send-welcome-batch
// Envía UN batch de bienvenida ("curso completo de HVACR en una app") a los usuarios
// que NUNCA han recibido correo (no aparecen en email_send_log). Vía Resend.
//
// SEGURIDAD (lección de los ~1,000 duplicados, Mario 2026-05-29):
//   MARCA cada correo en email_send_log SÍNCRONAMENTE antes del envío en segundo plano.
//   La cohorte excluye a cualquiera que ya esté en email_send_log → cero duplicados aun
//   si se corre dos veces.
//
// Modos: dry_run (default true → solo cuenta) · test_to (manda 1 de prueba, no marca) ·
//   real (dry_run=false → marca y manda a los 810).
// Mario 2026-06-03. Deploy: supabase functions deploy send-welcome-batch --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;

const ALLOWED = ['https://acvoltschool.com', 'https://www.acvoltschool.com', 'https://acvoltschool.pages.dev', 'http://localhost:3000', 'http://127.0.0.1:5500'];
let cors: Record<string, string> = {};
function initCors(req: Request) { const o = req.headers.get('origin') || ''; cors = { 'Access-Control-Allow-Origin': ALLOWED.includes(o) ? o : ALLOWED[0], 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' }; }
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } }); }

const BROADCAST_KEY = 'welcome-curso-2026-06';
const SUBJECT = '¿Curso completo de HVACR en una app? 🔧 Descúbrelo gratis';
const LINK = 'https://maestrohvacr.com/get?s=welcome-curso';
const FROM = 'Maestro Mario <mario@maestrohvacr.com>';
const UNSUB = 'mailto:Techschoolacvolt@gmail.com?subject=BAJA';

function emailHTML(nombre: string): string {
  const hi = nombre ? ('Hola ' + nombre + ',') : 'Hola,';
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;line-height:1.6;">
    <p style="font-size:15px;">${hi}</p>
    <h2 style="color:#13294a;font-size:21px;margin:6px 0 10px;">¿Un curso completo de HVACR en una sola app?</h2>
    <p style="font-size:15px;">Ven y descúbrelo en <b>Maestro HVACR</b> — compresores, condensadores, evaporadores, refrigerantes, controles, máquinas de hielo y más, explicado por tu Maestro Mario.</p>
    <p style="text-align:center;margin:26px 0;">
      <a href="${LINK}" style="display:inline-block;background:linear-gradient(135deg,#c9a14a,#a8842f);color:#1a1206;text-decoration:none;font-weight:800;font-size:16px;padding:14px 28px;border-radius:12px;">Descárgala GRATIS hoy 👉</a>
    </p>
    <p style="font-size:15px;">— Maestro Mario · ACVOLT Tech School</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0 10px;">
    <p style="font-size:11px;color:#9ca3af;">Recibes este correo porque te registraste en Maestro HVACR / ACVOLT Tech School. ¿No quieres más correos? Responde con <b>BAJA</b> o escribe a Techschoolacvolt@gmail.com.</p>
  </div>`;
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND = Deno.env.get('RESEND_API_KEY') || '';
    const sb = createClient(SB_URL, SB_KEY);

    const body = await req.json().catch(() => ({}));
    const { admin_email, dry_run = true, test_to = null } = body;
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    if (!RESEND) return json({ error: 'RESEND_API_KEY no configurada' }, 500);

    // ── MODO PRUEBA: manda 1 correo al test_to, NO marca, NO toca la cohorte ──
    if (test_to) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: String(test_to), subject: '[PRUEBA] ' + SUBJECT, html: emailHTML('Mario'), headers: { 'List-Unsubscribe': '<' + UNSUB + '>' } }),
      });
      const ok = r.ok; const txt = await r.text();
      return json({ ok, mode: 'test', to: test_to, resend: txt.slice(0, 200) });
    }

    // ── Cohorte: anti-join EN LA BASE (RPC) — usuarios que NUNCA están en email_send_log.
    // Se calcula en Postgres para NO depender del tope de 1000 filas de PostgREST
    // (ese tope rompía el dedup si se hacía del lado del cliente). Mario 2026-06-03.
    const { data: cohortRows, error } = await sb.rpc('welcome_never_emailed_cohort');
    if (error) throw error;
    const cohort = (cohortRows || []).map((r: { nombre: string; email: string }) => ({ nombre: r.nombre || '', email: r.email }));

    if (dry_run) {
      return json({ ok: true, mode: 'dry_run', cohort: cohort.length, sample: cohort.slice(0, 5).map((u) => u.email) });
    }

    // campaign_id es uuid con FK a email_campaigns → buscar la campaña por slug.
    const { data: camp } = await sb.from('email_campaigns').select('id').eq('slug', BROADCAST_KEY).limit(1);
    const campaignId = camp && camp[0] && camp[0].id;
    if (!campaignId) return json({ error: 'Campaña no encontrada (email_campaigns.slug=' + BROADCAST_KEY + '). Créala primero.' }, 500);

    // ── REAL: MARCAR antes de enviar (cero duplicados). Si el marcado falla, ABORTAR (no enviar). ──
    const nowIso = new Date().toISOString();
    const rows = cohort.map((u) => ({ campaign_id: campaignId, email: u.email.toLowerCase().trim(), recipient_email: u.email, broadcast_key: BROADCAST_KEY, title: SUBJECT, status: 'sending', sent_at: nowIso, lang: 'es' }));
    for (let i = 0; i < rows.length; i += 500) {
      const ins = await sb.from('email_send_log').insert(rows.slice(i, i + 500));
      if (ins.error) return json({ error: 'Marcado falló (no se envió nada): ' + ins.error.message }, 500);
    }

    const sendAll = async () => {
      let sent = 0, failed = 0;
      for (let i = 0; i < cohort.length; i += 100) {
        const chunk = cohort.slice(i, i + 100);
        const batch = chunk.map((u) => ({ from: FROM, to: u.email, subject: SUBJECT, html: emailHTML(u.nombre || ''), headers: { 'List-Unsubscribe': '<' + UNSUB + '>' } }));
        try {
          const r = await fetch('https://api.resend.com/emails/batch', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify(batch) });
          if (r.ok) sent += chunk.length; else { failed += chunk.length; console.error('[welcome-batch] resend batch err', r.status, (await r.text()).slice(0, 200)); }
        } catch (e) { failed += chunk.length; console.error('[welcome-batch] batch throw', String(e).slice(0, 160)); }
      }
      await sb.from('email_send_log').update({ status: 'sent' }).eq('broadcast_key', BROADCAST_KEY).eq('status', 'sending');
      console.log('[welcome-batch] done', { sent, failed, marked: rows.length });
    };
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(sendAll());
    else sendAll();

    return json({ ok: true, mode: 'send', queued: cohort.length });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});

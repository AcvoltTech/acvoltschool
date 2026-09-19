// fcm-push — Manda push NATIVO (FCM v1) a los usuarios de la APP (iOS + Android).
// El send-push-notification existente solo hace web-push (endpoint); los usuarios de la
// app tienen device_token (FCM) y NO recibían nada. Esto lo arregla. Admin-auth gated.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com', 'https://www.maestrohvacr.com',
  'https://acvoltschool.com', 'https://www.acvoltschool.com',
  'https://maestroac-app-clon.pages.dev', 'https://clon-ios-googleplay.pages.dev',
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

// ── Lector paginado (rompe el tope de 1,000 filas de PostgREST) ──
// 🔴 RAÍZ: PostgREST corta TODA consulta en 1,000 filas (max_rows = 1000 del SERVIDOR).
// Sin error, sin aviso: HTTP 200 con exactamente 1,000 filas. El síntoma es un total que
// nunca se mueve. 🪤 `.limit(50000)` NO sirve — el tope no lo pone el cliente. Se pagina.
// 🪤 Se ordena por `id` (ÚNICO): con una columna con empates, una página repite filas y
// se salta otras → unos reciben dos push y otros ninguno.
// 🪤 supabase-js NUNCA tira excepción: hay que leer `error` en CADA página y reportar
// PARCIAL con lo que sí se leyó, en vez de seguir callado con una lista corta.
const PAGE_SIZE = 1000;
const MAX_PAGES = 100; // tope de seguridad (100k filas) para no caer en un bucle eterno
async function fetchAllPaged<T>(
  build: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: { message?: string } | null }>,
): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * PAGE_SIZE;
    const { data, error } = await build(offset, offset + PAGE_SIZE - 1);
    if (error) return { rows, error: error.message || String(error) };
    const batch = (data || []) as T[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return { rows, error: null };
  }
  return { rows, error: `Se alcanzó el tope de ${MAX_PAGES} páginas (${MAX_PAGES * PAGE_SIZE} filas)` };
}

// ── Google OAuth (JWT RS256 con el service account) ──
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\\n/g, '').replace(/\s+/g, '');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}
function b64url(data: string | Uint8Array): string {
  let bin: string;
  if (typeof data === 'string') bin = data;
  else { bin = ''; for (let i = 0; i < data.length; i++) bin += String.fromCharCode(data[i]); }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  };
  const enc = new TextEncoder();
  const unsigned = b64url(JSON.stringify(header)) + '.' + b64url(JSON.stringify(claim));
  const key = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(sa.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned)));
  const jwt = unsigned + '.' + b64url(sig);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt,
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('OAuth fail: ' + JSON.stringify(j).slice(0, 200));
  return j.access_token as string;
}

async function fcmSend(projectId: string, accessToken: string, token: string, title: string, body: string, url: string): Promise<{ ok: boolean; stale: boolean; err: string | null }> {
  const msg = {
    message: {
      token,
      notification: { title, body },
      data: { url, type: 'clase' },
      android: { priority: 'high', notification: { sound: 'default' } },
      apns: {
        headers: { 'apns-priority': '10' },
        // alert EXPLÍCITO + interruption-level time-sensitive (atraviesa Focus mode — una clase EN VIVO es urgente)
        payload: { aps: { alert: { title, body }, sound: 'default', badge: 1, 'interruption-level': 'time-sensitive' } },
      },
    },
  };
  try {
    const r = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (r.ok) return { ok: true, stale: false, err: null };
    const t = await r.text();
    // UNREGISTERED / invalid token → marcar inactivo
    const stale = r.status === 404 || /UNREGISTERED|INVALID_ARGUMENT/i.test(t);
    return { ok: false, stale, err: t.slice(0, 160) };
  } catch (e) {
    return { ok: false, stale: false, err: (e as Error).message };
  }
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const SA_RAW = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON') || '';
    if (!SA_RAW) return json({ error: 'FCM_SERVICE_ACCOUNT_JSON no configurado' }, 500);

    const { title, body, url, admin_email, dry_run, test_token, recipient_emails, solo_vip } = await req.json();
    const sb = createClient(SB_URL, SB_KEY);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);

    const sa = JSON.parse(SA_RAW);
    const projectId = sa.project_id;
    const t = (title || '🔴 CLASE EN VIVO — Maestro Mario').slice(0, 120);
    const b = (body || 'Estamos EN VIVO ahora. Toca para unirte.').slice(0, 240);
    const u = url || './index.html#liveStreamingScreen?ntf=1';

    // Modo prueba: 1 token
    if (test_token) {
      const accessToken = await getAccessToken(sa);
      const res = await fcmSend(projectId, accessToken, test_token, t, b, u);
      return json({ test: true, sent: res.ok, error: res.err });
    }

    // Tokens nativos activos (app iOS + Android)
    // 🔴 RAÍZ (medido 2026-09-10): hay 5,795 tokens activos, pero esto devolvía 1,000.
    // Síntoma real: `[fcm-push] done { total: ... }` imprimía ~1000 para siempre y TODO
    // dispositivo iOS/Android después del primer millar jamás recibía un push. El
    // `.limit(50000)` daba falsa tranquilidad: el tope es del servidor. Ahora se pagina.
    /* 🔴 ESTA FUNCIÓN IGNORABA LA AUDIENCIA POR COMPLETO (Codex CDX-158 · 19-sep-2026).
     *  No leía `recipient_emails` ni `solo_vip`: mandaba a TODOS los tokens nativos
     *  activos, siempre. El botón manual «📣 ALERTA A TODOS» la llama, así que una
     *  clase VIP $149.99 se le anunciaba a los ~5,795 teléfonos iOS/Android aunque el
     *  web-push sí respetara `__vip__`. El canal grande era justo el que no filtraba.
     *  🪤 Sin audiencia declarada NO se manda: mismo contrato que broadcast-live-alert.
     */
    const audiencia: string[] = Array.isArray(recipient_emails)
      ? recipient_emails.map((e: unknown) => String(e || '').trim().toLowerCase()).filter(Boolean)
      : [];
    if (audiencia.length === 0) {
      return json({ error: 'audiencia_no_declarada', detalle: 'Di a quién: ["__all__"], ["__vip__"] o una lista de correos.' }, 400);
    }
    const esTodos = audiencia.includes('__all__');
    const esVip = audiencia.includes('__vip__') || solo_vip === true;

    const { rows: subs, error: subsErr } = await fetchAllPaged<{ device_token: string | null; user_email: string | null }>(
      (from, to) => sb
        .from('push_subscriptions')
        .select('id, device_token, user_email')
        .eq('active', true)
        .not('device_token', 'is', null)
        .order('id', { ascending: true })
        .range(from, to),
    );
    /* 🪤 MEDIA LISTA NO ES LA LISTA. Antes, con lectura parcial se seguía enviando y la
     *  respuesta "lo decía" — pero el registro quedaba como envío hecho. Ahora aborta,
     *  igual que send-push-notification y broadcast-live-alert. */
    if (subsErr) return json({ error: 'audiencia_incompleta', detalle: 'No pude leer toda la lista de suscripciones: ' + subsErr }, 503);

    // A quién se le permite: todos, solo VIP (por la regla canónica que usa la PUERTA),
    // o exactamente los correos pedidos.
    let permitido: ((correo: string) => boolean) | null = null;
    if (!esTodos) {
      if (esVip) {
        const candidatos = [...new Set(subs.map((s) => String(s.user_email || '').trim().toLowerCase()).filter(Boolean))];
        const vip = new Set<string>();
        for (let i = 0; i < candidatos.length; i += 20) {
          const tanda = candidatos.slice(i, i + 20);
          const veredictos = await Promise.all(tanda.map(async (correo) => {
            const { data, error } = await sb.rpc('tiene_vip_para_clase', { p_email: correo });
            if (error || typeof data !== 'boolean') return null;
            return data ? correo : '';
          }));
          for (const v of veredictos) {
            // 🪤 Si la regla no contesta, NO se manda: una clase de paga no se anuncia "a ver si pega".
            if (v === null) return json({ error: 'vip_policy_unavailable' }, 503);
            if (v) vip.add(v);
          }
        }
        permitido = (correo) => vip.has(correo);
      } else {
        const pedidos = new Set(audiencia.filter((e) => e.includes('@')));
        if (pedidos.size === 0) return json({ error: 'audiencia_no_declarada', detalle: 'La lista no traía correos válidos.' }, 400);
        permitido = (correo) => pedidos.has(correo);
      }
    }

    const seen = new Set<string>();
    const tokens: string[] = [];
    for (const s of subs) {
      if (!s.device_token || seen.has(s.device_token)) continue;
      if (permitido && !permitido(String(s.user_email || '').trim().toLowerCase())) continue;
      seen.add(s.device_token); tokens.push(s.device_token);
    }
    console.log('[fcm-push] audiencia ' + (esTodos ? '__all__' : esVip ? '__vip__' : 'lista') +
                ' → ' + tokens.length + ' tokens de ' + subs.length + ' suscripciones');

    const partial = subsErr ? { partial: true, audience_read_error: subsErr } : {};
    if (dry_run) return json({ dry_run: true, target: tokens.length, ...partial });

    const accessToken = await getAccessToken(sa);
    const sendAll = async () => {
      let sent = 0, failed = 0, stale = 0;
      const staleTokens: string[] = [];
      for (const token of tokens) {
        const res = await fcmSend(projectId, accessToken, token, t, b, u);
        if (res.ok) sent++;
        else { failed++; if (res.stale) { stale++; staleTokens.push(token); } }
      }
      // Desactiva tokens muertos
      // 🪤 Lotes de 50, no de 200: un `.in()` con 200 tokens FCM (~160 caracteres cada uno)
      // arma una URL de ~32 KB que el servidor rechaza — y como supabase-js NUNCA tira
      // excepción, el `catch` de abajo jamás se enteraba: los tokens muertos seguían vivos
      // en la tabla y los reintentábamos en cada envío. Con 5,795 tokens (antes 1,000
      // por el tope de PostgREST) esa lista ya es grande de verdad.
      let staleCleaned = 0;
      for (let i = 0; i < staleTokens.length; i += 50) {
        const chunk = staleTokens.slice(i, i + 50);
        const { error: upErr } = await sb.from('push_subscriptions').update({ active: false }).in('device_token', chunk);
        if (upErr) console.warn('[fcm-push] no se pudieron desactivar tokens muertos:', upErr.message);
        else staleCleaned += chunk.length;
      }
      console.log('[fcm-push] done', { sent, failed, stale, stale_cleaned: staleCleaned, total: tokens.length, audience_read_error: subsErr || null });
    };

    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(sendAll());
    else sendAll().catch((e) => console.error('[fcm-push] async:', e));

    return json({ started: true, target: tokens.length, ...partial });
  } catch (err) {
    console.error('[fcm-push]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

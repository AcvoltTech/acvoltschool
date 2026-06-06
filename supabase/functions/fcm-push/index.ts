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
      apns: { headers: { 'apns-priority': '10' }, payload: { aps: { sound: 'default' } } },
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

    const { title, body, url, admin_email, dry_run, test_token } = await req.json();
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
    const { data: subs, error } = await sb
      .from('push_subscriptions')
      .select('device_token')
      .eq('active', true)
      .not('device_token', 'is', null)
      .limit(50000);
    if (error) throw error;

    const seen = new Set<string>();
    const tokens: string[] = [];
    for (const s of (subs || []) as { device_token: string | null }[]) {
      if (s.device_token && !seen.has(s.device_token)) { seen.add(s.device_token); tokens.push(s.device_token); }
    }

    if (dry_run) return json({ dry_run: true, target: tokens.length });

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
      for (let i = 0; i < staleTokens.length; i += 200) {
        const chunk = staleTokens.slice(i, i + 200);
        try { await sb.from('push_subscriptions').update({ active: false }).in('device_token', chunk); } catch (_) { /* */ }
      }
      console.log('[fcm-push] done', { sent, failed, stale, total: tokens.length });
    };

    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) EdgeRuntime.waitUntil(sendAll());
    else sendAll().catch((e) => console.error('[fcm-push] async:', e));

    return json({ started: true, target: tokens.length });
  } catch (err) {
    console.error('[fcm-push]', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});

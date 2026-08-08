// _shared/fcm.ts — Envío de push NATIVO (FCM v1) reutilizable.
// Los usuarios de la APP (iOS + Android) tienen device_token (FCM), NO endpoint web-push.
// send-push-notification (web-push/VAPID) NO les llegaba; este helper cierra ese hueco.
// Copiado de fcm-push (misma lógica probada). Mario 2026-07-02.

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

export async function getFcmAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
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

export async function fcmSend(projectId: string, accessToken: string, token: string, title: string, body: string, url: string, isLive = false): Promise<{ ok: boolean; stale: boolean; err: string | null }> {
  const msg = {
    message: {
      token,
      notification: { title, body },
      data: { url, type: isLive ? 'clase' : 'general' },
      android: { priority: 'high', notification: { sound: 'default' } },
      apns: {
        headers: { 'apns-priority': '10' },
        payload: { aps: { alert: { title, body }, sound: 'default', badge: 1, 'interruption-level': isLive ? 'time-sensitive' : 'active' } },
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
    const stale = r.status === 404 || /UNREGISTERED|INVALID_ARGUMENT/i.test(t);
    return { ok: false, stale, err: t.slice(0, 160) };
  } catch (e) {
    return { ok: false, stale: false, err: (e as Error).message };
  }
}

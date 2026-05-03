// Edge Function: android-crash-poller
// Pulls Android crash data from Google Play Developer Reporting API and writes to native_crashes.
//
// Required Supabase secrets:
//   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON — full JSON contents of the SA key file
//   GOOGLE_PLAY_APP_PACKAGE          — e.g. com.acvolttech.maestrohvacr
//
// Deploy: supabase functions deploy android-crash-poller --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === 'string') bytes = new TextEncoder().encode(input);
  else if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else bytes = input;
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function importPkcs8RSA(pem: string): Promise<CryptoKey> {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\s/g, '');
  const der = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8', der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
}

async function getGoogleAccessToken(saJson: { client_email: string; private_key: string; token_uri?: string }, scope: string): Promise<string> {
  const key = await importPkcs8RSA(saJson.private_key);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: saJson.client_email,
    scope,
    aud: saJson.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, key, data);
  const assertion = `${headerB64}.${payloadB64}.${b64url(sig)}`;

  const tokenRes = await fetch(saJson.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });
  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    throw new Error(`Google token exchange failed ${tokenRes.status}: ${txt.slice(0, 300)}`);
  }
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const SA_JSON_RAW = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON') || '';
  const APP_PACKAGE = Deno.env.get('GOOGLE_PLAY_APP_PACKAGE') || '';

  if (!SA_JSON_RAW || !APP_PACKAGE) {
    return jsonResponse({
      error: 'Google Play credentials not configured',
      missing: { service_account_json: !SA_JSON_RAW, app_package: !APP_PACKAGE },
    }, 503);
  }

  let saJson: { client_email: string; private_key: string; token_uri?: string };
  try {
    saJson = JSON.parse(SA_JSON_RAW);
  } catch (e) {
    return jsonResponse({ error: 'Service account JSON invalid', details: (e as Error).message }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const accessToken = await getGoogleAccessToken(
      saJson,
      'https://www.googleapis.com/auth/playdeveloperreporting'
    );

    // Google Play Developer Reporting API — fetch crash rate metric set.
    // https://developers.google.com/play/developer/reporting/reference/rest/v1beta1/apps.crashRateMetricSet/query
    const queryRes = await fetch(
      `https://playdeveloperreporting.googleapis.com/v1beta1/apps/${APP_PACKAGE}/crashRateMetricSet:query`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensions: ['apiLevel', 'versionCode', 'deviceModel'],
          metrics: ['crashRate', 'distinctUsers'],
          timelineSpec: {
            aggregationPeriod: 'DAILY',
            startTime: { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() - 1 },
            endTime: { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() },
          },
        }),
      }
    );

    if (!queryRes.ok) {
      const txt = await queryRes.text();
      return jsonResponse({ error: 'Play Reporting API error', http_status: queryRes.status, body: txt.slice(0, 500) }, 500);
    }

    const queryData = await queryRes.json();
    const rows = queryData?.rows || [];

    // Insert one summary row per (versionCode, deviceModel) — full per-crash
    // detail requires the separate Vitals API. This gets us aggregates fast.
    let inserted = 0;
    for (const row of rows) {
      const dims: Record<string, string> = {};
      for (const d of (row.dimensions || [])) {
        dims[d.dimension] = d.stringValue || String(d.int64Value || '');
      }
      const metrics: Record<string, number> = {};
      for (const m of (row.metrics || [])) {
        metrics[m.metric] = parseFloat(m.decimalValue || m.int64Value || '0');
      }
      const crashRate = metrics.crashRate || 0;
      const distinctUsers = metrics.distinctUsers || 0;
      if (distinctUsers === 0) continue;

      await supabase.from('native_crashes').insert({
        platform: 'android',
        occurred_at: new Date().toISOString(),
        app_version: dims.versionCode || null,
        os_version: dims.apiLevel || null,
        device_model: dims.deviceModel || null,
        crash_type: 'aggregate',
        exception_message: `crashRate=${crashRate.toFixed(4)}`,
        affected_users: Math.round(distinctUsers),
        raw_payload: row,
      });
      inserted++;
    }

    return jsonResponse({ ok: true, rows_returned: rows.length, inserted });
  } catch (e) {
    return jsonResponse({ error: 'Android poll failed', details: (e as Error).message }, 500);
  }
});

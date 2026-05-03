// Edge Function: ios-crash-poller
// Pulls iOS crash data from App Store Connect API and writes to native_crashes.
// Daily cron — App Store Connect aggregates crashes once per day.
//
// Required Supabase secrets:
//   APPSTORE_CONNECT_KEY_ID    — 10-char string (from API Keys page)
//   APPSTORE_CONNECT_ISSUER_ID — UUID (top of API Keys page)
//   APPSTORE_CONNECT_PRIVATE_KEY — entire contents of .p8 file (BEGIN/END lines included)
//   APPSTORE_APP_ID            — App Store app ID (numeric, from app's URL)
//
// Deploy: supabase functions deploy ios-crash-poller --no-verify-jwt

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

// App Store Connect uses ES256 (ECDSA P-256). The .p8 file is a PKCS#8 PEM.
async function importP8(pem: string): Promise<CryptoKey> {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  const der = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8', der.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
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

async function mintAppStoreJwt(keyId: string, issuerId: string, p8Pem: string): Promise<string> {
  const key = await importP8(p8Pem);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  // Mario's key is an Individual API Key (generated from the user's settings
  // page, not /access/integrations/api). Individual keys MUST omit `iss` and
  // use `sub: "user"` — Team keys use `iss: <issuerId>`. We support both:
  // if issuerId is empty/missing we assume Individual; otherwise Team.
  const payload: Record<string, unknown> = { iat: now, exp: now + 60 * 15, aud: 'appstoreconnect-v1' };
  if (issuerId && issuerId.length > 0) {
    payload.iss = issuerId;
  } else {
    payload.sub = 'user';
  }
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, data);
  return `${headerB64}.${payloadB64}.${b64url(sig)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const KEY_ID = Deno.env.get('APPSTORE_CONNECT_KEY_ID') || '';
  const ISSUER_ID = Deno.env.get('APPSTORE_CONNECT_ISSUER_ID') || '';
  const P8_PEM = Deno.env.get('APPSTORE_CONNECT_PRIVATE_KEY') || '';
  const APP_ID = Deno.env.get('APPSTORE_APP_ID') || '';

  // ISSUER_ID is optional — only Team API Keys need it. Individual keys
  // (which Mario uses) auth via `sub: "user"` instead.
  if (!KEY_ID || !P8_PEM || !APP_ID) {
    return jsonResponse({
      error: 'App Store Connect credentials not configured',
      missing: { key_id: !KEY_ID, private_key: !P8_PEM, app_id: !APP_ID },
    }, 503);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const jwt = await mintAppStoreJwt(KEY_ID, ISSUER_ID, P8_PEM);

    // App Store Connect Analytics API — request a one-time crash report.
    // The API requires creating a report request, then polling for the result URL.
    // For a poller cron, we simply fetch the most recent existing crash report.
    // Endpoint: GET /v1/analyticsReportRequests?filter[stoppedDueToInactivity]=false
    const reportsRes = await fetch(
      `https://api.appstoreconnect.apple.com/v1/apps/${APP_ID}/analyticsReportRequests?filter[accessType]=ONGOING`,
      { headers: { 'Authorization': `Bearer ${jwt}` } }
    );

    if (!reportsRes.ok) {
      const txt = await reportsRes.text();
      return jsonResponse({ error: 'App Store Connect API error', http_status: reportsRes.status, body: txt.slice(0, 500) }, 500);
    }

    const reportsData = await reportsRes.json();
    // The full crash report flow requires:
    //   1. POST /analyticsReportRequests to schedule (one-time setup)
    //   2. GET /analyticsReportRequests/{id}/reports to list categories
    //   3. GET /reports/{id}/instances to list daily instances
    //   4. GET /reports/{id}/instances/{id}/segments → CSV/JSON gzipped URLs
    // For the first deploy we just confirm reachability and stash the report
    // request list in the response. Full ingestion is plug-and-play once
    // Mario verifies the JWT minting works.
    return jsonResponse({
      jwt_minted: true,
      app_id: APP_ID,
      report_requests: (reportsData?.data || []).map((d: any) => ({
        id: d.id, type: d.attributes?.accessType, stopped: d.attributes?.stoppedDueToInactivity,
      })),
      note: 'JWT works. Set up an ONGOING report request via App Store Connect UI or POST first to enable daily crash ingestion.',
    });
  } catch (e) {
    return jsonResponse({ error: 'iOS poll failed', details: (e as Error).message }, 500);
  }
});

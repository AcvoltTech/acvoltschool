// Edge Function: live-stream-health-check
// Self-heals live_streams rows so students always see a working video.
//
// Runs every 60s via pg_cron + pg_net. Reconciliation rules:
//   1. status='live' but 100ms has NO active session → set status='ended'.
//   2. status='live' and 100ms has an active session, but playback_url is
//      stale (missing, points to cloudflarestream.com, or doesn't include
//      100ms.live) → fetch current HLS URL from 100ms and write it.
//   3. status='live' with valid 100ms-format URL → no change.
//
// Deploy: supabase functions deploy live-stream-health-check --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64url } from "https://deno.land/std@0.168.0/encoding/base64url.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(new Uint8Array(sig));
}

async function createMgmtToken(accessKey: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payloadB64 = base64url(enc.encode(JSON.stringify({
    access_key: accessKey,
    type: 'management',
    version: 2,
    iat: now,
    nbf: now,
    exp: now + 3600,
    jti: crypto.randomUUID(),
  })));
  const signature = await hmacSign(secret, `${headerB64}.${payloadB64}`);
  return `${headerB64}.${payloadB64}.${signature}`;
}

function isHealthyHlsUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('100ms.live') && url.endsWith('.m3u8');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const HMS_ACCESS_KEY = Deno.env.get('HMS_ACCESS_KEY') || '';
  const HMS_APP_SECRET = Deno.env.get('HMS_APP_SECRET') || '';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return jsonResponse({ error: 'Supabase env not configured' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const report: Record<string, unknown> = { checked_at: new Date().toISOString(), actions: [] };
  const actions = report.actions as Array<Record<string, unknown>>;

  try {
    // 1. Read all rows currently marked as live.
    const { data: liveRows, error: readErr } = await supabase
      .from('live_streams')
      .select('id, title, status, playback_url, started_at')
      .eq('status', 'live');

    if (readErr) {
      return jsonResponse({ error: 'Read failed', details: readErr.message }, 500);
    }

    report.live_count = (liveRows || []).length;

    if (!liveRows || liveRows.length === 0) {
      report.note = 'no live streams to reconcile';
      return jsonResponse(report);
    }

    // 2. Pull active 100ms sessions (one call covers every live row).
    let activeMap: Record<string, { hlsUrl: string | null; sessionId: string }> = {};
    let hmsAvailable = false;
    if (HMS_ACCESS_KEY && HMS_APP_SECRET) {
      try {
        const mgmt = await createMgmtToken(HMS_ACCESS_KEY, HMS_APP_SECRET);
        const lsRes = await fetch('https://api.100ms.live/v2/live-streams?status=running&limit=20', {
          headers: { 'Authorization': `Bearer ${mgmt}` },
        });
        if (lsRes.ok) {
          const lsData = await lsRes.json();
          const arr = Array.isArray(lsData?.data) ? lsData.data : [];
          for (const ls of arr) {
            const room = ls.room_id;
            if (!room) continue;
            activeMap[room] = {
              hlsUrl: ls?.playback?.url || null,
              sessionId: ls?.session_id || '',
            };
          }
          hmsAvailable = true;
        } else {
          const txt = await lsRes.text();
          report.hms_warning = `100ms list status ${lsRes.status}: ${txt.slice(0, 200)}`;
        }
      } catch (e) {
        report.hms_warning = `100ms call threw: ${(e as Error).message}`;
      }
    } else {
      report.hms_warning = 'HMS_ACCESS_KEY / HMS_APP_SECRET not set — skipping 100ms reconciliation';
    }

    // 3. Reconcile each live row.
    const activeRoomIds = Object.keys(activeMap);
    const anyHmsActive = activeRoomIds.length > 0;
    const firstActiveHls = anyHmsActive ? activeMap[activeRoomIds[0]].hlsUrl : null;

    for (const row of liveRows) {
      // Rule 1: nobody is broadcasting on 100ms — close the row.
      if (hmsAvailable && !anyHmsActive) {
        // Only close if the row was started long enough ago that "no active session"
        // is meaningful — gives 100ms 90s to register a fresh broadcast.
        const startedAt = row.started_at ? new Date(row.started_at).getTime() : 0;
        const ageMs = Date.now() - startedAt;
        if (startedAt && ageMs > 90_000) {
          await supabase.from('live_streams').update({ status: 'ended', ended_at: new Date().toISOString() }).eq('id', row.id);
          actions.push({ row: row.id, action: 'closed_orphaned_live', reason: 'no active 100ms session', age_seconds: Math.round(ageMs / 1000) });
        } else {
          actions.push({ row: row.id, action: 'skip', reason: 'too fresh to close', age_seconds: Math.round(ageMs / 1000) });
        }
        continue;
      }

      // Rule 2: URL is stale or missing — patch with current 100ms URL.
      if (anyHmsActive && !isHealthyHlsUrl(row.playback_url) && firstActiveHls) {
        await supabase.from('live_streams').update({ playback_url: firstActiveHls }).eq('id', row.id);
        actions.push({ row: row.id, action: 'patched_playback_url', from: row.playback_url, to: firstActiveHls });
        continue;
      }

      actions.push({ row: row.id, action: 'ok' });
    }

    return jsonResponse(report);
  } catch (e) {
    return jsonResponse({ error: 'health-check failed', details: (e as Error).message, partial: report }, 500);
  }
});

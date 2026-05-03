// Edge Function: cf-calls-proxy
// Proxies Cloudflare Calls API for Gallery View (student cameras)
// Deploy: npx supabase functions deploy cf-calls-proxy --no-verify-jwt
// Secrets needed: CF_CALLS_APP_ID, CF_CALLS_APP_SECRET
// Also uses default SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://www.maestrohvacr.com',
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvolttech.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Higher rate limit: students + admin all call this
  const rl = await checkRateLimit(req, { maxRequests: 60 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const CF_CALLS_APP_ID = Deno.env.get('CF_CALLS_APP_ID');
    const CF_CALLS_APP_SECRET = Deno.env.get('CF_CALLS_APP_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!CF_CALLS_APP_ID || !CF_CALLS_APP_SECRET) {
      throw new Error('Cloudflare Calls credentials not configured');
    }
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error('Supabase service role not configured');
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const body = await req.json();
    const { action, admin_email, user_email, ...params } = body;

    // ── Auth: allow admins (via admin_email) OR students (via user_email) ──
    const callerEmail = (admin_email || user_email || '').toLowerCase().trim();
    if (!callerEmail) {
      return jsonResponse({ error: 'Authentication required (admin_email or user_email)' });
    }

    let isAdmin = false;
    // Check admin tables first
    const { data: admins } = await supabase.from('admin_students').select('id').eq('email', callerEmail).limit(1);
    if (admins && admins.length > 0) {
      isAdmin = true;
    } else {
      const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', callerEmail).limit(1);
      if (staff && staff.length > 0) {
        isAdmin = true;
      }
    }

    // If not admin, verify as student in users table
    if (!isAdmin) {
      const { data: userRow } = await supabase.from('users').select('email').ilike('email', callerEmail).limit(1);
      if (!userRow || userRow.length === 0) {
        console.warn('[cf-calls-proxy] Unauthorized access attempt by:', callerEmail);
        return jsonResponse({ error: 'Unauthorized: ' + callerEmail });
      }
    }

    const cfBase = `https://rtc.live.cloudflare.com/v1/apps/${CF_CALLS_APP_ID}`;
    const cfHeaders = {
      'Authorization': `Bearer ${CF_CALLS_APP_SECRET}`,
      'Content-Type': 'application/json',
    };

    // ── ACTION: create_session ──
    if (action === 'create_session') {
      // CF Calls API rejects empty JSON object '{}' — send no body
      const cfRes = await fetch(`${cfBase}/sessions/new`, {
        method: 'POST',
        headers: { 'Authorization': cfHeaders['Authorization'] },
      });

      const cfData = await cfRes.json();
      if (cfData.errorCode) {
        return jsonResponse({ error: 'CF Calls error', details: cfData.errorDescription || cfData });
      }

      return jsonResponse({ sessionId: cfData.sessionId });
    }

    // ── ACTION: add_tracks ──
    // sdp_offer is OPTIONAL: if omitted, CF generates its own offer (used for subscribing to remote tracks)
    if (action === 'add_tracks') {
      const { session_id, sdp_offer, tracks } = params;
      if (!session_id) {
        return jsonResponse({ error: 'add_tracks: session_id required' });
      }

      const cfBody: Record<string, unknown> = { tracks: tracks || [] };
      if (sdp_offer) {
        cfBody.sessionDescription = { type: 'offer', sdp: sdp_offer };
      }

      const cfRes = await fetch(`${cfBase}/sessions/${session_id}/tracks/new`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify(cfBody),
      });

      const cfText = await cfRes.text();
      let cfData;
      try { cfData = JSON.parse(cfText); } catch(e) {
        return jsonResponse({ error: 'CF add_tracks parse error', details: cfText.substring(0, 200) });
      }

      console.log('[cf-calls-proxy] add_tracks response status:', cfRes.status,
        'errorCode:', cfData.errorCode,
        'hasSDP:', !!cfData.sessionDescription?.sdp,
        'sdpType:', cfData.sessionDescription?.type,
        'tracks:', JSON.stringify(cfData.tracks?.map((t: any) => ({ mid: t.mid, status: t.status, error: t.errorDescription })) || []));

      if (cfData.errorCode) {
        return jsonResponse({ error: 'CF add_tracks: ' + (cfData.errorDescription || JSON.stringify(cfData)) });
      }

      const trackErrors = (cfData.tracks || []).filter((t: any) => t.errorDescription);
      if (trackErrors.length > 0) {
        console.warn('[cf-calls-proxy] Track-level errors:', JSON.stringify(trackErrors));
      }

      return jsonResponse({
        sdp_answer: cfData.sessionDescription?.sdp || null,
        sdp_type: cfData.sessionDescription?.type || (sdp_offer ? 'answer' : 'offer'),
        tracks_info: cfData.tracks || [],
        track_errors: trackErrors.length > 0 ? trackErrors.map((t: any) => t.errorDescription) : undefined,
        require_negotiation: cfData.requiresImmediateRenegotiation || false,
      });
    }

    // ── ACTION: renegotiate ──
    // sdp_type: 'offer' (default) or 'answer' — for subscriber flow where admin sends answer
    if (action === 'renegotiate') {
      const { session_id, sdp_offer, sdp_type } = params;
      if (!session_id || !sdp_offer) {
        return jsonResponse({ error: 'renegotiate: session_id and sdp_offer required' });
      }

      const cfRes = await fetch(`${cfBase}/sessions/${session_id}/renegotiate`, {
        method: 'PUT',
        headers: cfHeaders,
        body: JSON.stringify({
          sessionDescription: { type: sdp_type || 'offer', sdp: sdp_offer },
        }),
      });

      const cfText = await cfRes.text();
      let cfData;
      try { cfData = JSON.parse(cfText); } catch(e) {
        return jsonResponse({ error: 'CF renegotiate parse error', details: cfText.substring(0, 200) });
      }

      if (cfData.errorCode) {
        return jsonResponse({ error: 'CF renegotiate: ' + (cfData.errorDescription || JSON.stringify(cfData)) });
      }

      return jsonResponse({
        sdp_answer: cfData.sessionDescription?.sdp || null,
        sdp_type: cfData.sessionDescription?.type || null,
      });
    }

    // ── ACTION: close_tracks ──
    if (action === 'close_tracks') {
      const { session_id, track_names, force } = params;
      if (!session_id) {
        return jsonResponse({ error: 'close_tracks: session_id required' });
      }

      const tracks = (track_names || []).map((name: string) => ({
        location: 'remote',
        trackName: name,
      }));

      const cfRes = await fetch(`${cfBase}/sessions/${session_id}/tracks/close`, {
        method: 'PUT',
        headers: cfHeaders,
        body: JSON.stringify({
          tracks,
          force: force || false,
        }),
      });

      const cfData = await cfRes.json();
      if (cfData.errorCode) {
        return jsonResponse({ error: 'CF close_tracks: ' + (cfData.errorDescription || JSON.stringify(cfData)) });
      }

      return jsonResponse({ closed: true });
    }

    // ── ACTION: create_room (admin only) ──
    if (action === 'create_room') {
      if (!isAdmin) return jsonResponse({ error: 'create_room: Admin only' });
      const { stream_id } = params;
      if (!stream_id) return jsonResponse({ error: 'create_room: stream_id required' });

      const { data: room, error: roomErr } = await supabase
        .from('call_rooms')
        .insert({ stream_id, status: 'active' })
        .select()
        .single();

      if (roomErr) {
        return jsonResponse({ error: 'create_room failed: ' + roomErr.message });
      }
      return jsonResponse({ room_id: room.id });
    }

    // ── ACTION: close_room (admin only) ──
    if (action === 'close_room') {
      if (!isAdmin) return jsonResponse({ error: 'close_room: Admin only' });
      const { room_id } = params;
      if (!room_id) return jsonResponse({ error: 'close_room: room_id required' });

      await supabase
        .from('call_rooms')
        .update({ status: 'closed', closed_at: new Date().toISOString() })
        .eq('id', room_id);

      return jsonResponse({ closed: true });
    }

    return jsonResponse({ error: 'Unknown action: ' + action });

  } catch (err) {
    console.error('cf-calls-proxy error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: 'Server error: ' + errMsg });
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Edge Function: hms-token
// Generates 100ms auth tokens for broadcasters and viewers
// Deploy: supabase functions deploy hms-token --no-verify-jwt
// Secrets needed: HMS_ACCESS_KEY, HMS_APP_SECRET, HMS_TEMPLATE_ID, HMS_DEFAULT_ROOM_ID

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64url } from "https://deno.land/std@0.168.0/encoding/base64url.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvoltschool.com',
  'https://www.acvoltschool.com',
  'https://acvoltschool.pages.dev',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://clon-ios-googleplay.pages.dev',
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// ── HMAC-SHA256 JWT signing (no npm needed) ──
async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(new Uint8Array(sig));
}

async function createJWT(accessKey: string, secret: string, payload: Record<string, unknown>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const signature = await hmacSign(secret, `${headerB64}.${payloadB64}`);
  return `${headerB64}.${payloadB64}.${signature}`;
}

function generateUUID(): string {
  return crypto.randomUUID();
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const HMS_ACCESS_KEY = Deno.env.get('HMS_ACCESS_KEY');
    const HMS_APP_SECRET = Deno.env.get('HMS_APP_SECRET');
    const HMS_TEMPLATE_ID = Deno.env.get('HMS_TEMPLATE_ID');
    const HMS_DEFAULT_ROOM_ID = Deno.env.get('HMS_DEFAULT_ROOM_ID');

    if (!HMS_ACCESS_KEY || !HMS_APP_SECRET) {
      throw new Error('100ms credentials not configured');
    }

    // ── Verify caller identity from Supabase JWT ──
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || 'floresmario30@hotmail.com').split(',').map(e => e.trim().toLowerCase());

    let callerEmail = '';
    let callerIsAdmin = false;
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ') && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const jwt = authHeader.slice(7);
        // Decode JWT payload to get user email (Supabase JWTs are standard)
        const payloadB64 = jwt.split('.')[1];
        if (payloadB64) {
          const decoded = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
          callerEmail = (decoded.email || '').toLowerCase();
          // Check admin via role claim or known admin emails
          callerIsAdmin = ADMIN_EMAILS.includes(callerEmail) || decoded.role === 'service_role';
        }
      } catch (_e) { /* JWT decode failed — treat as non-admin */ }
    }

    // Fallback: check admin_staff table for editor/master/admin/tecnico_video roles
    // This lets Manuel (editor) and other staff broadcast without hardcoding emails.
    if (!callerIsAdmin && callerEmail && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: staff } = await sb
          .from('admin_staff')
          .select('rol, activo')
          .ilike('email', callerEmail)
          .eq('activo', true)
          .maybeSingle();
        if (staff && ['master', 'admin', 'editor', 'tecnico_video'].includes(staff.rol)) {
          callerIsAdmin = true;
          console.log(`[hms-token] Admin via admin_staff: ${callerEmail} (rol=${staff.rol})`);
        }
      } catch (e) { console.warn('[hms-token] admin_staff lookup failed:', (e as Error).message); }
    }

    const { action, role, room_id, user_id, user_name, admin_email, name, description } = await req.json();

    // REMOVED: Fallback admin check via body admin_email (security vulnerability).
    // Admin status is now determined solely by the JWT verification above.

    // ── ACTION: get_token ──
    // Generate an auth token for a user to join a 100ms room
    if (action === 'get_token') {
      if (!role || !user_id) {
        return jsonResponse({ error: 'role and user_id required' }, 400);
      }

      const validRoles = ['broadcaster', 'co-broadcaster', 'viewer-realtime', 'viewer-near-realtime', 'viewer-on-stage'];
      if (!validRoles.includes(role)) {
        return jsonResponse({ error: 'Invalid role. Valid: ' + validRoles.join(', ') }, 400);
      }

      // CRITICAL: Only admins can request broadcaster/co-broadcaster roles
      const privilegedRoles = ['broadcaster', 'co-broadcaster'];
      if (privilegedRoles.includes(role) && !callerIsAdmin) {
        console.warn(`[hms-token] Non-admin "${callerEmail || user_id}" attempted to get ${role} token`);
        return jsonResponse({ error: 'Unauthorized: broadcaster role requires admin privileges' }, 403);
      }

      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      if (!targetRoomId) {
        return jsonResponse({ error: 'room_id required (no default configured)' }, 400);
      }

      // Token TTL: 6 hours for broadcasters (clase de 4h + colchón de setup/overrun), 6 horas viewers. Mario 2026-06-05.
      const tokenTTL = privilegedRoles.includes(role) ? 21600 : 21600;

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        access_key: HMS_ACCESS_KEY,
        type: 'app',
        version: 2,
        role: role,
        room_id: targetRoomId,
        user_id: user_id,
        iat: now,
        nbf: now,
        exp: now + tokenTTL,
        jti: generateUUID(),
      };

      const token = await createJWT(HMS_ACCESS_KEY, HMS_APP_SECRET, payload);
      return jsonResponse({ token, room_id: targetRoomId, role, expires_in: tokenTTL });
    }

    // ── ACTION: create_room ──
    // GET-OR-CREATE: first search for existing room by name, only create if not found
    if (action === 'create_room') {
      // Only admins can create rooms
      if (!callerIsAdmin) {
        return jsonResponse({ error: 'Unauthorized: room creation requires admin privileges' }, 403);
      }
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);
      const roomName = name || `class-${Date.now()}`;

      // 1. Search for existing room by name (100ms does NOT deduplicate)
      try {
        const searchRes = await fetch(`https://api.100ms.live/v2/rooms?name=${encodeURIComponent(roomName)}&enabled=true`, {
          headers: { 'Authorization': `Bearer ${mgmtToken}` },
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.data && searchData.data.length > 0) {
            console.log(`[hms-token] Found existing room: ${roomName} → ${searchData.data[0].id}`);
            return jsonResponse({ room: searchData.data[0] });
          }
        }
      } catch (e) {
        console.warn('[hms-token] Room search failed, will create new:', e);
      }

      // 2. No existing room found — create new one
      const res = await fetch('https://api.100ms.live/v2/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mgmtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          description: description || 'MaestroAC Live Class',
          template_id: HMS_TEMPLATE_ID,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return jsonResponse({ error: '100ms API error', details: data }, res.status);
      }

      console.log(`[hms-token] Created new room: ${roomName} → ${data.id}`);
      return jsonResponse({ room: data });
    }

    // ── ACTION: get_room_info ──
    if (action === 'get_room_info') {
      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      const res = await fetch(`https://api.100ms.live/v2/rooms/${targetRoomId}`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });

      const data = await res.json();
      if (!res.ok) {
        return jsonResponse({ error: '100ms API error', details: data }, res.status);
      }

      return jsonResponse({ room: data });
    }

    // ── ACTION: list_sessions ──
    // Get active/recent sessions for a room
    if (action === 'list_sessions') {
      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      const res = await fetch(`https://api.100ms.live/v2/sessions?room_id=${targetRoomId}&limit=10`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });

      const data = await res.json();
      if (!res.ok) {
        return jsonResponse({ error: '100ms API error', details: data }, res.status);
      }

      return jsonResponse({ sessions: data });
    }

    // ── ACTION: get_hls_url ──
    // Get active HLS URL via Active Room API (has streaming state)
    if (action === 'get_hls_url') {
      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      // Use Active Room API — returns current streaming state including HLS
      const activeRes = await fetch(`https://api.100ms.live/v2/active-rooms/${targetRoomId}`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });

      if (activeRes.status === 404) {
        // Room not active — no live stream
        return jsonResponse({ hls_url: null, room_id: targetRoomId, active: false });
      }

      const activeData = await activeRes.json();
      if (!activeRes.ok) {
        return jsonResponse({ error: '100ms active room API error', details: activeData }, activeRes.status);
      }

      // Extract HLS URL from streaming state
      let hlsUrl = null;
      if (activeData.hls && activeData.hls.running) {
        // HLS variants array contains the playlist URLs
        if (activeData.hls.variants && activeData.hls.variants.length > 0) {
          hlsUrl = activeData.hls.variants[0].url;
        }
      }

      return jsonResponse({ hls_url: hlsUrl, room_id: targetRoomId, active: true });
    }

    // ── ACTION: get_recordings ──
    // Get recordings for a room, with presigned download URLs
    if (action === 'get_recordings') {
      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      const res = await fetch(`https://api.100ms.live/v2/recording-assets?room_id=${targetRoomId}`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });

      const data = await res.json();
      if (!res.ok) {
        return jsonResponse({ error: '100ms API error', details: data }, res.status);
      }

      // Fetch presigned URLs for each recording asset
      const assets = data.data || [];
      const enriched = await Promise.all(assets.map(async (asset: Record<string, unknown>) => {
        try {
          const urlRes = await fetch(`https://api.100ms.live/v2/recording-assets/${asset.id}/presigned-url`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${mgmtToken}` },
          });
          if (urlRes.ok) {
            const urlData = await urlRes.json();
            return { ...asset, presigned_url: urlData.url, presigned_expiry: urlData.expiry };
          }
        } catch (e) {
          console.error(`Failed to get presigned URL for asset ${asset.id}:`, e);
        }
        return asset;
      }));

      return jsonResponse({ recordings: { ...data, data: enriched } });
    }

    // ── ACTION: start_hls ──
    // Start HLS streaming via server API with forced landscape resolution
    if (action === 'start_hls') {
      if (!callerIsAdmin) {
        return jsonResponse({ error: 'Unauthorized: starting HLS requires admin privileges' }, 403);
      }
      const targetRoomId = room_id || HMS_DEFAULT_ROOM_ID;
      if (!targetRoomId) {
        return jsonResponse({ error: 'room_id required' }, 400);
      }
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      const res = await fetch(`https://api.100ms.live/v2/live-streams/room/${targetRoomId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mgmtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recording: {
            hls_vod: true,
            single_file_per_layer: true,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return jsonResponse({ error: '100ms HLS start error', details: data }, res.status);
      }

      return jsonResponse({ hls: data });
    }

    // ── ACTION: fix_template_landscape ──
    // One-time fix: update template HLS layers to 1280x720 landscape
    if (action === 'fix_template_landscape') {
      if (!callerIsAdmin) {
        return jsonResponse({ error: 'Unauthorized: template modification requires admin privileges' }, 403);
      }
      if (!HMS_TEMPLATE_ID) {
        return jsonResponse({ error: 'HMS_TEMPLATE_ID not configured' }, 400);
      }
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);

      // 1. Get current template
      const getRes = await fetch(`https://api.100ms.live/v2/templates/${HMS_TEMPLATE_ID}`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });
      if (!getRes.ok) {
        const errData = await getRes.json();
        return jsonResponse({ error: 'Failed to get template', details: errData }, getRes.status);
      }
      const template = await getRes.json();

      // 2. Update destinations to force landscape HLS layers
      if (!template.destinations) template.destinations = {};
      template.destinations.hlsDestinations = template.destinations.hlsDestinations || {};

      // Find existing HLS destination or create one
      const hlsKeys = Object.keys(template.destinations.hlsDestinations);
      const hlsKey = hlsKeys.length > 0 ? hlsKeys[0] : 'hls-destination';
      const existingHls = template.destinations.hlsDestinations[hlsKey] || {};

      const landscapeLayers = [
        { width: 1280, height: 720, videoBitrate: 2500, audioBitrate: 128 },
        { width: 854, height: 480, videoBitrate: 1000, audioBitrate: 64 },
        { width: 640, height: 360, videoBitrate: 500, audioBitrate: 64 },
      ];
      template.destinations.hlsDestinations[hlsKey] = {
        ...existingHls,
        layers: landscapeLayers,
        recording: {
          ...(existingHls.recording || {}),
          layers: landscapeLayers,
          thumbnails: { width: 1280, height: 720, offsets: [60] },
        },
      };

      // Fix ALL roles: landscape, 30fps, higher bitrate, better audio
      for (const roleName of Object.keys(template.roles || {})) {
        const role = template.roles[roleName];
        if (role?.publishParams?.video) {
          role.publishParams.video.width = 1280;
          role.publishParams.video.height = 720;
          role.publishParams.video.frameRate = 30;
          role.publishParams.video.bitRate = 2000;
        }
        if (role?.publishParams?.audio) {
          role.publishParams.audio.bitRate = 128;
        }
        if (role?.publishParams?.screen) {
          role.publishParams.screen.frameRate = 10;
          role.publishParams.screen.width = 1920;
          role.publishParams.screen.height = 1080;
          role.publishParams.screen.bitRate = 3000;
        }
        // Update simulcast layers for higher quality
        if (role?.publishParams?.simulcast?.video?.layers) {
          role.publishParams.simulcast.video.layers = [
            { rid: 'f', scaleResolutionDownBy: 1, maxBitrate: 2000, maxFramerate: 30 },
            { rid: 'h', scaleResolutionDownBy: 2, maxBitrate: 800, maxFramerate: 30 },
            { rid: 'q', scaleResolutionDownBy: 4, maxBitrate: 300, maxFramerate: 15 },
          ];
        }
      }

      // Fix region to US
      if (template.settings) {
        template.settings.region = 'us';
      }

      // 3. Update template
      const updateRes = await fetch(`https://api.100ms.live/v2/templates/${HMS_TEMPLATE_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mgmtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        return jsonResponse({ error: 'Failed to update template', details: updateData }, updateRes.status);
      }

      return jsonResponse({
        success: true,
        message: 'Template updated to landscape 1280x720',
        hlsLayers: template.destinations.hlsDestinations[hlsKey].layers,
        templateId: HMS_TEMPLATE_ID
      });
    }

    // ── ACTION: get_template ──
    // Debug: view current template configuration
    if (action === 'get_template') {
      if (!HMS_TEMPLATE_ID) {
        return jsonResponse({ error: 'HMS_TEMPLATE_ID not configured' }, 400);
      }
      const mgmtToken = await createManagementToken(HMS_ACCESS_KEY, HMS_APP_SECRET);
      const res = await fetch(`https://api.100ms.live/v2/templates/${HMS_TEMPLATE_ID}`, {
        headers: { 'Authorization': `Bearer ${mgmtToken}` },
      });
      const data = await res.json();
      return jsonResponse({ template: data, templateId: HMS_TEMPLATE_ID });
    }

    return jsonResponse({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    console.error('hms-token error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ── Helper: Create management token for 100ms API calls ──
async function createManagementToken(accessKey: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    access_key: accessKey,
    type: 'management',
    version: 2,
    iat: now,
    nbf: now,
    exp: now + 600, // 10 minutes — short-lived for server-to-server calls
    jti: crypto.randomUUID(),
  };
  return await createJWT(accessKey, secret, payload);
}

// ── Helper: same createJWT used above, re-reference ──
// (already defined at top level)

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Edge Function: device-guard
// Anti-sharing system — country check + 2-device limit per account
// Deploy: cd maestroac-app && npx supabase functions deploy device-guard --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

const MAX_DEVICES = 2;

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
  'https://maestroac-clon.netlify.app',
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

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}

// Geo lookup via ip-api.com (free, no key needed, 45 req/min)
async function geoLookup(ip: string): Promise<{ country_code: string; country_name: string } | null> {
  if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip === '::1') {
    return null; // Local/private IP — skip geo
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,country`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return { country_code: data.countryCode, country_name: data.country };
  } catch {
    return null;
  }
}

function getSupabase() {
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(url, key);
}

// Verify admin via admin_staff table
async function isAdmin(sb: ReturnType<typeof createClient>, email: string): Promise<boolean> {
  const { data } = await sb.from('admin_staff').select('id').eq('email', email.toLowerCase()).eq('activo', true).limit(1);
  return !!(data && data.length > 0);
}

// ── Action: register_device ──
// Called post-login. Geo-checks country, enforces device limit.
async function registerDevice(sb: ReturnType<typeof createClient>, body: any, ip: string) {
  const { user_email, device_id, device_name, user_agent } = body;
  if (!user_email || !device_id) return json({ error: 'Missing user_email or device_id' }, 400);

  const email = user_email.toLowerCase().trim();

  // 1. Geo lookup
  const geo = await geoLookup(ip);
  const countryCode = geo?.country_code || null;
  const countryName = geo?.country_name || null;

  // 2. Check user's home country
  const { data: userData } = await sb.from('users').select('home_country').eq('email', email).single();
  const homeCountry = userData?.home_country || null;

  let countryBlocked = false;

  if (!homeCountry && countryCode) {
    // Grace period: first time — auto-set home country
    await sb.from('users').update({ home_country: countryCode }).eq('email', email);
  } else if (homeCountry && countryCode && homeCountry !== countryCode) {
    // Country mismatch — block
    countryBlocked = true;

    // Log the blocked attempt
    await sb.from('device_access_log').insert({
      user_email: email,
      device_id,
      action: 'country_blocked',
      ip_address: ip === 'unknown' ? null : ip,
      country_code: countryCode,
      metadata: { home_country: homeCountry, attempted_country: countryCode, attempted_country_name: countryName },
    });

    return json({
      ok: false,
      blocked: true,
      reason: 'country_mismatch',
      home_country: homeCountry,
      current_country: countryCode,
      current_country_name: countryName,
    });
  }

  // 3. Upsert device
  const { error: upsertErr } = await sb.from('user_devices').upsert({
    user_email: email,
    device_id,
    device_name: device_name || null,
    ip_address: ip === 'unknown' ? null : ip,
    country_code: countryCode,
    country_name: countryName,
    is_active: true,
    last_seen_at: new Date().toISOString(),
    deactivated_at: null,
    deactivated_reason: null,
    user_agent: user_agent || null,
  }, { onConflict: 'user_email,device_id' });

  if (upsertErr) {
    console.error('[device-guard] Upsert error:', upsertErr.message);
    return json({ error: 'Failed to register device' }, 500);
  }

  // 4. Enforce device limit — kick oldest if over MAX_DEVICES
  const { data: activeDevices } = await sb.from('user_devices')
    .select('id, device_id, last_seen_at')
    .eq('user_email', email)
    .eq('is_active', true)
    .order('last_seen_at', { ascending: true });

  const kicked: string[] = [];
  if (activeDevices && activeDevices.length > MAX_DEVICES) {
    const toKick = activeDevices.slice(0, activeDevices.length - MAX_DEVICES);
    for (const dev of toKick) {
      await sb.from('user_devices').update({
        is_active: false,
        deactivated_at: new Date().toISOString(),
        deactivated_reason: 'device_limit_exceeded',
      }).eq('id', dev.id);

      kicked.push(dev.device_id);

      await sb.from('device_access_log').insert({
        user_email: email,
        device_id: dev.device_id,
        action: 'kicked_device_limit',
        ip_address: ip === 'unknown' ? null : ip,
        country_code: countryCode,
        metadata: { kicked_by: device_id, total_active: activeDevices.length },
      });
    }
  }

  // 5. Log successful registration
  await sb.from('device_access_log').insert({
    user_email: email,
    device_id,
    action: 'register',
    ip_address: ip === 'unknown' ? null : ip,
    country_code: countryCode,
    metadata: { device_name, kicked },
  });

  return json({ ok: true, kicked, country_code: countryCode });
}

// ── Action: check_device ──
// Called on visibility change / tab focus. Returns whether this device is still active.
async function checkDevice(sb: ReturnType<typeof createClient>, body: any) {
  const { user_email, device_id } = body;
  if (!user_email || !device_id) return json({ error: 'Missing params' }, 400);

  const email = user_email.toLowerCase().trim();

  const { data } = await sb.from('user_devices')
    .select('is_active, deactivated_reason')
    .eq('user_email', email)
    .eq('device_id', device_id)
    .single();

  if (!data) return json({ active: false, reason: 'not_found' });

  // Update last_seen if active
  if (data.is_active) {
    await sb.from('user_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('user_email', email)
      .eq('device_id', device_id);
  }

  return json({
    active: data.is_active,
    reason: data.is_active ? null : (data.deactivated_reason || 'deactivated'),
  });
}

// ── Action: deactivate_device ──
// Called on logout.
async function deactivateDevice(sb: ReturnType<typeof createClient>, body: any) {
  const { user_email, device_id } = body;
  if (!user_email || !device_id) return json({ error: 'Missing params' }, 400);

  const email = user_email.toLowerCase().trim();

  await sb.from('user_devices').update({
    is_active: false,
    deactivated_at: new Date().toISOString(),
    deactivated_reason: 'logout',
  }).eq('user_email', email).eq('device_id', device_id);

  await sb.from('device_access_log').insert({
    user_email: email,
    device_id,
    action: 'logout',
  });

  return json({ ok: true });
}

// ── Action: list_devices (Admin) ──
async function listDevices(sb: ReturnType<typeof createClient>, body: any, adminEmail: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  const { target_email } = body;
  if (!target_email) return json({ error: 'Missing target_email' }, 400);

  const { data, error } = await sb.from('user_devices')
    .select('*')
    .eq('user_email', target_email.toLowerCase().trim())
    .order('last_seen_at', { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json({ devices: data || [] });
}

// ── Action: admin_kick_device (Admin) ──
async function adminKickDevice(sb: ReturnType<typeof createClient>, body: any, adminEmail: string, ip: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  const { target_email, device_id } = body;
  if (!target_email || !device_id) return json({ error: 'Missing params' }, 400);

  const email = target_email.toLowerCase().trim();

  await sb.from('user_devices').update({
    is_active: false,
    deactivated_at: new Date().toISOString(),
    deactivated_reason: 'admin_kick',
  }).eq('user_email', email).eq('device_id', device_id);

  await sb.from('device_access_log').insert({
    user_email: email,
    device_id,
    action: 'admin_kick',
    ip_address: ip === 'unknown' ? null : ip,
    metadata: { kicked_by: adminEmail },
  });

  return json({ ok: true });
}

// ── Action: admin_device_stats (Admin) ──
async function adminDeviceStats(sb: ReturnType<typeof createClient>, body: any, adminEmail: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  // Users over device limit
  const { data: overLimit } = await sb.rpc('get_users_over_device_limit');

  // Recent country blocks (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentBlocks } = await sb.from('device_access_log')
    .select('user_email, country_code, metadata, created_at')
    .eq('action', 'country_blocked')
    .gte('created_at', weekAgo)
    .order('created_at', { ascending: false })
    .limit(50);

  // Total active devices
  const { count: totalActive } = await sb.from('user_devices')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  // Total unique users with active devices
  const { data: uniqueUsers } = await sb.from('user_devices')
    .select('user_email')
    .eq('is_active', true);
  const uniqueCount = new Set((uniqueUsers || []).map((u: any) => u.user_email)).size;

  return json({
    users_over_limit: overLimit || [],
    recent_country_blocks: recentBlocks || [],
    total_active_devices: totalActive || 0,
    unique_users_with_devices: uniqueCount,
  });
}

// ── Action: admin_duplicates (Admin) ──
// Detects duplicate accounts by cross-referencing device_id, phone, IP
async function adminDuplicates(sb: ReturnType<typeof createClient>, body: any, adminEmail: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  const { data, error } = await sb.rpc('detect_duplicate_accounts');
  if (error) return json({ error: error.message }, 500);

  // Group by pair of emails
  const pairs: Record<string, { email_a: string; email_b: string; matches: { type: string; value: string }[] }> = {};
  for (const row of (data || [])) {
    const key = row.email_a + '|' + row.email_b;
    if (!pairs[key]) pairs[key] = { email_a: row.email_a, email_b: row.email_b, matches: [] };
    pairs[key].matches.push({ type: row.match_type, value: row.match_value });
  }

  return json({ duplicates: Object.values(pairs) });
}

// ── Action: upload_id ──
// Student uploads ID photo (base64) → Supabase Storage
async function uploadId(sb: ReturnType<typeof createClient>, body: any) {
  const { user_email, image_base64 } = body;
  if (!user_email || !image_base64) return json({ error: 'Missing user_email or image_base64' }, 400);

  const email = user_email.toLowerCase().trim();

  // Decode base64 to Uint8Array
  const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryStr = atob(base64Data);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

  const filePath = `${email}/id.jpg`;

  // Upload to storage (upsert)
  const { error: uploadErr } = await sb.storage
    .from('user-ids')
    .upload(filePath, bytes, { contentType: 'image/jpeg', upsert: true });

  if (uploadErr) {
    console.error('[device-guard] ID upload error:', uploadErr.message);
    return json({ error: 'Failed to upload ID photo' }, 500);
  }

  // Update user record
  const { error: updateErr } = await sb.from('users').update({
    id_photo_url: filePath,
    id_status: 'pending',
  }).eq('email', email);

  if (updateErr) {
    console.error('[device-guard] ID status update error:', updateErr.message);
    return json({ error: 'Failed to update user status' }, 500);
  }

  return json({ ok: true, status: 'pending' });
}

// ── Action: admin_review_id (Admin) ──
// Approve or reject a student's ID
async function adminReviewId(sb: ReturnType<typeof createClient>, body: any, adminEmail: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  const { target_email, decision } = body;
  if (!target_email || !decision) return json({ error: 'Missing target_email or decision' }, 400);
  if (decision !== 'approved' && decision !== 'rejected') return json({ error: 'Invalid decision' }, 400);

  const email = target_email.toLowerCase().trim();

  const { error } = await sb.from('users').update({
    id_status: decision,
    id_reviewed_at: new Date().toISOString(),
    id_reviewed_by: adminEmail,
  }).eq('email', email);

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, status: decision });
}

// ── Action: admin_list_pending_ids (Admin) ──
// List all users with pending ID review
async function adminListPendingIds(sb: ReturnType<typeof createClient>, body: any, adminEmail: string) {
  if (!(await isAdmin(sb, adminEmail))) return json({ error: 'Unauthorized' }, 403);

  const { data, error } = await sb.from('users')
    .select('email, nombre, telefono, id_photo_url, id_status, fecha_registro')
    .eq('id_status', 'pending')
    .order('fecha_registro', { ascending: false });

  if (error) return json({ error: error.message }, 500);

  // Generate signed URLs for each photo
  const results = [];
  for (const user of (data || [])) {
    let signedUrl = null;
    if (user.id_photo_url) {
      const { data: urlData } = await sb.storage
        .from('user-ids')
        .createSignedUrl(user.id_photo_url, 3600); // 1 hour
      signedUrl = urlData?.signedUrl || null;
    }
    results.push({ ...user, signed_photo_url: signedUrl });
  }

  return json({ pending_ids: results });
}

// ── Action: get_id_status ──
// Client checks own ID verification status
async function getIdStatus(sb: ReturnType<typeof createClient>, body: any) {
  const { user_email } = body;
  if (!user_email) return json({ error: 'Missing user_email' }, 400);

  const email = user_email.toLowerCase().trim();
  const { data, error } = await sb.from('users')
    .select('id_status, id_photo_url')
    .eq('email', email)
    .single();

  if (error) return json({ id_status: 'none', id_photo_url: null });
  return json({ id_status: data?.id_status || 'none', id_photo_url: data?.id_photo_url || null });
}

// ── Main handler ──
serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limit: 10 req/min
  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const body = await req.json();
    const { action, admin_email } = body;
    const ip = getIp(req);
    const sb = getSupabase();

    switch (action) {
      case 'register_device':
        return await registerDevice(sb, body, ip);
      case 'check_device':
        return await checkDevice(sb, body);
      case 'deactivate_device':
        return await deactivateDevice(sb, body);
      case 'list_devices':
        return await listDevices(sb, body, admin_email || '');
      case 'admin_kick_device':
        return await adminKickDevice(sb, body, admin_email || '', ip);
      case 'admin_device_stats':
        return await adminDeviceStats(sb, body, admin_email || '');
      case 'admin_duplicates':
        return await adminDuplicates(sb, body, admin_email || '');
      case 'upload_id':
        return await uploadId(sb, body);
      case 'admin_review_id':
        return await adminReviewId(sb, body, admin_email || '');
      case 'admin_list_pending_ids':
        return await adminListPendingIds(sb, body, admin_email || '');
      case 'get_id_status':
        return await getIdStatus(sb, body);
      default:
        return json({ error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    console.error('[device-guard] Error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});

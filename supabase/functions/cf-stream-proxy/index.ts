// Edge Function: cf-stream-proxy
// Deploy: supabase functions deploy cf-stream-proxy
// Secrets needed: CF_ACCOUNT_ID, CF_API_TOKEN, CF_CUSTOMER_SUBDOMAIN
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

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const CF_ACCOUNT_ID = Deno.env.get('CF_ACCOUNT_ID');
    const CF_API_TOKEN = Deno.env.get('CF_API_TOKEN');
    const CF_CUSTOMER_SUBDOMAIN = Deno.env.get('CF_CUSTOMER_SUBDOMAIN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      throw new Error('Cloudflare credentials not configured');
    }
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error('Supabase service role not configured');
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { action, admin_email, ...params } = await req.json();

    // ── Admin verification (all cf-stream-proxy actions are admin-only) ──
    if (!admin_email) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }
    const _emailLower = admin_email.toLowerCase().trim();
    const { data: admins } = await supabase.from('admin_students').select('id').eq('email', _emailLower).limit(1);
    if (!admins || admins.length === 0) {
      const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', _emailLower).limit(1);
      if (!staff || staff.length === 0) {
        console.warn('[cf-stream-proxy] Unauthorized access attempt by:', admin_email);
        return jsonResponse({ error: 'Unauthorized' }, 403);
      }
    }

    const cfBase = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream`;
    const cfHeaders = {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // ── Helper: get or create permanent live input ──
    async function getOrCreatePermanentInput() {
      // Check if permanent input already exists in DB
      const { data: existing } = await supabase
        .from('permanent_live_input')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // ALWAYS ensure recording is enabled on Cloudflare side
        // (input may have been created before recording config was added)
        try {
          await fetch(`${cfBase}/live_inputs/${existing.cf_input_id}`, {
            method: 'PUT',
            headers: cfHeaders,
            body: JSON.stringify({
              recording: { mode: 'automatic' },
            }),
          });
        } catch (_) { /* non-fatal: recording may already be enabled */ }
        return existing;
      }

      // Create new permanent live input on Cloudflare
      const cfRes = await fetch(`${cfBase}/live_inputs`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify({
          meta: { name: 'MaestroAC Permanent Input' },
          recording: { mode: 'automatic' },
        }),
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        throw new Error('Cloudflare API error: ' + JSON.stringify(cfData.errors));
      }

      const input = cfData.result;
      const playbackBase = CF_CUSTOMER_SUBDOMAIN
        ? `https://${CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${input.uid}/iframe`
        : null;

      const { data: saved, error: saveErr } = await supabase
        .from('permanent_live_input')
        .insert({
          cf_input_id: input.uid,
          rtmps_url: input.rtmps?.url || null,
          stream_key: input.rtmps?.streamKey || null,
          whip_url: input.webRTC?.url || null,
          playback_base_url: playbackBase,
        })
        .select()
        .single();

      if (saveErr) throw new Error('DB save error: ' + saveErr.message);
      return saved;
    }

    // ── ACTION: init_permanent_input ──
    // One-time setup: creates permanent Cloudflare input + connects multistream outputs
    if (action === 'init_permanent_input') {
      const perm = await getOrCreatePermanentInput();

      // Connect all enabled multistream destinations to the permanent input
      const { data: destinations } = await supabase
        .from('multistream_destinations')
        .select('*')
        .eq('enabled', true);

      const attachedOutputs: string[] = [];
      if (destinations && destinations.length > 0) {
        // Get existing outputs to avoid duplicates
        const existingRes = await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}/outputs`, {
          headers: cfHeaders,
        });
        const existingData = await existingRes.json();
        const existingUrls = new Set(
          (existingData.result || []).map((o: { url: string; streamKey: string }) => o.url + '|' + o.streamKey)
        );

        for (const dest of destinations) {
          const key = dest.rtmp_url + '|' + dest.stream_key;
          if (existingUrls.has(key)) {
            attachedOutputs.push(dest.platform_name + ' (ya conectado)');
            continue;
          }
          try {
            const outRes = await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}/outputs`, {
              method: 'POST',
              headers: cfHeaders,
              body: JSON.stringify({ url: dest.rtmp_url, streamKey: dest.stream_key }),
            });
            const outData = await outRes.json();
            if (outData.success) {
              attachedOutputs.push(dest.platform_name);
            }
          } catch (_) { /* skip failed outputs */ }
        }
      }

      return jsonResponse({
        permanent_input: {
          cf_input_id: perm.cf_input_id,
          rtmps_url: perm.rtmps_url,
          stream_key: perm.stream_key,
          whip_url: perm.whip_url,
          playback_base_url: perm.playback_base_url,
        },
        multistream: {
          attached: attachedOutputs,
          count: attachedOutputs.length,
        },
      });
    }

    // ── ACTION: create_input ──
    // Now reuses the permanent input — only creates a live_streams row as metadata
    if (action === 'create_input') {
      const { title, description, instructor_email, instructor_name, scheduled_at, class_group } = params;

      if (!title || !instructor_email) {
        return jsonResponse({ error: 'title and instructor_email required' }, 400);
      }

      // Get or create permanent input (auto-setup on first use)
      const perm = await getOrCreatePermanentInput();

      // Save stream metadata to Supabase using permanent input credentials
      const { data, error } = await supabase.from('live_streams').insert({
        cf_input_id: perm.cf_input_id,
        title,
        description: description || null,
        instructor_email,
        instructor_name: instructor_name || null,
        status: 'scheduled',
        scheduled_at: scheduled_at || null,
        rtmps_url: perm.rtmps_url,
        stream_key: perm.stream_key,
        whip_url: perm.whip_url,
        playback_url: perm.playback_base_url,
        class_group: class_group || 'todos',
      }).select().single();

      if (error) {
        return jsonResponse({ error: 'DB insert error', details: error.message }, 500);
      }

      return jsonResponse({
        stream: data,
        cf_input: {
          uid: perm.cf_input_id,
          rtmps_url: perm.rtmps_url,
          stream_key: perm.stream_key,
          whip_url: perm.whip_url,
        },
      });
    }

    // ── ACTION: sync_permanent_outputs ──
    // Syncs multistream destinations to the permanent input
    if (action === 'sync_permanent_outputs') {
      const { data: perm } = await supabase
        .from('permanent_live_input')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!perm) {
        return jsonResponse({ error: 'No permanent input configured. Run init_permanent_input first.' }, 400);
      }

      // Get current Cloudflare outputs
      const cfRes = await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}/outputs`, {
        headers: cfHeaders,
      });
      const cfData = await cfRes.json();
      const currentOutputs = cfData.result || [];

      // Get enabled destinations from DB
      const { data: destinations } = await supabase
        .from('multistream_destinations')
        .select('*')
        .eq('enabled', true);

      const added: string[] = [];
      const removed: string[] = [];

      // Build set of desired destination keys
      const desiredKeys = new Set(
        (destinations || []).map((d: { rtmp_url: string; stream_key: string }) => d.rtmp_url + '|' + d.stream_key)
      );

      // Build set of current output keys
      const currentKeys = new Map<string, string>();
      for (const o of currentOutputs) {
        currentKeys.set(o.url + '|' + o.streamKey, o.uid);
      }

      // Remove outputs that are no longer in destinations
      for (const [key, uid] of currentKeys) {
        if (!desiredKeys.has(key)) {
          try {
            await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}/outputs/${uid}`, {
              method: 'DELETE',
              headers: cfHeaders,
            });
            removed.push(uid);
          } catch (_) { /* skip */ }
        }
      }

      // Add missing outputs
      for (const dest of (destinations || [])) {
        const key = dest.rtmp_url + '|' + dest.stream_key;
        if (!currentKeys.has(key)) {
          try {
            const outRes = await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}/outputs`, {
              method: 'POST',
              headers: cfHeaders,
              body: JSON.stringify({ url: dest.rtmp_url, streamKey: dest.stream_key }),
            });
            const outData = await outRes.json();
            if (outData.success) {
              added.push(dest.platform_name);
            }
          } catch (_) { /* skip */ }
        }
      }

      return jsonResponse({ added, removed, total_active: (destinations || []).length });
    }

    // ── ACTION: update_status ──
    if (action === 'update_status') {
      const { stream_id, new_status, playback_url } = params;
      if (!stream_id || !new_status) {
        return jsonResponse({ error: 'stream_id and new_status required' }, 400);
      }

      const updateData: Record<string, unknown> = { status: new_status };
      if (new_status === 'live') updateData.started_at = new Date().toISOString();
      if (new_status === 'ended') updateData.ended_at = new Date().toISOString();
      if (playback_url) updateData.playback_url = playback_url;

      const { data, error } = await supabase
        .from('live_streams')
        .update(updateData)
        .eq('id', stream_id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: 'DB update error', details: error.message }, 500);
      }

      return jsonResponse({ stream: data });
    }

    // ── ACTION: update_playback_url ──
    // Bridge fix: 100ms-HLS broadcasts couldn't write playback_url from the
    // browser because RLS blocked the anon-key UPDATE. Now the client routes
    // through this admin-authenticated edge action which uses service_role.
    if (action === 'update_playback_url') {
      const { stream_id, playback_url } = params;
      if (!stream_id || !playback_url) {
        return jsonResponse({ error: 'stream_id and playback_url required' }, 400);
      }
      const { data, error } = await supabase
        .from('live_streams')
        .update({ playback_url })
        .eq('id', stream_id)
        .select()
        .single();
      if (error) {
        return jsonResponse({ error: 'DB update error', details: error.message }, 500);
      }
      return jsonResponse({ stream: data });
    }

    // ── ACTION: get_status ──
    if (action === 'get_status') {
      const { cf_input_id } = params;
      if (!cf_input_id) {
        return jsonResponse({ error: 'cf_input_id required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}`, {
        headers: cfHeaders,
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      return jsonResponse({ input: cfData.result });
    }

    // ── ACTION: sync_recordings ──
    if (action === 'sync_recordings') {
      const { stream_id, cf_input_id, force } = params;
      if (!stream_id || !cf_input_id) {
        return jsonResponse({ error: 'stream_id and cf_input_id required' }, 400);
      }

      // Fetch stream's started_at / ended_at to filter CF videos by time window
      const { data: streamRow } = await supabase
        .from('live_streams')
        .select('started_at, ended_at')
        .eq('id', stream_id)
        .single();

      // Use wide window (24h each side) for auto-sync; skip filter entirely if force=true
      const useTimeFilter = !force && streamRow?.started_at;
      const windowStart = useTimeFilter
        ? new Date(new Date(streamRow.started_at).getTime() - 24 * 60 * 60 * 1000).toISOString()
        : null;
      const windowEnd = useTimeFilter && streamRow?.ended_at
        ? new Date(new Date(streamRow.ended_at).getTime() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Get videos associated with this live input
      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}/videos`, {
        headers: cfHeaders,
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      const videos = cfData.result || [];
      let synced = 0;
      let updated = 0;
      let skipped = 0;

      for (const video of videos) {
        if (video.status?.state !== 'ready') continue;

        // Filter by time window only if not forced (manual sync skips this)
        if (windowStart && video.created) {
          const created = new Date(video.created).toISOString();
          if (created < windowStart) { skipped++; continue; }
          if (windowEnd && created > windowEnd) { skipped++; continue; }
        }

        // Check if already synced
        const { data: existing } = await supabase
          .from('stream_recordings')
          .select('id, status')
          .eq('cf_video_uid', video.uid)
          .maybeSingle();

        if (existing) {
          // Update "processing" entries that are now ready on CF
          if (existing.status === 'processing') {
            const updates: Record<string, unknown> = { status: 'ready' };
            if (video.duration) updates.duration_seconds = video.duration;
            await supabase.from('stream_recordings').update(updates).eq('id', existing.id);
            updated++;
          }
          continue;
        }

        const playbackUrl = CF_CUSTOMER_SUBDOMAIN
          ? `https://${CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${video.uid}/iframe`
          : null;

        await supabase.from('stream_recordings').insert({
          stream_id,
          cf_video_uid: video.uid,
          duration_seconds: video.duration || null,
          playback_url: playbackUrl,
          status: 'ready',
          visible: false,
          cf_created_at: video.created || null,
        });

        synced++;
      }

      return jsonResponse({ synced, updated, skipped, total_videos: videos.length });
    }

    // ── ACTION: delete_stream ──
    if (action === 'delete_stream') {
      const { stream_id } = params;
      if (!stream_id) {
        return jsonResponse({ error: 'stream_id required' }, 400);
      }

      // Delete associated recordings first
      const { error: recErr } = await supabase.from('stream_recordings').delete().eq('stream_id', stream_id);
      if (recErr) {
        return jsonResponse({ error: 'Error deleting recordings', details: recErr.message }, 500);
      }
      // Delete the stream
      const { error } = await supabase.from('live_streams').delete().eq('id', stream_id);
      if (error) {
        return jsonResponse({ error: 'DB delete error', details: error.message }, 500);
      }

      return jsonResponse({ deleted: true });
    }

    // ── ACTION: delete_recording ──
    if (action === 'delete_recording') {
      const { recording_id, cf_video_uid, delete_from_cf } = params;
      if (!recording_id) {
        return jsonResponse({ error: 'recording_id required' }, 400);
      }

      // Optionally delete from Cloudflare
      if (delete_from_cf && cf_video_uid) {
        try {
          await fetch(`${cfBase}/${cf_video_uid}`, {
            method: 'DELETE',
            headers: cfHeaders,
          });
        } catch (_) { /* continue even if CF delete fails */ }
      }

      const { error } = await supabase
        .from('stream_recordings')
        .delete()
        .eq('id', recording_id);

      if (error) {
        return jsonResponse({ error: 'DB delete error', details: error.message }, 500);
      }

      return jsonResponse({ deleted: true });
    }

    // ── ACTION: get_download_url ──
    if (action === 'get_download_url') {
      const { recording_id, cf_video_uid } = params;
      if (!cf_video_uid) {
        return jsonResponse({ error: 'cf_video_uid required' }, 400);
      }

      // Check if we already have a cached download URL
      if (recording_id) {
        const { data: rec } = await supabase
          .from('stream_recordings')
          .select('download_url')
          .eq('id', recording_id)
          .single();
        if (rec?.download_url) {
          return jsonResponse({ download_url: rec.download_url });
        }
      }

      // Enable downloads on CF
      await fetch(`${cfBase}/${cf_video_uid}/downloads`, {
        method: 'POST',
        headers: cfHeaders,
      });

      // Get the download URL
      const dlRes = await fetch(`${cfBase}/${cf_video_uid}/downloads`, {
        headers: cfHeaders,
      });
      const dlData = await dlRes.json();

      if (!dlData.success || !dlData.result?.default?.url) {
        return jsonResponse({ error: 'Could not get download URL', details: dlData.errors }, 500);
      }

      const downloadUrl = dlData.result.default.url;

      // Cache in DB
      if (recording_id) {
        await supabase
          .from('stream_recordings')
          .update({ download_url: downloadUrl })
          .eq('id', recording_id);
      }

      return jsonResponse({ download_url: downloadUrl });
    }

    // ── ACTION: update_recording ──
    if (action === 'update_recording') {
      const { recording_id, updates } = params;
      if (!recording_id || !updates) {
        return jsonResponse({ error: 'recording_id and updates required' }, 400);
      }

      // Whitelist allowed fields
      const allowed = ['visible', 'is_free', 'transcript', 'quiz_questions'];
      const safeUpdates: Record<string, unknown> = {};
      for (const key of allowed) {
        if (key in updates) safeUpdates[key] = updates[key];
      }

      if (Object.keys(safeUpdates).length === 0) {
        return jsonResponse({ error: 'No valid fields to update' }, 400);
      }

      const { data, error } = await supabase
        .from('stream_recordings')
        .update(safeUpdates)
        .eq('id', recording_id)
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: 'DB update error', details: error.message }, 500);
      }

      return jsonResponse({ recording: data });
    }

    // ── ACTION: add_output (simulcast to social media) ──
    if (action === 'add_output') {
      const { cf_input_id, url, stream_key } = params;
      if (!cf_input_id || !url || !stream_key) {
        return jsonResponse({ error: 'cf_input_id, url, and stream_key required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}/outputs`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify({ url, streamKey: stream_key }),
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      return jsonResponse({ output: cfData.result });
    }

    // ── ACTION: remove_output ──
    if (action === 'remove_output') {
      const { cf_input_id, output_id } = params;
      if (!cf_input_id || !output_id) {
        return jsonResponse({ error: 'cf_input_id and output_id required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}/outputs/${output_id}`, {
        method: 'DELETE',
        headers: cfHeaders,
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      return jsonResponse({ deleted: true });
    }

    // ── ACTION: list_outputs ──
    if (action === 'list_outputs') {
      const { cf_input_id } = params;
      if (!cf_input_id) {
        return jsonResponse({ error: 'cf_input_id required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}/outputs`, {
        headers: cfHeaders,
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      return jsonResponse({ outputs: cfData.result || [] });
    }

    // ── ACTION: copy_from_url ──
    // Tell Cloudflare to pull a video from a URL (no CORS issues)
    if (action === 'copy_from_url') {
      const { url: videoUrl, stream_id, filename } = params;
      if (!videoUrl) {
        return jsonResponse({ error: 'url required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/copy`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify({
          url: videoUrl,
          meta: { name: filename || 'upload' },
        }),
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare copy error', details: cfData.errors }, 500);
      }

      const video = cfData.result;
      const videoUid = video.uid;

      const playbackUrl = CF_CUSTOMER_SUBDOMAIN
        ? `https://${CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${videoUid}/iframe`
        : null;

      // Register in DB if stream_id provided
      if (stream_id && videoUid) {
        const { data: rec, error: recErr } = await supabase
          .from('stream_recordings')
          .insert({
            stream_id,
            cf_video_uid: videoUid,
            duration_seconds: null,
            playback_url: playbackUrl,
            status: 'processing',
            visible: false,
            cf_created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (recErr) {
          return jsonResponse({ error: 'CF copy started but DB insert failed', video_uid: videoUid, details: recErr.message }, 500);
        }

        return jsonResponse({ video_uid: videoUid, recording: rec });
      }

      return jsonResponse({ video_uid: videoUid, playback_url: playbackUrl });
    }

    // ── ACTION: create_direct_upload ──
    // Creates a direct upload URL for browser-based file upload (CORS-friendly)
    if (action === 'create_direct_upload') {
      const { filename } = params;

      const cfRes = await fetch(`${cfBase}/direct_upload`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify({
          maxDurationSeconds: 21600, // up to 6 hours
          meta: { name: filename || 'upload' },
        }),
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'CF direct upload init failed', details: cfData.errors }, 500);
      }

      return jsonResponse({
        upload_url: cfData.result.uploadURL,
        video_uid: cfData.result.uid,
        filename,
      });
    }

    // ── ACTION: create_tus_upload ──
    // Creates a TUS upload URL for uploading a video to Cloudflare Stream
    if (action === 'create_tus_upload') {
      const { filename, filesize } = params;
      if (!filename || !filesize) {
        return jsonResponse({ error: 'filename and filesize required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}?direct_user=true`, {
        method: 'POST',
        headers: {
          ...cfHeaders,
          'Tus-Resumable': '1.0.0',
          'Upload-Length': String(filesize),
          'Upload-Metadata': `name ${btoa(JSON.stringify({name: filename}))},requiresignedurls ${btoa('false')}`,
        },
      });

      if (cfRes.status !== 201) {
        const errBody = await cfRes.text();
        return jsonResponse({ error: 'CF TUS init failed', status: cfRes.status, details: errBody }, 500);
      }

      const tusUrl = cfRes.headers.get('location') || cfRes.headers.get('Location');
      const streamMediaId = cfRes.headers.get('stream-media-id') || '';

      return jsonResponse({
        tus_url: tusUrl,
        stream_media_id: streamMediaId,
        filename,
        filesize,
      });
    }

    // ── ACTION: batch_tus_uploads ──
    // Creates TUS upload URLs for multiple files at once
    if (action === 'batch_tus_uploads') {
      const { files } = params;
      if (!files || !Array.isArray(files)) {
        return jsonResponse({ error: 'files array required: [{filename, filesize}]' }, 400);
      }

      const results: unknown[] = [];
      for (const file of files) {
        try {
          const cfRes = await fetch(`${cfBase}?direct_user=true`, {
            method: 'POST',
            headers: {
              ...cfHeaders,
              'Tus-Resumable': '1.0.0',
              'Upload-Length': String(file.filesize),
              'Upload-Metadata': `name ${btoa(JSON.stringify({name: file.filename}))},requiresignedurls ${btoa('false')}`,
            },
          });

          if (cfRes.status === 201) {
            results.push({
              filename: file.filename,
              tus_url: cfRes.headers.get('location') || cfRes.headers.get('Location'),
              stream_media_id: cfRes.headers.get('stream-media-id') || '',
              ok: true,
            });
          } else {
            results.push({ filename: file.filename, ok: false, status: cfRes.status });
          }
        } catch (e) {
          results.push({ filename: file.filename, ok: false, error: String(e) });
        }
      }

      return jsonResponse({ results, total: results.length });
    }

    // ── ACTION: map_stream_uids ──
    // Maps CF stream UIDs to acvolt_lessons by matching video_filename
    if (action === 'map_stream_uids') {
      const { mappings } = params;
      if (!mappings || !Array.isArray(mappings)) {
        return jsonResponse({ error: 'mappings array required: [{lesson_id, stream_uid}]' }, 400);
      }
      let mapped = 0;
      let errors: string[] = [];
      for (const m of mappings) {
        const { data, error } = await supabase
          .from('acvolt_lessons')
          .update({ stream_uid: m.stream_uid })
          .eq('id', m.lesson_id)
          .is('stream_uid', null)
          .select('id')
          .single();
        if (error) {
          errors.push(`Lesson ${m.lesson_id}: ${error.message}`);
        } else if (data) {
          mapped++;
        }
      }
      return jsonResponse({ mapped, total: mappings.length, errors });
    }

    // ── ACTION: ensure_recording ──
    // Forces recording mode to 'automatic' on the permanent input
    if (action === 'ensure_recording') {
      const perm = await getOrCreatePermanentInput();
      const cfRes = await fetch(`${cfBase}/live_inputs/${perm.cf_input_id}`, {
        method: 'PUT',
        headers: cfHeaders,
        body: JSON.stringify({
          recording: { mode: 'automatic' },
        }),
      });
      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Failed to enable recording', details: cfData.errors }, 500);
      }
      const rec = cfData.result?.recording || {};
      return jsonResponse({ success: true, recording: rec, cf_input_id: perm.cf_input_id });
    }

    // ── ACTION: get_live_input_info ──
    // Returns Cloudflare live input details including recording config
    if (action === 'get_live_input_info') {
      const { cf_input_id } = params;
      if (!cf_input_id) {
        return jsonResponse({ error: 'cf_input_id required' }, 400);
      }
      const cfRes = await fetch(`${cfBase}/live_inputs/${cf_input_id}`, {
        headers: cfHeaders,
      });
      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }
      return jsonResponse({ input: cfData.result });
    }

    // ── ACTION: list_videos ──
    // Lists all videos in the Cloudflare Stream account (paginated, up to 1000)
    if (action === 'list_videos') {
      const allVideos: unknown[] = [];
      let cursor = '';
      // Paginate through all videos (CF returns max 1000 per page)
      for (let page = 0; page < 10; page++) {
        const qs = cursor ? `?after=${cursor}` : '';
        const cfRes = await fetch(`${cfBase}${qs}`, {
          headers: cfHeaders,
        });
        const cfData = await cfRes.json();
        if (!cfData.success) {
          return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
        }
        const videos = cfData.result || [];
        if (videos.length === 0) break;
        allVideos.push(...videos);
        // CF uses cursor-based pagination
        if (cfData.result_info?.cursor) {
          cursor = cfData.result_info.cursor;
        } else {
          break;
        }
      }

      return jsonResponse({
        total: allVideos.length,
        videos: allVideos.map((v: any) => ({
          uid: v.uid,
          name: v.meta?.name || v.meta?.filename || null,
          status: v.status?.state || null,
          duration: v.duration || 0,
          size: v.size || 0,
          created: v.created || null,
          thumbnail: v.thumbnail || null,
          playback_hls: v.playback?.hls || null,
        })),
      });
    }

    // ── ACTION: create_clip ──
    // Trim a video by creating a clip with start/end times
    if (action === 'create_clip') {
      const { stream_id, cf_video_uid, start_time, end_time } = params;
      if (!cf_video_uid || start_time === undefined || end_time === undefined) {
        return jsonResponse({ error: 'cf_video_uid, start_time, and end_time required' }, 400);
      }
      if (end_time <= start_time) {
        return jsonResponse({ error: 'end_time must be greater than start_time' }, 400);
      }

      // Create clip via Cloudflare Stream API
      const cfRes = await fetch(`${cfBase}/clip`, {
        method: 'POST',
        headers: cfHeaders,
        body: JSON.stringify({
          clippedFromVideoUID: cf_video_uid,
          startTimeSeconds: Number(start_time),
          endTimeSeconds: Number(end_time),
        }),
      });

      const cfData = await cfRes.json();
      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare clip error', details: cfData.errors }, 500);
      }

      const clip = cfData.result;
      const clipUid = clip.uid || clip.playback?.hls?.split('/').slice(-2, -1)[0];

      if (!clipUid) {
        return jsonResponse({ error: 'No clip UID returned from Cloudflare' }, 500);
      }

      const playbackUrl = CF_CUSTOMER_SUBDOMAIN
        ? `https://${CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${clipUid}/iframe`
        : null;

      // Register clip as a new recording if stream_id provided
      if (stream_id) {
        const clipDuration = Number(end_time) - Number(start_time);
        const { data: rec, error: recErr } = await supabase
          .from('stream_recordings')
          .insert({
            stream_id,
            cf_video_uid: clipUid,
            duration_seconds: clipDuration,
            playback_url: playbackUrl,
            status: 'processing',
            visible: false,
            cf_created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (recErr) {
          return jsonResponse({ error: 'Clip created on CF but DB insert failed', clip_uid: clipUid, details: recErr.message }, 500);
        }

        return jsonResponse({ clip_uid: clipUid, recording: rec, duration: clipDuration });
      }

      return jsonResponse({ clip_uid: clipUid, playback_url: playbackUrl });
    }

    // ── ACTION: check_video_status ──
    // Check if an uploaded video has finished processing on Cloudflare
    if (action === 'check_video_status') {
      const { recording_id, cf_video_uid } = params;
      if (!cf_video_uid) {
        return jsonResponse({ error: 'cf_video_uid required' }, 400);
      }

      const cfRes = await fetch(`${cfBase}/${cf_video_uid}`, { headers: cfHeaders });
      const cfData = await cfRes.json();

      if (!cfData.success) {
        return jsonResponse({ error: 'Cloudflare API error', details: cfData.errors }, 500);
      }

      const video = cfData.result;
      const videoStatus = video?.status?.state || 'unknown';
      const duration = video?.duration || null;

      // Update DB if status changed to ready
      if (recording_id && videoStatus === 'ready') {
        const updates: Record<string, unknown> = { status: 'ready' };
        if (duration) updates.duration_seconds = duration;

        await supabase
          .from('stream_recordings')
          .update(updates)
          .eq('id', recording_id);

        // Cleanup: try to delete temporary file from Storage
        try {
          const { data: files } = await supabase.storage.from('stream-uploads').list('uploads');
          if (files && files.length > 0) {
            const paths = files.map((f: { name: string }) => 'uploads/' + f.name);
            await supabase.storage.from('stream-uploads').remove(paths);
          }
        } catch (_) { /* ignore cleanup errors */ }
      }

      return jsonResponse({ status: videoStatus, duration });
    }

    // ── ACTION: register_upload ──
    // After a manual TUS upload, register the video as a stream recording
    if (action === 'register_upload') {
      const { stream_id, cf_video_uid, filename } = params;
      if (!stream_id || !cf_video_uid) {
        return jsonResponse({ error: 'stream_id and cf_video_uid required' }, 400);
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('stream_recordings')
        .select('id')
        .eq('cf_video_uid', cf_video_uid)
        .maybeSingle();

      if (existing) {
        return jsonResponse({ error: 'Video already registered', recording_id: existing.id }, 409);
      }

      // Try to get video info from Cloudflare (duration, status)
      let duration: number | null = null;
      let videoStatus = 'processing';
      try {
        const cfRes = await fetch(`${cfBase}/${cf_video_uid}`, { headers: cfHeaders });
        const cfData = await cfRes.json();
        if (cfData.success && cfData.result) {
          duration = cfData.result.duration || null;
          videoStatus = cfData.result.status?.state || 'processing';
        }
      } catch (_) { /* video may still be processing */ }

      const playbackUrl = CF_CUSTOMER_SUBDOMAIN
        ? `https://${CF_CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${cf_video_uid}/iframe`
        : null;

      const { data: rec, error: recErr } = await supabase
        .from('stream_recordings')
        .insert({
          stream_id,
          cf_video_uid,
          duration_seconds: duration,
          playback_url: playbackUrl,
          status: videoStatus === 'ready' ? 'ready' : 'processing',
          visible: false,
          cf_created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (recErr) {
        return jsonResponse({ error: 'DB insert error', details: recErr.message }, 500);
      }

      return jsonResponse({ recording: rec, video_status: videoStatus });
    }

    return jsonResponse({ error: 'Unknown action: ' + action }, 400);

  } catch (err) {
    console.error('cf-stream-proxy error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

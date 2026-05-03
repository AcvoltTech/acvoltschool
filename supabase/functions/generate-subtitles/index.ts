// Edge Function: generate-subtitles
// Pipeline: Deepgram Nova-3 (utterances) → Claude Sonnet (translate ES→EN) → WebVTT → Supabase Storage
// Deploy: supabase functions deploy generate-subtitles --no-verify-jwt

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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Format seconds to WebVTT timestamp: HH:MM:SS.mmm
function toVttTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (
    String(h).padStart(2, "0") +
    ":" +
    String(m).padStart(2, "0") +
    ":" +
    s.toFixed(3).padStart(6, "0")
  );
}

serve(async (req) => {
  initCors(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 5 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const DEEPGRAM_API_KEY = Deno.env.get("DEEPGRAM_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!DEEPGRAM_API_KEY) throw new Error("DEEPGRAM_API_KEY not configured");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!SUPABASE_URL) throw new Error("SUPABASE_URL not configured");
    if (!SUPABASE_SERVICE_ROLE_KEY)
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

    const body = await req.json();
    const { video_id, video_url, admin_email } = body;

    // ── Admin verification ──
    if (!admin_email) return jsonResponse({ error: 'Authentication required' }, 401);
    const sb = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const emailLower = admin_email.toLowerCase().trim();
    const { data: admins } = await sb.from('admin_students').select('id').eq('email', emailLower).limit(1);
    if (!admins || admins.length === 0) {
      const { data: staff } = await sb.from('admin_staff').select('id').eq('activo', true).ilike('email', emailLower).limit(1);
      if (!staff || staff.length === 0) return jsonResponse({ error: 'Unauthorized' }, 403);
    }

    if (!video_id || !video_url) {
      return jsonResponse(
        { error: "video_id and video_url are required" },
        400
      );
    }

    console.log("Starting subtitle generation for video:", video_id);

    // ── Step 1: Deepgram transcription with utterances ──
    console.log("Step 1: Deepgram transcription...");
    const dgParams = new URLSearchParams({
      model: "nova-3",
      language: "es",
      smart_format: "true",
      punctuate: "true",
      utterances: "true",
    });

    const dgResponse = await fetch(
      "https://api.deepgram.com/v1/listen?" + dgParams.toString(),
      {
        method: "POST",
        headers: {
          Authorization: "Token " + DEEPGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: video_url }),
      }
    );

    if (!dgResponse.ok) {
      const errText = await dgResponse.text();
      throw new Error("Deepgram error: " + dgResponse.status + " - " + errText);
    }

    const dgResult = await dgResponse.json();
    const utterances = dgResult?.results?.utterances;

    if (!utterances || utterances.length === 0) {
      throw new Error(
        "No speech detected in video — Deepgram returned 0 utterances"
      );
    }

    console.log("Deepgram returned", utterances.length, "utterances");

    // Extract segments with timestamps
    const segments = utterances.map(
      (u: { start: number; end: number; transcript: string }) => ({
        start: u.start,
        end: u.end,
        text: u.transcript.trim(),
      })
    );

    // ── Step 2: Translate segments via Claude Sonnet ──
    console.log("Step 2: Translating", segments.length, "segments with Claude...");

    // Batch segments into chunks of ~40 to stay within token limits
    const BATCH_SIZE = 40;
    const translatedSegments: { start: number; end: number; text: string }[] = [];

    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      const batch = segments.slice(i, i + BATCH_SIZE);
      const numberedLines = batch
        .map(
          (seg: { text: string }, idx: number) => `${i + idx + 1}. ${seg.text}`
        )
        .join("\n");

      const claudeResponse = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: `Translate these HVAC tutorial subtitle lines from Spanish to English. Keep the same numbered format. Preserve technical terms accurately. Each line should be concise (subtitle-length). Do NOT add or remove lines.\n\n${numberedLines}`,
              },
            ],
          }),
        }
      );

      if (!claudeResponse.ok) {
        const errText = await claudeResponse.text();
        throw new Error(
          "Claude API error: " + claudeResponse.status + " - " + errText
        );
      }

      const claudeResult = await claudeResponse.json();
      const translatedText =
        claudeResult?.content?.[0]?.text || "";

      // Parse numbered translations back
      const lines = translatedText.split("\n").filter((l: string) => l.trim());
      for (let j = 0; j < batch.length; j++) {
        const line = lines[j] || "";
        // Remove leading number + dot/period
        const cleaned = line.replace(/^\d+\.\s*/, "").trim();
        translatedSegments.push({
          start: batch[j].start,
          end: batch[j].end,
          text: cleaned || batch[j].text, // fallback to original if parse fails
        });
      }
    }

    console.log("Translation complete:", translatedSegments.length, "segments");

    // ── Step 3: Generate WebVTT ──
    console.log("Step 3: Generating WebVTT...");
    let vtt = "WEBVTT\n\n";
    translatedSegments.forEach((seg, idx) => {
      vtt += `${idx + 1}\n`;
      vtt += `${toVttTime(seg.start)} --> ${toVttTime(seg.end)}\n`;
      vtt += `${seg.text}\n\n`;
    });

    // ── Step 4: Upload to Supabase Storage ──
    console.log("Step 4: Uploading VTT to storage...");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const filePath = `subtitles/${video_id}_en.vtt`;
    const { error: uploadError } = await supabase.storage
      .from("school-files")
      .upload(filePath, new Blob([vtt], { type: "text/vtt" }), {
        contentType: "text/vtt",
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Storage upload error: " + uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("school-files")
      .getPublicUrl(filePath);
    const subtitleUrl = urlData?.publicUrl;

    if (!subtitleUrl) {
      throw new Error("Could not get public URL for uploaded VTT");
    }

    console.log("VTT uploaded:", subtitleUrl);

    // ── Step 5: Update tutorial_videos row ──
    console.log("Step 5: Updating tutorial_videos...");
    const { error: updateError } = await supabase
      .from("tutorial_videos")
      .update({ subtitle_url_en: subtitleUrl })
      .eq("id", video_id);

    if (updateError) {
      throw new Error("DB update error: " + updateError.message);
    }

    console.log("Subtitle generation complete for video:", video_id);

    return jsonResponse({
      success: true,
      subtitle_url_en: subtitleUrl,
      segments: translatedSegments.length,
    });
  } catch (error) {
    console.error("generate-subtitles error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
});

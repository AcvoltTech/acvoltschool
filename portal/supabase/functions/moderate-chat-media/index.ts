// Edge Function: moderate-chat-media
// Deploy: supabase functions deploy moderate-chat-media
// Uses existing ANTHROPIC_API_KEY secret + default SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
// Supabase Project: htklsowiyjwsjnacnvnr

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

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
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Supabase service role not configured');

    const { media_url, message_id, media_type, admin_email } = await req.json();

    // ========== AUTH: admin verification via shared helper ==========
    const sb = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      return new Response(
        JSON.stringify({ error: auth.error || 'Unauthorized' }),
        { status: auth.status || 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!media_url || !message_id) {
      return new Response(
        JSON.stringify({ error: 'media_url and message_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build Claude Vision request — for videos we receive the thumbnail URL
    const imageUrl = media_type === 'video' ? media_url : media_url;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: imageUrl }
            },
            {
              type: 'text',
              text: 'You are a content moderator for a professional HVAC technician chat. Analyze this image and determine if it is appropriate. REJECT if it contains: pornography, nudity, sexual content, graphic violence, drug use, weapons, hate symbols, or content completely unrelated to HVAC/construction/trades work (like memes, selfies, personal photos). APPROVE if it shows: HVAC equipment, tools, installations, wiring, ductwork, refrigerant, thermostats, work sites, technical diagrams, or anything related to the HVAC trade. Respond with ONLY a JSON object: {"approved": true} or {"approved": false, "reason": "brief reason in Spanish"}'
            }
          ]
        }]
      })
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      throw new Error('Anthropic API error: ' + anthropicResponse.status + ' - ' + errText);
    }

    const aiResult = await anthropicResponse.json();
    const replyText = aiResult.content?.[0]?.text || '';

    // Parse the JSON response from Claude
    let approved = true;
    let reason = '';
    try {
      const parsed = JSON.parse(replyText.replace(/```json\n?/g, '').replace(/```/g, '').trim());
      approved = parsed.approved === true;
      reason = parsed.reason || '';
    } catch {
      // If parsing fails, approve by default to avoid blocking legitimate content
      console.error('Failed to parse moderation response:', replyText);
      approved = true;
    }

    // Update the message using service role (bypasses RLS)
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { error: updateError } = await supabaseAdmin
      .from('chat_messages')
      .update({
        moderation_status: approved ? 'approved' : 'rejected',
        moderation_reason: approved ? null : reason
      })
      .eq('id', message_id);

    if (updateError) {
      throw new Error('Failed to update message: ' + updateError.message);
    }

    return new Response(
      JSON.stringify({ approved, reason }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

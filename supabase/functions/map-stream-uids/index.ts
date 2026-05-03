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

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  const body = await req.json();
  const { mappings, table, updates, admin_email } = body;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Admin verification ──
  if (!admin_email) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const _emailLower = admin_email.toLowerCase().trim();
  const { data: admins } = await supabase.from('admin_students').select('id').eq('email', _emailLower).limit(1);
  if (!admins || admins.length === 0) {
    const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', _emailLower).limit(1);
    if (!staff || staff.length === 0) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const allowedTables = ["acvolt_lessons", "acvolt_courses", "acvolt_sections"];
  const results = [];

  if (table && updates && allowedTables.includes(table)) {
    for (const u of updates) {
      const { error } = await supabase.from(table).update(u.data).eq("id", u.id);
      results.push({ id: u.id, ok: !error, error: error?.message });
    }
  } else if (mappings) {
    for (const m of mappings) {
      const updateData: Record<string, string> = {};
      if (m.stream_uid) updateData.stream_uid = m.stream_uid;
      if (m.video_filename) updateData.video_filename = m.video_filename;
      const { error } = await supabase
        .from("acvolt_lessons")
        .update(updateData)
        .eq("id", m.id);
      results.push({ id: m.id, ok: !error, error: error?.message });
    }
  }

  return new Response(JSON.stringify({ results, total: results.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

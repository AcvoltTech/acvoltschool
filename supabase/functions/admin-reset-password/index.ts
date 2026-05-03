// Edge Function: admin-reset-password v4
// Reset student passwords via Supabase Auth Admin API
// Deploy: cd maestroac-app && npx supabase functions deploy admin-reset-password --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://maestroac-app-clon.pages.dev',
  'http://localhost:5173',
  'http://localhost:3000',
];

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Rate limit: 5 requests per 60 seconds
  const rl = await checkRateLimit(req, { maxRequests: 5, windowSeconds: 60 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing credentials');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { email, new_password, action, admin_email } = await req.json();

    // Admin authentication via JWT (primary) or fallback (body email + apikey)
    const auth = await verifyAdminAuth(req, supabase, admin_email);
    if (!auth.verified) {
      console.warn('[admin-reset-password] Unauthorized attempt:', auth.error);
      return new Response(JSON.stringify({ error: auth.error || 'Unauthorized' }), { status: auth.status || 403, headers: corsHeaders });
    }
    if (!email) {
      return new Response(JSON.stringify({ error: 'email required' }), { status: 400, headers: corsHeaders });
    }

    const emailLower = email.toLowerCase().trim();

    // Search auth users by paginating
    let targetUser: any = null;
    for (let page = 1; page <= 30; page++) {
      const { data, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
      if (listErr) throw new Error('listUsers error: ' + listErr.message);
      const users = data?.users || [];
      if (users.length === 0) break;
      const match = users.find((u: any) => u.email?.toLowerCase() === emailLower);
      if (match) { targetUser = match; break; }
    }

    if (action === 'search') {
      return new Response(JSON.stringify({
        v: 3,
        found: !!targetUser,
        user: targetUser ? { id: targetUser.id, email: targetUser.email } : null,
      }), { headers: corsHeaders });
    }

    if (!new_password) {
      return new Response(JSON.stringify({ error: 'new_password required' }), { status: 400, headers: corsHeaders });
    }

    // Password strength validation
    if (typeof new_password !== 'string' || new_password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers: corsHeaders });
    }
    if (!/[A-Z]/.test(new_password) || !/[a-z]/.test(new_password) || !/[0-9]/.test(new_password)) {
      return new Response(JSON.stringify({ error: 'Password must include uppercase, lowercase, and a number' }), { status: 400, headers: corsHeaders });
    }

    if (!targetUser) {
      return new Response(JSON.stringify({ v: 3, error: 'Auth user not found: ' + emailLower }), { status: 404, headers: corsHeaders });
    }

    const { error: updateErr } = await supabase.auth.admin.updateUserById(targetUser.id, {
      password: new_password,
    });
    if (updateErr) throw new Error('updateUser error: ' + updateErr.message);

    return new Response(JSON.stringify({ v: 3, success: true, email: targetUser.email, user_id: targetUser.id }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ v: 3, error: (error as Error).message }), { status: 500, headers: corsHeaders });
  }
});

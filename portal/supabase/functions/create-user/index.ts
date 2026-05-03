// Edge Function: create-user
// Admin creates new student accounts via Supabase Auth Admin API
// Deploy: supabase functions deploy create-user --no-verify-jwt

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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 10 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    const { email, password, nombre, telefono, admin_email } = await req.json();

    if (!email || !password) {
      return jsonResponse({ error: 'email and password are required' }, 400);
    }

    // Password strength validation
    if (typeof password !== 'string' || password.length < 8) {
      return jsonResponse({ error: 'Password must be at least 8 characters' }, 400);
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return jsonResponse({ error: 'Password must include uppercase, lowercase, and a number' }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // ── Admin verification via JWT (primary) or fallback (body email + apikey) ──
    const auth = await verifyAdminAuth(req, supabase, admin_email);
    if (!auth.verified) {
      return jsonResponse({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
    });

    if (authError) {
      return jsonResponse({ error: authError.message }, 400);
    }

    // Insert into users table
    const { error: profileError } = await supabase.from('users').upsert({
      id: authData.user.id,
      email: email.toLowerCase().trim(),
      nombre: nombre || '',
      telefono: telefono || '',
      fecha_registro: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (profileError) {
      console.error('Profile insert error:', profileError);
    }

    console.log('User created:', email);
    return jsonResponse({ success: true, user_id: authData.user.id });
  } catch (error) {
    console.error('create-user error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

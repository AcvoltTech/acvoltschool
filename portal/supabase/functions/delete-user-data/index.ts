// Edge Function: delete-user-data v1
// GDPR-compliant user data deletion endpoint
// Deletes all user data from: users, certificates, quiz_attempts, attendance, memberships, push_subscriptions
// Deploy: cd maestroac-app && npx supabase functions deploy delete-user-data --no-verify-jwt

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

  // Rate limit: 3 requests per 60 seconds (destructive operation)
  const rl = await checkRateLimit(req, { maxRequests: 3, windowSeconds: 60 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing credentials');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { student_email, admin_email, confirm } = await req.json();

    // Admin verification via JWT (primary) or fallback (body email + apikey)
    const auth = await verifyAdminAuth(req, supabase, admin_email);
    if (!auth.verified) {
      return new Response(JSON.stringify({ error: auth.error || 'Unauthorized' }), { status: auth.status || 403, headers: corsHeaders });
    }
    const adminEmailLower = auth.email;

    if (!student_email || typeof student_email !== 'string') {
      return new Response(JSON.stringify({ error: 'student_email is required' }), { status: 400, headers: corsHeaders });
    }

    if (confirm !== true) {
      return new Response(JSON.stringify({ error: 'Set confirm: true to proceed with deletion' }), { status: 400, headers: corsHeaders });
    }

    const emailLower = student_email.toLowerCase().trim();

    // Find the auth user
    let targetUser: any = null;
    for (let page = 1; page <= 30; page++) {
      const { data, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
      if (listErr) throw new Error('listUsers error: ' + listErr.message);
      const users = data?.users || [];
      if (users.length === 0) break;
      const match = users.find((u: any) => u.email?.toLowerCase() === emailLower);
      if (match) { targetUser = match; break; }
    }

    const deletedTables: string[] = [];

    // Delete from all user-related tables
    const tablesToClean = [
      'users',
      'certificates',
      'quiz_attempts',
      'attendance',
      'memberships',
      'push_subscriptions',
      'user_progress',
      'payment_records',
      'notification_log',
      'ai_usage',
    ];

    for (const table of tablesToClean) {
      try {
        // Try email column first, then user_email, then user_id
        let result = await supabase.from(table).delete().eq('email', emailLower);
        if (!result.error) { deletedTables.push(table + ' (email)'); continue; }

        result = await supabase.from(table).delete().eq('user_email', emailLower);
        if (!result.error) { deletedTables.push(table + ' (user_email)'); continue; }

        if (targetUser) {
          result = await supabase.from(table).delete().eq('user_id', targetUser.id);
          if (!result.error) { deletedTables.push(table + ' (user_id)'); continue; }
        }
      } catch (e) {
        // Table might not exist or column mismatch — skip
        console.warn(`[delete-user-data] Skipped ${table}:`, (e as Error).message);
      }
    }

    // Delete auth user last
    let authDeleted = false;
    if (targetUser) {
      const { error: deleteErr } = await supabase.auth.admin.deleteUser(targetUser.id);
      if (deleteErr) {
        console.error('[delete-user-data] Auth delete error:', deleteErr.message);
      } else {
        authDeleted = true;
      }
    }

    // Audit log
    await supabase.from('audit_log').insert({
      action: 'gdpr_delete',
      admin_email: adminEmailLower,
      target_email: emailLower,
      details: { tables_cleaned: deletedTables, auth_deleted: authDeleted },
    }).catch(() => {}); // Don't fail if audit table doesn't exist

    console.log(`[delete-user-data] Deleted ${emailLower} by ${adminEmailLower}: ${deletedTables.join(', ')}`);

    return new Response(JSON.stringify({
      success: true,
      email: emailLower,
      tables_cleaned: deletedTables,
      auth_deleted: authDeleted,
    }), { headers: corsHeaders });

  } catch (error) {
    console.error('[delete-user-data] Error:', (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: corsHeaders });
  }
});

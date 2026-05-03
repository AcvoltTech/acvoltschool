// Edge Function: admin-write
// Secure proxy for admin write operations on users/memberships tables.
// Uses service_role key to bypass RLS — verifies caller is active admin first.
// Deploy: npx supabase functions deploy admin-write --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";
import { verifyAdminAuth } from "../_shared/admin-auth.ts";

// ── CORS ────────────────────────────────────────────────────────────
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// ── Column whitelists (only these columns can be written) ───────────
const ALLOWED_COLUMNS: Record<string, Set<string>> = {
  users: new Set([
    'email', 'nombre', 'telefono', 'technician_number',
    'nivel_actual', 'referral_code', 'fecha_registro',
    'activa', 'user_type',
  ]),
  memberships: new Set([
    'email', 'activa', 'tipo', 'amount', 'user_id',
    'updated_at', 'student_status', 'payment_status',
    'price', 'instructor_id',
  ]),
};

// ── Allowed operations ──────────────────────────────────────────────
const ALLOWED_OPERATIONS = new Set([
  'upsert_user',
  'upsert_membership',
  'update_membership',
  'update_user',
]);

// ── Helpers ─────────────────────────────────────────────────────────
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** Strip any columns not in the whitelist for the given table. */
function sanitizeData(table: string, data: Record<string, unknown>): Record<string, unknown> {
  const allowed = ALLOWED_COLUMNS[table];
  if (!allowed) return {};
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (allowed.has(key)) {
      clean[key] = data[key];
    }
  }
  return clean;
}

// ── Main handler ────────────────────────────────────────────────────
serve(async (req) => {
  initCors(req);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only POST
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Rate limit: 10 ops/sec per admin IP
  const rl = await checkRateLimit(req, { maxRequests: 10, windowSeconds: 1 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const SB_URL = Deno.env.get('SUPABASE_URL')!;
    const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SB_KEY) throw new Error('Service role key not configured');

    const sb = createClient(SB_URL, SB_KEY);

    // ── Parse body ──────────────────────────────────────────────────
    const body = await req.json();
    const {
      admin_email,
      operation,
      table,
      data,
      match,        // { column, value } for update operations
      onConflict,   // string — conflict column for upserts
    } = body;

    // ── Verify admin via JWT (primary) or fallback (body email + apikey) ──
    const auth = await verifyAdminAuth(req, sb, admin_email);
    if (!auth.verified) {
      console.warn('[admin-write] Unauthorized attempt:', auth.error);
      return json({ error: auth.error || 'Unauthorized' }, auth.status || 403);
    }
    const emailLower = auth.email;
    const adminRole = auth.role;

    // ── Basic validation ────────────────────────────────────────────
    if (!operation || !ALLOWED_OPERATIONS.has(operation)) {
      return json({ error: 'Invalid operation: ' + operation }, 400);
    }
    if (!table || !ALLOWED_COLUMNS[table]) {
      return json({ error: 'Invalid table: ' + table }, 400);
    }
    if (!data || typeof data !== 'object') {
      return json({ error: 'data object is required' }, 400);
    }

    // Validate operation matches the table
    if (
      (operation === 'upsert_user' || operation === 'update_user') && table !== 'users'
    ) {
      return json({ error: 'Operation ' + operation + ' requires table "users"' }, 400);
    }
    if (
      (operation === 'upsert_membership' || operation === 'update_membership') && table !== 'memberships'
    ) {
      return json({ error: 'Operation ' + operation + ' requires table "memberships"' }, 400);
    }

    // For update operations, match is required
    if ((operation === 'update_user' || operation === 'update_membership') && (!match || !match.column || !match.value)) {
      return json({ error: 'match { column, value } is required for update operations' }, 400);
    }

    // Validate match column is in the allowed set
    if (match && match.column) {
      const allowedMatch = ALLOWED_COLUMNS[table];
      if (!allowedMatch || !allowedMatch.has(match.column)) {
        return json({ error: 'Invalid match column: ' + match.column }, 400);
      }
    }

    // ── Role-based access control ───────────────────────────────────
    // Only master and student_success roles can perform write operations
    const WRITE_ROLES = new Set(['master', 'student_success']);
    if (!WRITE_ROLES.has(adminRole)) {
      console.warn('[admin-write] Role "' + adminRole + '" not authorized for writes by:', emailLower);
      return json({ error: 'Insufficient role for write operations' }, 403);
    }

    // ── Sanitize data ───────────────────────────────────────────────
    const cleanData = sanitizeData(table, data);
    if (Object.keys(cleanData).length === 0) {
      return json({ error: 'No valid columns provided for table ' + table }, 400);
    }

    console.log('[admin-write]', operation, table, 'by', emailLower, JSON.stringify(cleanData));

    // ── Execute operation ───────────────────────────────────────────
    let result: { data: unknown; error: unknown };

    if (operation === 'upsert_user' || operation === 'upsert_membership') {
      // Smart upsert: check if record exists first, then update or insert
      // This avoids requiring a unique constraint on the table
      const conflictCol = onConflict || 'email';
      const conflictVal = cleanData[conflictCol];

      if (conflictVal) {
        const { data: existing } = await sb
          .from(table)
          .select('id')
          .eq(conflictCol, conflictVal)
          .limit(1);

        if (existing && existing.length > 0) {
          // Update existing record (first match)
          result = await sb
            .from(table)
            .update(cleanData)
            .eq(conflictCol, conflictVal)
            .select();
        } else {
          // Insert new record
          result = await sb
            .from(table)
            .insert(cleanData)
            .select();
        }
      } else {
        // No conflict value — just insert
        result = await sb
          .from(table)
          .insert(cleanData)
          .select();
      }
    } else {
      // Update with match
      result = await sb
        .from(table)
        .update(cleanData)
        .eq(match.column, match.value)
        .select();
    }

    if (result.error) {
      const err = result.error as { message?: string };
      console.error('[admin-write] DB error:', err.message || result.error);
      return json({ error: 'Database error: ' + (err.message || 'unknown') }, 500);
    }

    return json({ success: true, data: result.data });

  } catch (err) {
    console.error('[admin-write] Error:', err);
    return json({
      error: err instanceof Error ? err.message : String(err),
    }, 500);
  }
});

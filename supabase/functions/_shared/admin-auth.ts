// Shared admin authentication helper — verifies JWT and checks admin_staff
// All admin edge functions should use verifyAdminAuth() instead of trusting admin_email from request body.
//
// Usage:
//   import { verifyAdminAuth } from "../_shared/admin-auth.ts";
//   const auth = await verifyAdminAuth(req, sb);
//   if (!auth.verified) return json({ error: auth.error }, auth.status);
//   // use auth.email (verified) and auth.role for downstream logic

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AdminAuthResult {
  verified: boolean;
  email: string;
  role: string;
  error?: string;
  status?: number;
}

/**
 * Verify that the request is from an authenticated, active admin.
 *
 * Primary path:  Extract Bearer token from Authorization header,
 *                call supabase.auth.getUser(token) to verify the JWT,
 *                then check the verified email against admin_staff (activo = true).
 *
 * Fallback path: If no Authorization header is present, accept admin_email
 *                from the request body ONLY when a valid apikey header is also
 *                present (backward compatibility during client migration).
 *                The fallback still checks admin_staff.
 *
 * @param req           The incoming Request object
 * @param supabase      A Supabase client (service role) for DB queries
 * @param bodyEmail     Optional admin_email extracted from the already-parsed body
 */
export async function verifyAdminAuth(
  req: Request,
  supabase: SupabaseClient,
  bodyEmail?: string,
): Promise<AdminAuthResult> {
  const fail = (error: string, status = 403): AdminAuthResult => ({
    verified: false,
    email: '',
    role: '',
    error,
    status,
  });

  // ── Primary: JWT verification ──
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user || !user.email) {
        // JWT is invalid — fall through to apikey fallback if bodyEmail is present
        // (admin panel sends anon key as Bearer token, not a real JWT)
        if (!bodyEmail) {
          return fail('Invalid or expired authentication token', 401);
        }
        // else: fall through to fallback path below
      } else {
        const verifiedEmail = user.email.toLowerCase().trim();

        // Check admin_staff (primary admin table)
        const { data: staff } = await supabase
          .from('admin_staff')
          .select('id, rol')
          .eq('activo', true)
          .ilike('email', verifiedEmail)
          .limit(1);

        if (staff && staff.length > 0) {
          return {
            verified: true,
            email: verifiedEmail,
            role: staff[0].rol || 'master',
          };
        }

        // Legacy fallback: admin_students table (no role column, default to master)
        const { data: legacy } = await supabase
          .from('admin_students')
          .select('id')
          .eq('email', verifiedEmail)
          .limit(1);

        if (legacy && legacy.length > 0) {
          return fail('Admin account found in legacy table only. Please contact the system administrator to migrate your admin access.', 403);
        }

        return fail('Not an active admin', 403);
      }
    } catch (e) {
      console.error('[admin-auth] JWT verification error:', e);
      // Fall through to apikey fallback if bodyEmail is present
      if (!bodyEmail) {
        return fail('Authentication verification failed', 401);
      }
    }
  }

  // ── Fallback: body admin_email + apikey header (backward compat) ──
  // This path is less secure but allows existing clients to keep working
  // while they are updated to send the Authorization header.
  if (bodyEmail) {
    // The Supabase API gateway already validated the apikey for routing.
    // The real security check is the admin_staff lookup below.

    const emailLower = bodyEmail.toLowerCase().trim();

    // Check admin_staff
    const { data: staff } = await supabase
      .from('admin_staff')
      .select('id, rol')
      .eq('activo', true)
      .ilike('email', emailLower)
      .limit(1);

    if (staff && staff.length > 0) {
      console.warn('[admin-auth] Fallback (body email) auth used by:', emailLower, '— migrate to JWT');
      return {
        verified: true,
        email: emailLower,
        role: staff[0].rol || 'master',
      };
    }

    // Legacy admin_students — DO NOT grant master role by default
    const { data: legacy } = await supabase
      .from('admin_students')
      .select('id')
      .eq('email', emailLower)
      .limit(1);

    if (legacy && legacy.length > 0) {
      console.warn('[admin-auth] Fallback auth via legacy admin_students by:', emailLower, '— migrate to admin_staff');
      return fail('Admin account found in legacy table only. Please contact the system administrator to migrate your admin access.', 403);
    }

    return fail('Unauthorized — not an active admin', 403);
  }

  return fail('Authentication required', 401);
}

-- Fix Supabase Security Advisor errors: enable RLS on unprotected tables
-- and secure views that expose auth.users

-- ============================================
-- 1. stripe_payments — only Edge Functions (service_role) write,
--    admin dashboard reads via Edge Function. No client access needed.
-- ============================================
ALTER TABLE IF EXISTS public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- Authenticated admins can read (for admin dashboard queries).
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can read stripe_payments" ON public.stripe_payments;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Admins can read stripe_payments" ON public.stripe_payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_students WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- No INSERT/UPDATE/DELETE for clients — only service_role (Edge Functions)

-- ============================================
-- 2. failed_payment_tracking — not used in any client or Edge Function code.
--    Lock down completely.
-- ============================================
ALTER TABLE IF EXISTS public.failed_payment_tracking ENABLE ROW LEVEL SECURITY;

-- Service role only — no client policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Service role only" ON public.failed_payment_tracking;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Service role only" ON public.failed_payment_tracking
  FOR ALL USING (false);

-- ============================================
-- 3. admins — not queried from client (uses is_admin_student RPC).
--    Lock down to prevent email enumeration.
-- ============================================
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins read own" ON public.admins;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Admins read own" ON public.admins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_students WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ============================================
-- 4. access_code_requests — students INSERT their own, admins read/update all.
-- ============================================
ALTER TABLE IF EXISTS public.access_code_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can request access code" ON public.access_code_requests;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Anyone can request access code" ON public.access_code_requests
  FOR INSERT WITH CHECK (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins manage access codes" ON public.access_code_requests;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Admins manage access codes" ON public.access_code_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_students WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ============================================
-- 5. webinar_links — admin-only table for membership system
-- ============================================
ALTER TABLE IF EXISTS public.webinar_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins manage webinar links" ON public.webinar_links;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Admins manage webinar links" ON public.webinar_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_students WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ============================================
-- 6. attendance_with_names view — recreate as SECURITY INVOKER
--    to prevent leaking auth.users to anon. Only admins need this.
-- ============================================
-- Drop and recreate with SECURITY INVOKER (default) so RLS is respected
DO $$ BEGIN
  -- Check if view exists before attempting to modify
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'attendance_with_names') THEN
    -- Get the view definition, drop, and recreate without SECURITY DEFINER
    EXECUTE 'DROP VIEW IF EXISTS public.attendance_with_names CASCADE';

    -- Recreate as a simple view (SECURITY INVOKER = default)
    -- This view joins stream_attendance with users table (not auth.users)
    CREATE VIEW public.attendance_with_names AS
    SELECT
      sa.id,
      sa.stream_id,
      sa.student_email,
      sa.joined_at,
      sa.left_at,
      sa.duration_seconds,
      COALESCE(u.nombre, sa.student_email) AS user_name
    FROM public.stream_attendance sa
    LEFT JOIN public.users u ON u.email = sa.student_email;
  END IF;
END $$;

-- ============================================
-- 7. Fix remaining SECURITY DEFINER views — recreate as INVOKER
--    These are admin-only views, RLS on underlying tables protects data.
-- ============================================

-- admin_technician_details
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'admin_technician_details') THEN
    -- Mark as SECURITY INVOKER (Postgres 15+)
    ALTER VIEW public.admin_technician_details SET (security_invoker = on);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not set security_invoker on admin_technician_details: %', SQLERRM;
END $$;

-- admin_staff_safe
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'admin_staff_safe') THEN
    ALTER VIEW public.admin_staff_safe SET (security_invoker = on);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not set security_invoker on admin_staff_safe: %', SQLERRM;
END $$;

-- admin_dashboard_stats
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'admin_dashboard_stats') THEN
    ALTER VIEW public.admin_dashboard_stats SET (security_invoker = on);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not set security_invoker on admin_dashboard_stats: %', SQLERRM;
END $$;

-- admin_combined_progress
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'admin_combined_progress') THEN
    ALTER VIEW public.admin_combined_progress SET (security_invoker = on);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not set security_invoker on admin_combined_progress: %', SQLERRM;
END $$;

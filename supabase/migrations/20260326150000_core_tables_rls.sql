-- ============================================================
-- Progressive RLS on Core Tables
-- ============================================================
-- CONTEXT: Hybrid auth system
--   - Students: Supabase Auth (auth.uid() available)
--   - Admins: Custom RPC auth via anon key (auth.uid() = NULL)
--   - Admin operations through client use anon key
--   - Some admin operations go through Edge Functions (service_role bypasses RLS)
--
-- STRATEGY:
--   - Enable RLS on all core tables
--   - anon role: full access (needed for admin dashboard operations)
--   - authenticated role: students can only WRITE their own data
--   - service_role: bypasses RLS automatically
--
-- VALUE:
--   (a) Enables RLS framework on every core table
--   (b) Students can only WRITE their own data right now
--   (c) Future: when admin ops move to Edge Functions, tighten anon policies
--
-- IDEMPOTENT: Uses DROP POLICY IF EXISTS before every CREATE POLICY
-- ============================================================

-- ============================================================
-- Helper subquery (used in policies):
--   (SELECT email FROM auth.users WHERE id = auth.uid())
-- This resolves the authenticated student's email from their JWT.
-- ============================================================


-- ============================================================
-- 1. USERS TABLE
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own data"    ON public.users;
DROP POLICY IF EXISTS "Users can insert own data"  ON public.users;
DROP POLICY IF EXISTS "Users can update own data"  ON public.users;
DROP POLICY IF EXISTS "users_select_own"           ON public.users;
DROP POLICY IF EXISTS "users_insert_own"           ON public.users;
DROP POLICY IF EXISTS "users_update_own"           ON public.users;
DROP POLICY IF EXISTS "users_anon_select"          ON public.users;
DROP POLICY IF EXISTS "users_anon_insert"          ON public.users;
DROP POLICY IF EXISTS "users_anon_update"          ON public.users;
DROP POLICY IF EXISTS "users_auth_select"          ON public.users;
DROP POLICY IF EXISTS "users_auth_insert_own"      ON public.users;
DROP POLICY IF EXISTS "users_auth_update_own"      ON public.users;

-- ANON: SELECT all (admin dashboards need full visibility)
CREATE POLICY "users_anon_select"
  ON public.users FOR SELECT
  TO anon
  USING (true);

-- ANON: INSERT all (admin gatekeeper creates user records)
CREATE POLICY "users_anon_insert"
  ON public.users FOR INSERT
  TO anon
  WITH CHECK (true);

-- ANON: UPDATE all (admin gatekeeper updates user records)
CREATE POLICY "users_anon_update"
  ON public.users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- AUTHENTICATED: SELECT all (students can look up others for chat/profile)
CREATE POLICY "users_auth_select"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- AUTHENTICATED: INSERT only own row (email must match their auth email)
CREATE POLICY "users_auth_insert_own"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- AUTHENTICATED: UPDATE only own row
CREATE POLICY "users_auth_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );


-- ============================================================
-- 2. MEMBERSHIPS TABLE
-- ============================================================
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Memberships read"              ON public.memberships;
DROP POLICY IF EXISTS "memberships_select_own"        ON public.memberships;
DROP POLICY IF EXISTS "memberships_update_own"        ON public.memberships;
DROP POLICY IF EXISTS "memberships_anon_select"       ON public.memberships;
DROP POLICY IF EXISTS "memberships_anon_insert"       ON public.memberships;
DROP POLICY IF EXISTS "memberships_anon_update"       ON public.memberships;
DROP POLICY IF EXISTS "memberships_auth_select_own"   ON public.memberships;
DROP POLICY IF EXISTS "memberships_auth_update_own"   ON public.memberships;

-- ANON: SELECT all (admin dashboard, stripe integration)
CREATE POLICY "memberships_anon_select"
  ON public.memberships FOR SELECT
  TO anon
  USING (true);

-- ANON: INSERT all (admin gatekeeper, stripe webhooks via anon)
CREATE POLICY "memberships_anon_insert"
  ON public.memberships FOR INSERT
  TO anon
  WITH CHECK (true);

-- ANON: UPDATE all (admin gatekeeper, stripe integration)
CREATE POLICY "memberships_anon_update"
  ON public.memberships FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- AUTHENTICATED: SELECT own membership only
CREATE POLICY "memberships_auth_select_own"
  ON public.memberships FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- AUTHENTICATED: UPDATE own membership only
CREATE POLICY "memberships_auth_update_own"
  ON public.memberships FOR UPDATE
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );


-- ============================================================
-- 3. USER_PROGRESS TABLE
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing policies (wrapped in DO block for table safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    DROP POLICY IF EXISTS "Progress read own"          ON public.user_progress;
    DROP POLICY IF EXISTS "Progress insert own"        ON public.user_progress;
    DROP POLICY IF EXISTS "Progress update own"        ON public.user_progress;
    DROP POLICY IF EXISTS "progress_select_own"        ON public.user_progress;
    DROP POLICY IF EXISTS "progress_insert_own"        ON public.user_progress;
    DROP POLICY IF EXISTS "progress_update_own"        ON public.user_progress;
    DROP POLICY IF EXISTS "user_progress_anon_select"  ON public.user_progress;
    DROP POLICY IF EXISTS "user_progress_auth_all_own" ON public.user_progress;
  END IF;
END $$;

-- ANON: SELECT all (admin diagnostics)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    EXECUTE 'CREATE POLICY "user_progress_anon_select" ON public.user_progress FOR SELECT TO anon USING (true)';
  END IF;
END $$;

-- AUTHENTICATED: ALL on own rows (user_id = auth.uid())
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    EXECUTE 'CREATE POLICY "user_progress_auth_all_own" ON public.user_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())';
  END IF;
END $$;


-- ============================================================
-- 4. DESAFIO_PROGRESS TABLE
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    ALTER TABLE public.desafio_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing policies (wrapped in DO block for table safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    DROP POLICY IF EXISTS "desafio_progress_anon_select"  ON public.desafio_progress;
    DROP POLICY IF EXISTS "desafio_progress_auth_all_own" ON public.desafio_progress;
  END IF;
END $$;

-- ANON: SELECT all (admin diagnostics)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    EXECUTE 'CREATE POLICY "desafio_progress_anon_select" ON public.desafio_progress FOR SELECT TO anon USING (true)';
  END IF;
END $$;

-- AUTHENTICATED: ALL on own rows (user_email matches auth email)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    EXECUTE 'CREATE POLICY "desafio_progress_auth_all_own" ON public.desafio_progress FOR ALL TO authenticated USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid())) WITH CHECK (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))';
  END IF;
END $$;


-- ============================================================
-- 5. QUIZ_ATTEMPTS TABLE (if exists)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing policies (wrapped in DO block for table safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    DROP POLICY IF EXISTS "Quiz attempts read own"      ON public.quiz_attempts;
    DROP POLICY IF EXISTS "Quiz attempts insert own"    ON public.quiz_attempts;
    DROP POLICY IF EXISTS "quiz_select_own"             ON public.quiz_attempts;
    DROP POLICY IF EXISTS "quiz_insert_own"             ON public.quiz_attempts;
    DROP POLICY IF EXISTS "quiz_attempts_anon_select"   ON public.quiz_attempts;
    DROP POLICY IF EXISTS "quiz_attempts_auth_all_own"  ON public.quiz_attempts;
  END IF;
END $$;

-- ANON: SELECT all
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    EXECUTE 'CREATE POLICY "quiz_attempts_anon_select" ON public.quiz_attempts FOR SELECT TO anon USING (true)';
  END IF;
END $$;

-- AUTHENTICATED: ALL on own rows (user_id = auth.uid())
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    EXECUTE 'CREATE POLICY "quiz_attempts_auth_all_own" ON public.quiz_attempts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())';
  END IF;
END $$;


-- ============================================================
-- 6. ZM_EXAM_ATTEMPTS TABLE
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    ALTER TABLE public.zm_exam_attempts ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing policies (wrapped in DO block for table safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    DROP POLICY IF EXISTS "Allow read exam attempts"      ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "Allow insert exam attempts"    ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "Allow update exam attempts"    ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "Users can manage own attempts" ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "Admins can read all attempts"  ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "zm_exam_anon_select"           ON public.zm_exam_attempts;
    DROP POLICY IF EXISTS "zm_exam_auth_all_own"          ON public.zm_exam_attempts;
  END IF;
END $$;

-- ANON: SELECT all (admin exam review dashboards)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    EXECUTE 'CREATE POLICY "zm_exam_anon_select" ON public.zm_exam_attempts FOR SELECT TO anon USING (true)';
  END IF;
END $$;

-- AUTHENTICATED: ALL on own rows
-- zm_exam_attempts uses user_id (UUID) and/or student_email (text)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    EXECUTE '
      CREATE POLICY "zm_exam_auth_all_own"
        ON public.zm_exam_attempts FOR ALL
        TO authenticated
        USING (
          user_id = auth.uid()
          OR student_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
        WITH CHECK (
          user_id = auth.uid()
          OR student_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )';
  END IF;
END $$;


-- ============================================================
-- 7. CERTIFICATES TABLE (if exists)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing policies (wrapped in DO block for table safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    DROP POLICY IF EXISTS "Certificates read own"            ON public.certificates;
    DROP POLICY IF EXISTS "Certificates insert own"          ON public.certificates;
    DROP POLICY IF EXISTS "certificates_select_policy"       ON public.certificates;
    DROP POLICY IF EXISTS "certificates_insert_policy"       ON public.certificates;
    DROP POLICY IF EXISTS "certs_select_own"                 ON public.certificates;
    DROP POLICY IF EXISTS "certs_insert_own"                 ON public.certificates;
    DROP POLICY IF EXISTS "certs_update_own"                 ON public.certificates;
    DROP POLICY IF EXISTS "Users can insert own certificates" ON public.certificates;
    DROP POLICY IF EXISTS "certificates_anon_select"         ON public.certificates;
    DROP POLICY IF EXISTS "certificates_auth_all_own"        ON public.certificates;
  END IF;
END $$;

-- ANON: SELECT all (admin certificate review)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    EXECUTE 'CREATE POLICY "certificates_anon_select" ON public.certificates FOR SELECT TO anon USING (true)';
  END IF;
END $$;

-- AUTHENTICATED: ALL on own rows (user_id = auth.uid())
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    EXECUTE 'CREATE POLICY "certificates_auth_all_own" ON public.certificates FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())';
  END IF;
END $$;


-- ============================================================
-- 8. AI_USAGE TABLE — verify existing RLS
-- ============================================================
-- ai_usage already has RLS enabled from migration 20260326120100_ai_usage_table.sql
-- It has:
--   "Service role full access" FOR ALL USING (true) WITH CHECK (true)
--   "Users can read own usage" FOR SELECT USING (email = jwt->>'email')
--
-- This is correct for the current use case. No changes needed.
-- Just ensure RLS is enabled (safe to call again, no-op if already enabled).
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- Performance: ensure indexes exist for RLS subquery lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_memberships_email ON public.memberships (email);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'memberships' AND column_name = 'user_email') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_memberships_user_email ON public.memberships (user_email)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_zm_exam_attempts_user_id ON public.zm_exam_attempts (user_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_zm_exam_attempts_student_email ON public.zm_exam_attempts (student_email)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_desafio_progress_user_email ON public.desafio_progress (user_email)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress (user_id)';
  END IF;
END $$;


-- ============================================================
-- Grants: ensure anon and authenticated roles have table access
-- (RLS policies control row-level visibility, but the role still
--  needs base table privileges to even query the table)
-- ============================================================
GRANT SELECT, INSERT, UPDATE ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.memberships TO anon;
GRANT SELECT, INSERT, UPDATE ON public.memberships TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
    EXECUTE 'GRANT SELECT ON public.user_progress TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'desafio_progress') THEN
    EXECUTE 'GRANT SELECT ON public.desafio_progress TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.desafio_progress TO authenticated';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_attempts') THEN
    EXECUTE 'GRANT SELECT ON public.quiz_attempts TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zm_exam_attempts') THEN
    EXECUTE 'GRANT SELECT ON public.zm_exam_attempts TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.zm_exam_attempts TO authenticated';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    EXECUTE 'GRANT SELECT ON public.certificates TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated';
  END IF;
END $$;


-- ============================================================
-- VERIFICATION (run manually after applying):
-- ============================================================
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN (
--   'users', 'memberships', 'user_progress', 'desafio_progress',
--   'quiz_attempts', 'zm_exam_attempts', 'certificates', 'ai_usage'
-- )
-- ORDER BY tablename, policyname;
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'users', 'memberships', 'user_progress', 'desafio_progress',
--     'quiz_attempts', 'zm_exam_attempts', 'certificates', 'ai_usage'
--   );
-- ============================================================

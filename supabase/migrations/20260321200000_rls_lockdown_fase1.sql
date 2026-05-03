-- ============================================================
-- FASE 1.4: RLS Lockdown — Replace USING(true) with auth-based policies
-- ============================================================
-- IMPORTANT: users.id is gen_random_uuid(), NOT auth.uid().
-- We use auth.jwt()->>'email' to match users by email.
-- service_role bypasses RLS, so Edge Functions are unaffected.
-- ============================================================

-- Helper: reusable function to get the custom user ID from JWT email
CREATE OR REPLACE FUNCTION public.my_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.users WHERE email = (auth.jwt() ->> 'email') LIMIT 1;
$$;

-- ============================================================
-- 1. USERS — user can only see/update own record
-- ============================================================
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- SELECT: authenticated user sees only own record
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND email = (auth.jwt() ->> 'email')
  );

-- INSERT: authenticated user can create own record (email must match JWT)
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (email IS NULL OR email = (auth.jwt() ->> 'email'))
  );

-- UPDATE: authenticated user can update own record
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND email = (auth.jwt() ->> 'email')
  );

-- ============================================================
-- 2. USER_PROGRESS — user can only access own progress
-- ============================================================
DROP POLICY IF EXISTS "Progress read own" ON public.user_progress;
DROP POLICY IF EXISTS "Progress insert own" ON public.user_progress;
DROP POLICY IF EXISTS "Progress update own" ON public.user_progress;

CREATE POLICY "progress_select_own"
  ON public.user_progress FOR SELECT
  USING (user_id = public.my_user_id());

CREATE POLICY "progress_insert_own"
  ON public.user_progress FOR INSERT
  WITH CHECK (user_id = public.my_user_id());

CREATE POLICY "progress_update_own"
  ON public.user_progress FOR UPDATE
  USING (user_id = public.my_user_id());

-- ============================================================
-- 3. CERTIFICATES — user can only access own certificates
-- ============================================================
-- Note: migration 20260316200000 may have already modified these.
-- We drop any existing policies and recreate cleanly.
DROP POLICY IF EXISTS "Certificates read own" ON public.certificates;
DROP POLICY IF EXISTS "Certificates insert own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_select_policy" ON public.certificates;
DROP POLICY IF EXISTS "certificates_insert_policy" ON public.certificates;

CREATE POLICY "certs_select_own"
  ON public.certificates FOR SELECT
  USING (user_id = public.my_user_id());

CREATE POLICY "certs_insert_own"
  ON public.certificates FOR INSERT
  WITH CHECK (user_id = public.my_user_id());

CREATE POLICY "certs_update_own"
  ON public.certificates FOR UPDATE
  USING (user_id = public.my_user_id());

-- ============================================================
-- 4. QUIZ_ATTEMPTS — user can only access own attempts
-- ============================================================
DROP POLICY IF EXISTS "Quiz attempts read own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Quiz attempts insert own" ON public.quiz_attempts;

CREATE POLICY "quiz_select_own"
  ON public.quiz_attempts FOR SELECT
  USING (user_id = public.my_user_id());

CREATE POLICY "quiz_insert_own"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (user_id = public.my_user_id());

-- ============================================================
-- 5. MEMBERSHIPS — user can only read own membership
--    (writes are done by Edge Functions via service_role)
-- ============================================================
DROP POLICY IF EXISTS "Memberships read" ON public.memberships;

CREATE POLICY "memberships_select_own"
  ON public.memberships FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND user_id = public.my_user_id()
  );

-- ============================================================
-- 6. MARKET_PRODUCTS — keep public read, restrict writes
-- ============================================================
-- Public read is intentional (product catalog is public).
-- Writes should be admin-only. If already secured by migration
-- 20260316200000, these will be no-ops.
DROP POLICY IF EXISTS "Market products public read" ON public.market_products;
DROP POLICY IF EXISTS "Market products admin insert" ON public.market_products;
DROP POLICY IF EXISTS "Market products admin update" ON public.market_products;
DROP POLICY IF EXISTS "Market products admin delete" ON public.market_products;

CREATE POLICY "market_products_public_read"
  ON public.market_products FOR SELECT
  USING (true);  -- Intentionally public

CREATE POLICY "market_products_admin_write"
  ON public.market_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_staff
      WHERE email = (auth.jwt() ->> 'email')
        AND activo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_staff
      WHERE email = (auth.jwt() ->> 'email')
        AND activo = true
    )
  );

-- ============================================================
-- Performance: ensure index on users.email for RLS lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- ============================================================
-- VERIFICATION QUERIES (run manually to confirm)
-- ============================================================
-- SELECT schemaname, tablename, policyname, permissive, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('users','user_progress','certificates','quiz_attempts','memberships','market_products')
-- ORDER BY tablename, policyname;

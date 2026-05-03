-- ============================================================
-- FIX: Certificates table RLS — remove overly permissive anon
--   INSERT/UPDATE policies added by 20260411220000_fix_403_rls_anon_write.sql
--
-- The anon role should only have SELECT (for certificate verification).
-- Authenticated users can INSERT/UPDATE their own rows (user_id = auth.uid()).
-- Edge functions use service_role key and bypass RLS entirely.
-- ============================================================

-- 1. Drop the wide-open anon INSERT/UPDATE policies
DROP POLICY IF EXISTS "certificates_anon_insert" ON public.certificates;
DROP POLICY IF EXISTS "certificates_anon_update" ON public.certificates;
DROP POLICY IF EXISTS "certificates_anon_upsert" ON public.certificates;

-- 2. Revoke INSERT/UPDATE from anon (keep SELECT)
REVOKE INSERT, UPDATE ON public.certificates FROM anon;

-- 3. Ensure anon SELECT policy exists (for certificate verification)
-- Already created in 20260326150000_core_tables_rls.sql, but be safe:
DROP POLICY IF EXISTS "certificates_anon_select" ON public.certificates;
CREATE POLICY "certificates_anon_select"
  ON public.certificates FOR SELECT
  TO anon
  USING (true);

GRANT SELECT ON public.certificates TO anon;

-- 4. Ensure authenticated users can only INSERT/UPDATE their own certificates
-- Drop the existing broad policy first, then recreate with per-user restriction
DROP POLICY IF EXISTS "certificates_auth_all_own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_insert_own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_update_own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_select_own" ON public.certificates;

CREATE POLICY "certificates_auth_select_own"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "certificates_auth_insert_own"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "certificates_auth_update_own"
  ON public.certificates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.certificates TO authenticated;

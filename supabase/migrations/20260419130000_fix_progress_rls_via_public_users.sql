-- ============================================================
-- FIX: students see no exams/progress/certificates on maestrohvacr.com
-- ROOT CAUSE: RLS policies on user_progress / quiz_attempts /
--   certificates check `user_id = auth.uid()` — but those tables'
--   `user_id` column references `public.users.id`, which is a
--   different UUID from `auth.users.id` (auth.uid()).
--   Result: every authenticated SELECT fails RLS → UI shows empty.
-- FIX: resolve `user_id` through `public.users` by email.
--   Use a SECURITY DEFINER helper so the subquery runs with
--   bypass-RLS privileges (otherwise it would recurse into
--   public.users RLS).
-- ============================================================

-- Helper: current authenticated user's public.users.id (by email)
CREATE OR REPLACE FUNCTION public.current_public_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT id FROM public.users
  WHERE lower(email) = lower(auth.jwt() ->> 'email')
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.current_public_user_id() TO authenticated, anon;

-- ----- user_progress -----
DROP POLICY IF EXISTS "user_progress_auth_all_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_auth_select_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_auth_insert_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_auth_update_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_auth_delete_own" ON public.user_progress;

CREATE POLICY "user_progress_auth_select_own"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (user_id = public.current_public_user_id());

CREATE POLICY "user_progress_auth_insert_own"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.current_public_user_id());

CREATE POLICY "user_progress_auth_update_own"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (user_id = public.current_public_user_id())
  WITH CHECK (user_id = public.current_public_user_id());

CREATE POLICY "user_progress_auth_delete_own"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING (user_id = public.current_public_user_id());

-- ----- quiz_attempts -----
DROP POLICY IF EXISTS "quiz_attempts_auth_all_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_auth_select_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_auth_insert_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_auth_update_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_auth_delete_own" ON public.quiz_attempts;

CREATE POLICY "quiz_attempts_auth_select_own"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = public.current_public_user_id());

CREATE POLICY "quiz_attempts_auth_insert_own"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.current_public_user_id());

CREATE POLICY "quiz_attempts_auth_update_own"
  ON public.quiz_attempts FOR UPDATE
  TO authenticated
  USING (user_id = public.current_public_user_id())
  WITH CHECK (user_id = public.current_public_user_id());

CREATE POLICY "quiz_attempts_auth_delete_own"
  ON public.quiz_attempts FOR DELETE
  TO authenticated
  USING (user_id = public.current_public_user_id());

-- ----- certificates -----
DROP POLICY IF EXISTS "Users can read own certificates" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_update_own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_select_own" ON public.certificates;
DROP POLICY IF EXISTS "certificates_auth_insert_own" ON public.certificates;

CREATE POLICY "certificates_auth_select_own"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (user_id = public.current_public_user_id());

CREATE POLICY "certificates_auth_insert_own"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.current_public_user_id());

CREATE POLICY "certificates_auth_update_own"
  ON public.certificates FOR UPDATE
  TO authenticated
  USING (user_id = public.current_public_user_id())
  WITH CHECK (user_id = public.current_public_user_id());

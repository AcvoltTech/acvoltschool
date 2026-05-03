-- ============================================================
-- FIX: students can't see their exams/progress on maestrohvacr.com
-- ROOT CAUSE: migration 20260418140000 restricted users SELECT to
--   `email = auth.jwt()->>'email'` (case-sensitive, exact match).
--   Many rows in public.users have mixed-case emails (e.g. typed
--   "Juan@Gmail.com" at signup) while auth.jwt() returns lowercase.
--   Result: the row exists, but the student can't SELECT it, so
--   every JOIN-by-user_id downstream (quiz_attempts, user_progress,
--   certificates) returns empty — looks like progress was wiped.
-- FIX: case-insensitive comparison on both sides. Data is not
--   touched; only the read filter is relaxed.
-- ============================================================

DROP POLICY IF EXISTS "users_auth_select" ON public.users;
DROP POLICY IF EXISTS "users_auth_insert" ON public.users;
DROP POLICY IF EXISTS "users_auth_update" ON public.users;

CREATE POLICY "users_auth_select"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(auth.jwt() ->> 'email')
    OR email IS NULL
  );

CREATE POLICY "users_auth_insert"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (
    email IS NULL
    OR lower(email) = lower(auth.jwt() ->> 'email')
  );

CREATE POLICY "users_auth_update"
  ON public.users FOR UPDATE
  TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'))
  WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));

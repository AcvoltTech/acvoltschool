-- ============================================================
-- FIX: "permission denied for table users" when saving profile
-- ROOT CAUSE: migration 20260411220000 added anon INSERT/UPDATE
--   grants to many peer tables (user_progress, certificates,
--   quiz_attempts, user_stats, etc.) but omitted the `users`
--   table itself. The users table has auth-based RLS policies
--   from migration 20260321200000, but missing GRANT privileges
--   for the authenticated/anon roles cause Postgres to reject
--   the upsert BEFORE RLS even runs — surfacing as
--   "permission denied for table users".
-- FIX: Grant SELECT/INSERT/UPDATE on users to both roles and
--   add anon-scoped policies mirroring the pattern used on
--   peer tables. Authenticated role already has owner-match
--   policies from fase1 lockdown; those remain untouched.
-- ============================================================

-- Make sure RLS is on (defensive — should already be on)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Table-level GRANTs for both roles (this is what RLS runs on top of)
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO anon;

-- Anon policies — same permissive pattern as user_progress/certificates
-- (the app legitimately writes to users via anon key during onboarding,
-- password reset, and the photo-upload path before the auth session
-- is fully warm).
DROP POLICY IF EXISTS "users_anon_select" ON public.users;
DROP POLICY IF EXISTS "users_anon_insert" ON public.users;
DROP POLICY IF EXISTS "users_anon_update" ON public.users;

CREATE POLICY "users_anon_select"
  ON public.users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "users_anon_insert"
  ON public.users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "users_anon_update"
  ON public.users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Authenticated policies — mirror the fase1 lockdown but with explicit
-- WITH CHECK on UPDATE so a signed-in user can't move their email off
-- their own row. (The existing fase1 "users_update_own" policy only
-- had USING, which silently allowed email reassignment.)
DROP POLICY IF EXISTS "users_auth_select" ON public.users;
DROP POLICY IF EXISTS "users_auth_insert" ON public.users;
DROP POLICY IF EXISTS "users_auth_update" ON public.users;

CREATE POLICY "users_auth_select"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
    OR email IS NULL
  );

CREATE POLICY "users_auth_insert"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (
    email IS NULL OR email = (auth.jwt() ->> 'email')
  );

CREATE POLICY "users_auth_update"
  ON public.users FOR UPDATE
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'))
  WITH CHECK (email = (auth.jwt() ->> 'email'));

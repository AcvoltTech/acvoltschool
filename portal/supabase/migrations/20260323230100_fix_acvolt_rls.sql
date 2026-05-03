-- ============================================================
-- FASE 2: RLS Lockdown — ACVOLT certification tables,
-- access_codes, stream_chat_bans, stream_moderators
-- ============================================================
-- PROBLEM: These tables all had USING(true) policies allowing
-- ANY authenticated user to read/write ALL rows. Students could
-- see other students' quiz attempts, create fake certificates,
-- ban users from chat, or assign moderator privileges.
--
-- FIX: Proper per-user + admin policies on every table.
-- service_role bypasses RLS, so Edge Functions are unaffected.
-- ============================================================

-- Admin check helper (reusable in comments — inlined in policies)
-- EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
-- OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)

-- ============================================================
-- 1. ACVOLT_PROGRESS — student sees own, admin sees all
-- ============================================================

-- Drop the old permissive policy
DROP POLICY IF EXISTS "manage_progress" ON public.acvolt_progress;

-- SELECT: own rows OR admin
CREATE POLICY "acvolt_progress_select"
  ON public.acvolt_progress FOR SELECT
  USING (
    user_email = (auth.jwt() ->> 'email')
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- INSERT: only own rows
CREATE POLICY "acvolt_progress_insert"
  ON public.acvolt_progress FOR INSERT
  WITH CHECK (
    user_email = (auth.jwt() ->> 'email')
  );

-- UPDATE: only own rows
CREATE POLICY "acvolt_progress_update"
  ON public.acvolt_progress FOR UPDATE
  USING (
    user_email = (auth.jwt() ->> 'email')
  );

-- DELETE: admin only
CREATE POLICY "acvolt_progress_delete"
  ON public.acvolt_progress FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- 2. ACVOLT_QUIZ_ATTEMPTS — student sees own, admin sees all
-- ============================================================

-- Drop the old permissive policy
DROP POLICY IF EXISTS "manage_attempts" ON public.acvolt_quiz_attempts;

-- SELECT: own rows OR admin
CREATE POLICY "acvolt_attempts_select"
  ON public.acvolt_quiz_attempts FOR SELECT
  USING (
    user_email = (auth.jwt() ->> 'email')
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- INSERT: only own attempts
CREATE POLICY "acvolt_attempts_insert"
  ON public.acvolt_quiz_attempts FOR INSERT
  WITH CHECK (
    user_email = (auth.jwt() ->> 'email')
  );

-- DELETE: admin only
CREATE POLICY "acvolt_attempts_delete"
  ON public.acvolt_quiz_attempts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- 3. ACVOLT_CERTIFICATES — student sees own, admin sees all
-- ============================================================

-- Drop the old permissive policies
DROP POLICY IF EXISTS "read_certs" ON public.acvolt_certificates;
DROP POLICY IF EXISTS "insert_certs" ON public.acvolt_certificates;

-- SELECT: own rows OR admin
CREATE POLICY "acvolt_certs_select"
  ON public.acvolt_certificates FOR SELECT
  USING (
    user_email = (auth.jwt() ->> 'email')
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- INSERT: only if user_email matches JWT (no fake certs)
CREATE POLICY "acvolt_certs_insert"
  ON public.acvolt_certificates FOR INSERT
  WITH CHECK (
    user_email = (auth.jwt() ->> 'email')
  );

-- DELETE: admin only
CREATE POLICY "acvolt_certs_delete"
  ON public.acvolt_certificates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- 4. ACCESS_CODES — authenticated can read unused & redeem;
--    admin can do everything
-- ============================================================

-- Drop the old permissive policies
DROP POLICY IF EXISTS "anon_can_validate_codes" ON public.access_codes;
DROP POLICY IF EXISTS "anon_can_redeem_codes" ON public.access_codes;

-- SELECT: authenticated users see unused codes (for validation);
--         admin sees all codes
CREATE POLICY "access_codes_select"
  ON public.access_codes FOR SELECT
  USING (
    (auth.role() = 'authenticated' AND used = false)
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: authenticated users can redeem unused codes only;
--         admin can update any code
CREATE POLICY "access_codes_update"
  ON public.access_codes FOR UPDATE
  USING (
    (auth.role() = 'authenticated' AND used = false)
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- INSERT: admin only
CREATE POLICY "access_codes_insert"
  ON public.access_codes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "access_codes_delete"
  ON public.access_codes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- 5. STREAM_CHAT_BANS — admin only (all operations)
-- ============================================================

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Allow all on stream_chat_bans" ON public.stream_chat_bans;

-- SELECT: admin only (+ moderators need to check bans for enforcement)
CREATE POLICY "stream_chat_bans_select"
  ON public.stream_chat_bans FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
    OR EXISTS (SELECT 1 FROM stream_moderators WHERE user_email = (auth.jwt() ->> 'email'))
  );

-- INSERT: admin only
CREATE POLICY "stream_chat_bans_insert"
  ON public.stream_chat_bans FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: admin only
CREATE POLICY "stream_chat_bans_update"
  ON public.stream_chat_bans FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "stream_chat_bans_delete"
  ON public.stream_chat_bans FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- 6. STREAM_MODERATORS — admin only (all operations)
-- ============================================================

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Allow all on stream_moderators" ON public.stream_moderators;

-- SELECT: admin only (moderators can also see the list for UI)
CREATE POLICY "stream_moderators_select"
  ON public.stream_moderators FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
    OR EXISTS (SELECT 1 FROM stream_moderators WHERE user_email = (auth.jwt() ->> 'email'))
  );

-- INSERT: admin only
CREATE POLICY "stream_moderators_insert"
  ON public.stream_moderators FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: admin only
CREATE POLICY "stream_moderators_update"
  ON public.stream_moderators FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "stream_moderators_delete"
  ON public.stream_moderators FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ============================================================
-- Performance: indexes for RLS subquery lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_admin_students_email ON public.admin_students (email);
CREATE INDEX IF NOT EXISTS idx_admin_staff_email_activo ON public.admin_staff (email, activo);
CREATE INDEX IF NOT EXISTS idx_stream_moderators_email ON public.stream_moderators (user_email);

-- ============================================================
-- Grants: ensure authenticated role can read admin lookup tables
-- (needed for RLS subqueries to work)
-- ============================================================
GRANT SELECT ON public.admin_students TO authenticated;
GRANT SELECT ON public.admin_staff TO authenticated;
GRANT SELECT ON public.stream_moderators TO authenticated;

-- ============================================================
-- VERIFICATION (run manually to confirm):
-- ============================================================
-- SELECT schemaname, tablename, policyname, permissive, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN (
--   'acvolt_progress','acvolt_quiz_attempts','acvolt_certificates',
--   'access_codes','stream_chat_bans','stream_moderators'
-- )
-- ORDER BY tablename, policyname;

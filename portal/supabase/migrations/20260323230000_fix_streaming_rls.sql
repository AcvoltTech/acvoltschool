-- ============================================================
-- Migration: Fix Streaming RLS Policies
-- Date: 2026-03-23
-- Purpose: Replace overly-permissive USING(true) policies on
--          all 5 streaming tables with proper auth-based policies.
--          Admin = admin_students OR active admin_staff.
--          service_role bypasses RLS, so Edge Functions unaffected.
-- ============================================================

-- ============================================================
-- HELPER: Reusable admin check expression used throughout.
-- A user is admin if their JWT email appears in admin_students
-- OR in admin_staff with activo = true.
-- ============================================================
-- (Used inline in policies below — no function needed)

-- ############################################################
-- 1. LIVE_STREAMS
--    SELECT: any authenticated user (streams are discoverable)
--    INSERT/UPDATE/DELETE: admin only
-- ############################################################

-- Ensure RLS is enabled
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing permissive policies
DROP POLICY IF EXISTS "read" ON live_streams;
DROP POLICY IF EXISTS "insert" ON live_streams;
DROP POLICY IF EXISTS "update" ON live_streams;
DROP POLICY IF EXISTS "delete" ON live_streams;
DROP POLICY IF EXISTS "live_streams_select" ON live_streams;
DROP POLICY IF EXISTS "live_streams_insert" ON live_streams;
DROP POLICY IF EXISTS "live_streams_update" ON live_streams;
DROP POLICY IF EXISTS "live_streams_delete" ON live_streams;

-- SELECT: authenticated users can discover all streams
CREATE POLICY "live_streams_select"
  ON live_streams FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: admin only (scheduling new streams)
CREATE POLICY "live_streams_insert"
  ON live_streams FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: admin only (starting/ending streams, updating status)
CREATE POLICY "live_streams_update"
  ON live_streams FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only (removing streams)
CREATE POLICY "live_streams_delete"
  ON live_streams FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ############################################################
-- 2. STREAM_RECORDINGS
--    SELECT: authenticated users can read visible=true recordings;
--            admins can see ALL recordings (including hidden ones)
--    INSERT/UPDATE/DELETE: admin only
-- ############################################################

ALTER TABLE stream_recordings ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing permissive policies
DROP POLICY IF EXISTS "read" ON stream_recordings;
DROP POLICY IF EXISTS "insert" ON stream_recordings;
DROP POLICY IF EXISTS "update" ON stream_recordings;
DROP POLICY IF EXISTS "delete" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_select" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_insert" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_update" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_delete" ON stream_recordings;

-- SELECT: authenticated users see visible recordings; admins see all
CREATE POLICY "stream_recordings_select"
  ON stream_recordings FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      -- Students can only see visible recordings
      visible = true
      -- Admins can see all recordings (including hidden/draft)
      OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
      OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
    )
  );

-- INSERT: admin only (creating recording entries from Cloudflare webhook)
CREATE POLICY "stream_recordings_insert"
  ON stream_recordings FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: admin only (toggling visible, is_free, adding transcript)
CREATE POLICY "stream_recordings_update"
  ON stream_recordings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "stream_recordings_delete"
  ON stream_recordings FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ############################################################
-- 3. STREAM_CHAT_MESSAGES
--    SELECT: authenticated users can read messages for any stream
--    INSERT: authenticated users can post, but user_email must match JWT
--    UPDATE: admin only (for moderation — deleting/flagging messages)
--    DELETE: admin only
-- ############################################################

ALTER TABLE stream_chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing permissive policies
DROP POLICY IF EXISTS "read" ON stream_chat_messages;
DROP POLICY IF EXISTS "insert" ON stream_chat_messages;
DROP POLICY IF EXISTS "Allow update deleted on stream_chat_messages" ON stream_chat_messages;
DROP POLICY IF EXISTS "update" ON stream_chat_messages;
DROP POLICY IF EXISTS "delete" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_select" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_insert" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_update" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_delete" ON stream_chat_messages;

-- SELECT: any authenticated user can read chat messages
CREATE POLICY "stream_chat_select"
  ON stream_chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: authenticated users can post their own messages only
-- (user_email must match the JWT email to prevent impersonation)
CREATE POLICY "stream_chat_insert"
  ON stream_chat_messages FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND user_email = (auth.jwt() ->> 'email')
  );

-- UPDATE: admin only (moderation — soft-delete, flagging)
CREATE POLICY "stream_chat_update"
  ON stream_chat_messages FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "stream_chat_delete"
  ON stream_chat_messages FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ############################################################
-- 4. STREAM_ATTENDANCE
--    SELECT: admin sees all; students see only their own records
--    INSERT: authenticated users can log their own attendance
--    UPDATE: own records only (to set left_at, duration_seconds)
--    DELETE: admin only
-- ############################################################

ALTER TABLE stream_attendance ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing permissive policies
DROP POLICY IF EXISTS "Anyone can insert attendance" ON stream_attendance;
DROP POLICY IF EXISTS "Anyone can update own attendance" ON stream_attendance;
DROP POLICY IF EXISTS "Anyone can read attendance" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_select" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_insert" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_update" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_delete" ON stream_attendance;

-- SELECT: students see own attendance; admins see all
CREATE POLICY "stream_attendance_select"
  ON stream_attendance FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      -- Students can see their own attendance records
      student_email = (auth.jwt() ->> 'email')
      -- Admins can see all attendance records
      OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
      OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
    )
  );

-- INSERT: authenticated users can log their own attendance
-- (student_email must match JWT to prevent spoofing)
CREATE POLICY "stream_attendance_insert"
  ON stream_attendance FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND student_email = (auth.jwt() ->> 'email')
  );

-- UPDATE: own records only (to record leave time / duration)
CREATE POLICY "stream_attendance_update"
  ON stream_attendance FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND student_email = (auth.jwt() ->> 'email')
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND student_email = (auth.jwt() ->> 'email')
  );

-- DELETE: admin only (cleanup)
CREATE POLICY "stream_attendance_delete"
  ON stream_attendance FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ############################################################
-- 5. PERMANENT_LIVE_INPUT
--    ALL operations: admin only
--    This table stores sensitive Cloudflare credentials
--    (input ID, RTMPS URL, stream key, WHIP URL).
-- ############################################################

ALTER TABLE permanent_live_input ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing permissive policies
DROP POLICY IF EXISTS "permanent_live_input_select" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_insert" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_update" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_delete" ON permanent_live_input;

-- SELECT: admin only (contains sensitive streaming credentials)
CREATE POLICY "permanent_live_input_select"
  ON permanent_live_input FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- INSERT: admin only
CREATE POLICY "permanent_live_input_insert"
  ON permanent_live_input FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- UPDATE: admin only
CREATE POLICY "permanent_live_input_update"
  ON permanent_live_input FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- DELETE: admin only
CREATE POLICY "permanent_live_input_delete"
  ON permanent_live_input FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );


-- ############################################################
-- PERFORMANCE: Ensure indexes exist for RLS subquery lookups
-- ############################################################
CREATE INDEX IF NOT EXISTS idx_admin_students_email ON admin_students (email);
CREATE INDEX IF NOT EXISTS idx_admin_staff_email ON admin_staff (email);

-- ############################################################
-- GRANT: Ensure authenticated role can read admin tables
-- (required for RLS subqueries to work)
-- ############################################################
GRANT SELECT ON admin_students TO authenticated;
GRANT SELECT ON admin_staff TO authenticated;

-- ============================================================
-- VERIFICATION: Run these queries after applying the migration
-- to confirm policies were created correctly:
--
-- SELECT schemaname, tablename, policyname, permissive, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN (
--   'live_streams', 'stream_recordings', 'stream_chat_messages',
--   'stream_attendance', 'permanent_live_input'
-- )
-- ORDER BY tablename, policyname;
-- ============================================================

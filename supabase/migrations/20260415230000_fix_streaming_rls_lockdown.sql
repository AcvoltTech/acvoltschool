-- ============================================================
-- Migration: Lock Down Overpermissive Streaming RLS
-- Date: 2026-04-15
--
-- PROBLEM: Multiple streaming tables have FOR ALL TO anon
--   USING(true) WITH CHECK(true) policies, meaning anyone
--   with the anon key can read AND write ALL streaming data
--   including sensitive Cloudflare credentials.
--
-- SOLUTION: Drop all overpermissive policies and replace them
--   with least-privilege policies. Admin writes go through
--   Edge Functions using service_role (which bypasses RLS).
--
-- Tables affected:
--   1. live_streams        - authenticated SELECT only
--   2. stream_recordings   - authenticated SELECT only
--   3. stream_attendance   - authenticated own-row SELECT/INSERT
--   4. permanent_live_input - NO anon/authenticated access (service role only)
-- ============================================================

BEGIN;

-- ============================================================
-- HELPER FUNCTION: Extract current user's email from JWT
-- Works with both standard and namespaced JWT claim formats.
-- Used by stream_attendance RLS to scope rows to the current user.
-- ============================================================
CREATE OR REPLACE FUNCTION _streaming_email() RETURNS text AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    current_setting('request.jwt.claim.email', true)
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ############################################################
-- 1. LIVE_STREAMS
--    - SELECT: authenticated users only (streams are discoverable
--      to logged-in students)
--    - INSERT/UPDATE/DELETE: service_role only (admin Edge Functions)
--    - No anon access at all
-- ############################################################

ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- Drop every known policy (accumulated across prior migrations)
DROP POLICY IF EXISTS "read"                          ON live_streams;
DROP POLICY IF EXISTS "insert"                        ON live_streams;
DROP POLICY IF EXISTS "update"                        ON live_streams;
DROP POLICY IF EXISTS "delete"                        ON live_streams;
DROP POLICY IF EXISTS "live_streams_select"           ON live_streams;
DROP POLICY IF EXISTS "live_streams_insert"           ON live_streams;
DROP POLICY IF EXISTS "live_streams_update"           ON live_streams;
DROP POLICY IF EXISTS "live_streams_delete"           ON live_streams;
DROP POLICY IF EXISTS "live_streams_anon_all"         ON live_streams;
DROP POLICY IF EXISTS "live_streams_auth_all"         ON live_streams;
DROP POLICY IF EXISTS "anon_update_live_streams"      ON live_streams;
DROP POLICY IF EXISTS "authenticated_update_live_streams" ON live_streams;
DROP POLICY IF EXISTS "anon_insert_live_streams"      ON live_streams;
DROP POLICY IF EXISTS "authenticated_insert_live_streams" ON live_streams;

-- Revoke anon grants that prior migrations added
REVOKE ALL ON live_streams FROM anon;

-- Authenticated users can discover/view streams
CREATE POLICY "live_streams_auth_select"
  ON live_streams FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies for anon or authenticated.
-- Admin operations happen via Edge Functions using service_role,
-- which bypasses RLS entirely.


-- ############################################################
-- 2. STREAM_RECORDINGS
--    - SELECT: authenticated users only
--    - INSERT/UPDATE/DELETE: service_role only (Cloudflare webhooks
--      and admin panel go through Edge Functions)
--    - No anon access
-- ############################################################

ALTER TABLE stream_recordings ENABLE ROW LEVEL SECURITY;

-- Drop every known policy
DROP POLICY IF EXISTS "read"                                ON stream_recordings;
DROP POLICY IF EXISTS "insert"                              ON stream_recordings;
DROP POLICY IF EXISTS "update"                              ON stream_recordings;
DROP POLICY IF EXISTS "delete"                              ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_select"            ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_insert"            ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_update"            ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_delete"            ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_insert"       ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_update"       ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_delete"       ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_select"       ON stream_recordings;
DROP POLICY IF EXISTS "anon_all_stream_recordings"          ON stream_recordings;
DROP POLICY IF EXISTS "authenticated_all_stream_recordings" ON stream_recordings;

-- Revoke anon grants
REVOKE ALL ON stream_recordings FROM anon;

-- Authenticated users can view recordings
CREATE POLICY "stream_recordings_auth_select"
  ON stream_recordings FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies for anon or authenticated.
-- Recording creation and management is handled by Edge Functions
-- (Cloudflare webhook handler) using service_role.


-- ############################################################
-- 3. STREAM_ATTENDANCE
--    - SELECT: authenticated users can read their OWN rows only
--      (matched by email from JWT)
--    - INSERT: authenticated users can insert their OWN rows only
--      (student_email must match JWT email to prevent spoofing)
--    - UPDATE/DELETE: service_role only (admin cleanup)
--    - No anon access
-- ############################################################

ALTER TABLE stream_attendance ENABLE ROW LEVEL SECURITY;

-- Drop every known policy
DROP POLICY IF EXISTS "Anyone can insert attendance"         ON stream_attendance;
DROP POLICY IF EXISTS "Anyone can update own attendance"     ON stream_attendance;
DROP POLICY IF EXISTS "Anyone can read attendance"           ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_select"             ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_insert"             ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_update"             ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_delete"             ON stream_attendance;
DROP POLICY IF EXISTS "anon_all_stream_attendance"           ON stream_attendance;
DROP POLICY IF EXISTS "authenticated_all_stream_attendance"  ON stream_attendance;

-- Revoke anon grants
REVOKE ALL ON stream_attendance FROM anon;

-- SELECT: authenticated users see only their own attendance records.
-- Uses _streaming_email() to extract email from JWT, matching against
-- the student_email column to enforce per-user row isolation.
CREATE POLICY "stream_attendance_auth_select_own"
  ON stream_attendance FOR SELECT
  TO authenticated
  USING (student_email = _streaming_email());

-- INSERT: authenticated users can log their own attendance only.
-- The student_email in the inserted row must match the JWT email
-- to prevent one user from spoofing attendance for another.
CREATE POLICY "stream_attendance_auth_insert_own"
  ON stream_attendance FOR INSERT
  TO authenticated
  WITH CHECK (student_email = _streaming_email());

-- No UPDATE/DELETE policies for anon or authenticated.
-- Attendance corrections and cleanup happen via service_role
-- (admin Edge Functions or direct admin queries).


-- ############################################################
-- 4. PERMANENT_LIVE_INPUT
--    - NO policies for anon or authenticated
--    - This table contains sensitive Cloudflare credentials
--      (input ID, RTMPS URL, stream key, WHIP URL)
--    - Only service_role (Edge Functions) should ever access it
-- ############################################################

ALTER TABLE permanent_live_input ENABLE ROW LEVEL SECURITY;

-- Drop every known policy
DROP POLICY IF EXISTS "permanent_live_input_select"    ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_insert"    ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_update"    ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_delete"    ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_anon_all"  ON permanent_live_input;

-- Revoke ALL grants from anon and authenticated.
-- service_role bypasses RLS, so Edge Functions are unaffected.
REVOKE ALL ON permanent_live_input FROM anon;
REVOKE ALL ON permanent_live_input FROM authenticated;

-- No policies created. With RLS enabled and zero policies,
-- only service_role can access this table (it bypasses RLS).
-- This is the correct security posture for credential storage.


-- ############################################################
-- GRANT: Ensure authenticated can still SELECT on admin lookup
-- tables (required for any future RLS subqueries that reference
-- admin_students/admin_staff). These are email-only tables.
-- ############################################################
GRANT SELECT ON admin_students TO authenticated;
GRANT SELECT ON admin_staff   TO authenticated;

-- ############################################################
-- GRANT: Ensure authenticated has the right table-level grants
-- for the policies we just created.
-- ############################################################
GRANT SELECT ON live_streams      TO authenticated;
GRANT SELECT ON stream_recordings TO authenticated;
GRANT SELECT, INSERT ON stream_attendance TO authenticated;

COMMIT;

-- ============================================================
-- VERIFICATION: After applying, run this to confirm policies:
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN (
--   'live_streams', 'stream_recordings',
--   'stream_attendance', 'permanent_live_input'
-- )
-- ORDER BY tablename, policyname;
--
-- Expected result:
--   live_streams        | live_streams_auth_select           | authenticated | SELECT
--   stream_recordings   | stream_recordings_auth_select      | authenticated | SELECT
--   stream_attendance   | stream_attendance_auth_select_own  | authenticated | SELECT
--   stream_attendance   | stream_attendance_auth_insert_own  | authenticated | INSERT
--   permanent_live_input | (no rows — service_role only)
-- ============================================================

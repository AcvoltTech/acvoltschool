-- ============================================================
-- Fix streaming tables RLS: Add anon role policies
-- ============================================================
-- CONTEXT: Admin dashboard uses anon key for all operations.
-- The previous streaming RLS migration only allowed 'authenticated',
-- blocking admin from sending chat messages, managing streams, etc.
--
-- FIX: Add permissive anon policies (same pattern as core_tables_rls).
-- ============================================================

-- ============================================================
-- 1. STREAM_CHAT_MESSAGES — allow anon INSERT/SELECT/UPDATE
-- ============================================================
DROP POLICY IF EXISTS "stream_chat_anon_select" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_anon_insert" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_anon_update" ON stream_chat_messages;
DROP POLICY IF EXISTS "stream_chat_anon_delete" ON stream_chat_messages;

CREATE POLICY "stream_chat_anon_select"
  ON stream_chat_messages FOR SELECT TO anon USING (true);

CREATE POLICY "stream_chat_anon_insert"
  ON stream_chat_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "stream_chat_anon_update"
  ON stream_chat_messages FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "stream_chat_anon_delete"
  ON stream_chat_messages FOR DELETE TO anon USING (true);

-- ============================================================
-- 2. STREAM_ATTENDANCE — allow anon SELECT/INSERT/UPDATE
-- ============================================================
DROP POLICY IF EXISTS "stream_attendance_anon_select" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_anon_insert" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_anon_update" ON stream_attendance;

CREATE POLICY "stream_attendance_anon_select"
  ON stream_attendance FOR SELECT TO anon USING (true);

CREATE POLICY "stream_attendance_anon_insert"
  ON stream_attendance FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "stream_attendance_anon_update"
  ON stream_attendance FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 3. STREAM_RECORDINGS — allow anon SELECT/INSERT/UPDATE
-- ============================================================
DROP POLICY IF EXISTS "stream_recordings_anon_select" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_insert" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_update" ON stream_recordings;

CREATE POLICY "stream_recordings_anon_select"
  ON stream_recordings FOR SELECT TO anon USING (true);

CREATE POLICY "stream_recordings_anon_insert"
  ON stream_recordings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "stream_recordings_anon_update"
  ON stream_recordings FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 4. PERMANENT_LIVE_INPUT — allow anon full access (admin only table)
-- ============================================================
DROP POLICY IF EXISTS "permanent_live_input_anon_select" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_anon_insert" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_anon_update" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_anon_delete" ON permanent_live_input;

CREATE POLICY "permanent_live_input_anon_select"
  ON permanent_live_input FOR SELECT TO anon USING (true);

CREATE POLICY "permanent_live_input_anon_insert"
  ON permanent_live_input FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "permanent_live_input_anon_update"
  ON permanent_live_input FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "permanent_live_input_anon_delete"
  ON permanent_live_input FOR DELETE TO anon USING (true);

-- ============================================================
-- 5. GRANTS — ensure anon role has table privileges
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON stream_chat_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON stream_attendance TO anon;
GRANT SELECT, INSERT, UPDATE ON stream_recordings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON permanent_live_input TO anon;

-- Also grant to authenticated for student operations
GRANT SELECT, INSERT ON stream_chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON stream_attendance TO authenticated;
GRANT SELECT ON stream_recordings TO authenticated;

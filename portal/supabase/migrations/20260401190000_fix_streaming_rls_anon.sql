-- Fix: Allow anon role full access to streaming tables
-- Admin panel uses anon key (no JWT email), so admin-only policies block uploads
-- Date: 2026-04-01

-- stream_recordings: allow anon INSERT/UPDATE/DELETE/SELECT
DROP POLICY IF EXISTS "stream_recordings_insert" ON stream_recordings;
DROP POLICY IF EXISTS "stream_recordings_anon_insert" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_insert" ON stream_recordings FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "stream_recordings_anon_update" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_update" ON stream_recordings FOR UPDATE TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "stream_recordings_anon_delete" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_delete" ON stream_recordings FOR DELETE TO anon USING (true);
DROP POLICY IF EXISTS "stream_recordings_anon_select" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_select" ON stream_recordings FOR SELECT TO anon USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON stream_recordings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON stream_recordings TO authenticated;

-- live_streams: allow anon full access
DROP POLICY IF EXISTS "live_streams_insert" ON live_streams;
DROP POLICY IF EXISTS "live_streams_update" ON live_streams;
DROP POLICY IF EXISTS "live_streams_delete" ON live_streams;
DROP POLICY IF EXISTS "live_streams_select" ON live_streams;
DROP POLICY IF EXISTS "live_streams_anon_all" ON live_streams;
CREATE POLICY "live_streams_anon_all" ON live_streams FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "live_streams_auth_all" ON live_streams;
CREATE POLICY "live_streams_auth_all" ON live_streams FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON live_streams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON live_streams TO authenticated;

-- permanent_live_input: allow anon full access
DROP POLICY IF EXISTS "permanent_live_input_select" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_insert" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_update" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_delete" ON permanent_live_input;
DROP POLICY IF EXISTS "permanent_live_input_anon_all" ON permanent_live_input;
CREATE POLICY "permanent_live_input_anon_all" ON permanent_live_input FOR ALL TO anon USING (true) WITH CHECK (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON permanent_live_input TO anon;

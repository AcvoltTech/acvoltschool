-- ============================================================
-- Fix: Allow stream_recordings without Cloudflare video UID
-- ============================================================
-- We use Supabase Storage for recordings, not Cloudflare Stream.
-- cf_video_uid was NOT NULL — blocks inserts without Cloudflare.
-- Fix: Make nullable with default 'local'.
-- ============================================================

ALTER TABLE stream_recordings ALTER COLUMN cf_video_uid DROP NOT NULL;
ALTER TABLE stream_recordings ALTER COLUMN cf_video_uid SET DEFAULT 'local';

-- Ensure anon can INSERT recordings (admin uses anon key)
DROP POLICY IF EXISTS "stream_recordings_anon_insert" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_insert"
  ON stream_recordings FOR INSERT TO anon WITH CHECK (true);

-- Ensure anon can UPDATE recordings (for visibility toggle)
DROP POLICY IF EXISTS "stream_recordings_anon_update" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_update"
  ON stream_recordings FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Ensure anon can DELETE recordings
DROP POLICY IF EXISTS "stream_recordings_anon_delete" ON stream_recordings;
CREATE POLICY "stream_recordings_anon_delete"
  ON stream_recordings FOR DELETE TO anon USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON stream_recordings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON stream_recordings TO authenticated;

-- ============================================================
-- Migration: Complete Live Streaming Tables
-- Date: 2026-03-12
-- Purpose: Create permanent_live_input table and add missing
--          columns to stream_recordings for VOD management
-- ============================================================

-- ── 1. Create permanent_live_input table ─────────────────────
-- Stores the single reusable Cloudflare live input credentials.
-- The cf-stream-proxy Edge Function uses this to avoid creating
-- a new CF input every time a stream is scheduled.
CREATE TABLE IF NOT EXISTS permanent_live_input (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cf_input_id     TEXT NOT NULL,
    rtmps_url       TEXT,
    stream_key      TEXT,
    whip_url        TEXT,
    playback_base_url TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE permanent_live_input ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (needed by admin panel via anon key)
CREATE POLICY "permanent_live_input_select"
    ON permanent_live_input FOR SELECT
    USING (true);

-- Allow insert (Edge Function uses service_role, but anon fallback)
CREATE POLICY "permanent_live_input_insert"
    ON permanent_live_input FOR INSERT
    WITH CHECK (true);

-- Allow update
CREATE POLICY "permanent_live_input_update"
    ON permanent_live_input FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ── 2. Add missing columns to stream_recordings ─────────────
-- visible: controls whether students can see the recording
-- is_free: if true, non-members can also watch (marketing/teaser)
-- transcript: AI-generated transcript text
-- quiz_questions: AI-generated quiz from recording content
-- download_url: cached Cloudflare download link
-- cf_created_at: original creation timestamp from Cloudflare

ALTER TABLE stream_recordings
    ADD COLUMN IF NOT EXISTS visible       BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_free       BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS transcript    TEXT,
    ADD COLUMN IF NOT EXISTS quiz_questions JSONB,
    ADD COLUMN IF NOT EXISTS download_url  TEXT,
    ADD COLUMN IF NOT EXISTS cf_created_at TIMESTAMPTZ;

-- ── 3. Enable Realtime on permanent_live_input ───────────────
-- (live_streams and stream_chat_messages already have realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE permanent_live_input;

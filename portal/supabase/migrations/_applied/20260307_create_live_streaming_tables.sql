-- ============================================================
-- Live Streaming Tables for Cloudflare Stream Integration
-- ============================================================

CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cf_input_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructor_email TEXT NOT NULL,
  instructor_name TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended','cancelled')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  rtmps_url TEXT,
  stream_key TEXT,
  whip_url TEXT,
  playback_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stream_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
  cf_video_uid TEXT NOT NULL,
  duration_seconds REAL,
  playback_url TEXT,
  status TEXT DEFAULT 'ready',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stream_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read/write (anon key)
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON live_streams FOR SELECT USING (true);
CREATE POLICY "insert" ON live_streams FOR INSERT WITH CHECK (true);
CREATE POLICY "update" ON live_streams FOR UPDATE USING (true);

ALTER TABLE stream_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON stream_recordings FOR SELECT USING (true);
CREATE POLICY "insert" ON stream_recordings FOR INSERT WITH CHECK (true);

ALTER TABLE stream_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON stream_chat_messages FOR SELECT USING (true);
CREATE POLICY "insert" ON stream_chat_messages FOR INSERT WITH CHECK (true);

-- Enable Realtime for chat and stream status
ALTER PUBLICATION supabase_realtime ADD TABLE stream_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE live_streams;

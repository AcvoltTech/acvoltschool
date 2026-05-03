-- Persistent multistream destinations (Restream-style)
-- Add once, auto-applies to every new stream
CREATE TABLE IF NOT EXISTS multistream_destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,         -- youtube, facebook, twitch, tiktok, instagram, custom
  platform_name TEXT NOT NULL,    -- Display name (e.g. "Mi YouTube", "Facebook ACVOLT")
  rtmp_url TEXT NOT NULL,
  stream_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE multistream_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON multistream_destinations FOR SELECT USING (true);
CREATE POLICY "insert" ON multistream_destinations FOR INSERT WITH CHECK (true);
CREATE POLICY "update" ON multistream_destinations FOR UPDATE USING (true);
CREATE POLICY "delete" ON multistream_destinations FOR DELETE USING (true);

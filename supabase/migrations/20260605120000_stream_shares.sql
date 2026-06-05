-- Stream shares tracking: logs each time a student shares the live on a social network.
-- Powers the viral gate (comparte en 3 redes para entrar) + CRM analytics (quién compartió y en qué red).
CREATE TABLE IF NOT EXISTS stream_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  student_email TEXT,
  student_name TEXT,
  platform TEXT NOT NULL,            -- 'tiktok' | 'facebook' | 'whatsapp'
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stream_shares_stream ON stream_shares(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_shares_email ON stream_shares(student_email);
CREATE INDEX IF NOT EXISTS idx_stream_shares_platform ON stream_shares(platform);

-- RLS: mirror stream_attendance — anyone can insert their own share, reads open (CRM uses service role anyway)
ALTER TABLE stream_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert shares" ON stream_shares
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read shares" ON stream_shares
  FOR SELECT USING (true);

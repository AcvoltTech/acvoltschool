-- Stream reactions: floating likes (❤️) sent by students during the live class.
-- Powers in-class engagement + CRM analytics (cuántos likes por clase).
CREATE TABLE IF NOT EXISTS stream_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  student_email TEXT,
  emoji TEXT NOT NULL DEFAULT '❤️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stream_reactions_stream ON stream_reactions(stream_id);

ALTER TABLE stream_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reactions" ON stream_reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read reactions" ON stream_reactions
  FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS stream_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  student_email TEXT,
  student_name TEXT,
  question TEXT NOT NULL,
  answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stream_questions_stream ON stream_questions(stream_id);
ALTER TABLE stream_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert questions" ON stream_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read questions" ON stream_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can update questions" ON stream_questions FOR UPDATE USING (true);

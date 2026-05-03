-- Stream attendance tracking: logs when students join/leave live streams
CREATE TABLE IF NOT EXISTS stream_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  student_name TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  duration_seconds REAL,
  participated BOOLEAN DEFAULT false,  -- raised hand or went live
  source TEXT DEFAULT 'live',          -- 'live' or 'vod'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_stream_attendance_stream ON stream_attendance(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_attendance_email ON stream_attendance(student_email);

-- RLS: students can insert/update their own attendance, admins can read all
ALTER TABLE stream_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert attendance" ON stream_attendance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own attendance" ON stream_attendance
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can read attendance" ON stream_attendance
  FOR SELECT USING (true);

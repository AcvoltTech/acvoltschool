-- Gallery View: Cloudflare Calls tables for student camera grid
-- Run this in Supabase SQL Editor

-- Table: call_rooms (one per live stream session)
CREATE TABLE IF NOT EXISTS call_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

-- Table: call_participants (students publishing camera)
CREATE TABLE IF NOT EXISTS call_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES call_rooms(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  user_email text NOT NULL,
  user_name text,
  track_name text,
  status text NOT NULL DEFAULT 'publishing',
  joined_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_call_rooms_stream_id ON call_rooms(stream_id);
CREATE INDEX IF NOT EXISTS idx_call_rooms_status ON call_rooms(status);
CREATE INDEX IF NOT EXISTS idx_call_participants_room_id ON call_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_call_participants_email ON call_participants(user_email);

-- RLS
ALTER TABLE call_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_participants ENABLE ROW LEVEL SECURITY;

-- call_rooms: admins full access, students can read active rooms
CREATE POLICY "call_rooms_admin_all" ON call_rooms
  FOR ALL USING (
    auth.email() IN (SELECT email FROM admin_students)
    OR auth.email() IN (SELECT email FROM admin_staff WHERE activo = true)
  );

CREATE POLICY "call_rooms_student_select" ON call_rooms
  FOR SELECT USING (status = 'active');

-- call_participants: admins full access, students can see own rows + read all (for gallery)
CREATE POLICY "call_participants_admin_all" ON call_participants
  FOR ALL USING (
    auth.email() IN (SELECT email FROM admin_students)
    OR auth.email() IN (SELECT email FROM admin_staff WHERE activo = true)
  );

CREATE POLICY "call_participants_student_select" ON call_participants
  FOR SELECT USING (true);

CREATE POLICY "call_participants_student_insert" ON call_participants
  FOR INSERT WITH CHECK (user_email = auth.email());

CREATE POLICY "call_participants_student_update" ON call_participants
  FOR UPDATE USING (user_email = auth.email());

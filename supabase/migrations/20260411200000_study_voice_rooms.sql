-- Study Voice Rooms: maps each study module to a 100ms room ID
CREATE TABLE IF NOT EXISTS study_voice_rooms (
  module       text        PRIMARY KEY,
  hms_room_id  text        NOT NULL,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE study_voice_rooms ENABLE ROW LEVEL SECURITY;

-- Anyone can read room mappings (needed to join voice chat)
CREATE POLICY "Anyone can read rooms" ON study_voice_rooms
  FOR SELECT USING (true);

-- Only service_role can insert/update (rooms created via Edge Function)
CREATE POLICY "Service role manages rooms" ON study_voice_rooms
  FOR ALL USING (auth.role() = 'service_role');

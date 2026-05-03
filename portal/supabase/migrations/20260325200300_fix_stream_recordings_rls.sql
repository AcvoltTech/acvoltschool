-- Fix: Allow anon/authenticated full access to stream_recordings and stream_attendance
CREATE POLICY "anon_all_stream_recordings" ON stream_recordings
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_stream_recordings" ON stream_recordings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_all_stream_attendance" ON stream_attendance
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_stream_attendance" ON stream_attendance
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT ALL ON stream_recordings TO anon, authenticated;
GRANT ALL ON stream_attendance TO anon, authenticated;

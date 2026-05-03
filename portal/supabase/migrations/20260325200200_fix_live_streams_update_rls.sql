-- Fix: Allow anon and authenticated to UPDATE live_streams
-- The 100ms integration updates stream status directly from the browser
-- (Previously routed through an Edge Function with service_role key)
CREATE POLICY "anon_update_live_streams" ON live_streams
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_update_live_streams" ON live_streams
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Also ensure INSERT works (for creating new streams from admin panel)
CREATE POLICY "anon_insert_live_streams" ON live_streams
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "authenticated_insert_live_streams" ON live_streams
  FOR INSERT TO authenticated WITH CHECK (true);

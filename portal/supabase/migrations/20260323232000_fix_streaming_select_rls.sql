-- ============================================================
-- FIX: Streaming SELECT policies were too strict.
-- They required auth.role() = 'authenticated', which blocks
-- users whose JWT expired (session falls to anon role).
--
-- Streams and visible recordings are PUBLIC content — there's
-- no reason to gate read access behind authentication.
-- Chat messages during live streams are also public.
--
-- Admin-only operations (INSERT/UPDATE/DELETE) remain unchanged.
-- ============================================================

-- 1. LIVE_STREAMS SELECT — public (streams are discoverable)
DROP POLICY IF EXISTS "live_streams_select" ON live_streams;
CREATE POLICY "live_streams_select"
  ON live_streams FOR SELECT
  USING (true);

-- 2. STREAM_RECORDINGS SELECT — visible=true is public; admin sees all
DROP POLICY IF EXISTS "stream_recordings_select" ON stream_recordings;
CREATE POLICY "stream_recordings_select"
  ON stream_recordings FOR SELECT
  USING (
    visible = true
    OR EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- 3. STREAM_CHAT_MESSAGES SELECT — public (chat is readable by anyone)
DROP POLICY IF EXISTS "stream_chat_select" ON stream_chat_messages;
CREATE POLICY "stream_chat_select"
  ON stream_chat_messages FOR SELECT
  USING (true);

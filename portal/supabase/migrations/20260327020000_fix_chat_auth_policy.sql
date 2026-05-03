-- ============================================================
-- Fix: Allow authenticated users to send chat messages
-- ============================================================
-- The previous policy required user_email = JWT email, but
-- admin code uses sessionStorage email and student code uses
-- localStorage email, which may not match the JWT.
-- Fix: allow any authenticated user to INSERT chat messages.
-- ============================================================

-- Drop the restrictive policy
DROP POLICY IF EXISTS "stream_chat_insert" ON stream_chat_messages;

-- New: any authenticated user can insert chat messages
CREATE POLICY "stream_chat_auth_insert"
  ON stream_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also fix SELECT for authenticated (ensure they can read all messages)
DROP POLICY IF EXISTS "stream_chat_select" ON stream_chat_messages;

CREATE POLICY "stream_chat_auth_select"
  ON stream_chat_messages FOR SELECT
  TO authenticated
  USING (true);

-- Fix UPDATE for authenticated (allow admin moderation)
DROP POLICY IF EXISTS "stream_chat_update" ON stream_chat_messages;

CREATE POLICY "stream_chat_auth_update"
  ON stream_chat_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- Fix DELETE for authenticated
DROP POLICY IF EXISTS "stream_chat_delete" ON stream_chat_messages;

CREATE POLICY "stream_chat_auth_delete"
  ON stream_chat_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
    OR EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email') AND activo = true)
  );

-- Also fix stream_attendance for authenticated
DROP POLICY IF EXISTS "stream_attendance_insert" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_select" ON stream_attendance;
DROP POLICY IF EXISTS "stream_attendance_update" ON stream_attendance;

CREATE POLICY "stream_attendance_auth_select"
  ON stream_attendance FOR SELECT TO authenticated USING (true);

CREATE POLICY "stream_attendance_auth_insert"
  ON stream_attendance FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "stream_attendance_auth_update"
  ON stream_attendance FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

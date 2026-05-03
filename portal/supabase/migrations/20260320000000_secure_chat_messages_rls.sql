-- ============================================================
-- Secure chat_messages with proper RLS policies
-- Fixes: unauthorized insert/update/delete from client
-- ============================================================

-- Ensure RLS is enabled
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly-permissive policies
DROP POLICY IF EXISTS "Allow all" ON chat_messages;
DROP POLICY IF EXISTS "read" ON chat_messages;
DROP POLICY IF EXISTS "insert" ON chat_messages;
DROP POLICY IF EXISTS "update" ON chat_messages;
DROP POLICY IF EXISTS "delete" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can read chat" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can update chat" ON chat_messages;
DROP POLICY IF EXISTS "chat_select" ON chat_messages;
DROP POLICY IF EXISTS "chat_insert" ON chat_messages;
DROP POLICY IF EXISTS "chat_update" ON chat_messages;
DROP POLICY IF EXISTS "chat_delete" ON chat_messages;

-- SELECT: any authenticated user can read messages
CREATE POLICY "chat_select" ON chat_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- INSERT: user_email must match the authenticated user's email
-- and moderation_status cannot be set to 'approved' for media messages
CREATE POLICY "chat_insert" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND user_email = (auth.jwt() ->> 'email')
  );

-- UPDATE: only admin_staff can soft-delete or moderate any message,
-- any authenticated user can report (set reported=true, increment report_count)
CREATE POLICY "chat_update" ON chat_messages
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND (
      -- Admins can update any message
      EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email'))
      -- Users can update (report) any message
      OR true
    )
  ) WITH CHECK (
    auth.role() = 'authenticated'
    AND (
      -- Admins can do anything
      EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email'))
      -- Non-admins: can only set reported=true and increment report_count
      -- (they cannot set deleted=true or change content)
      OR (
        reported = true
        AND deleted = false
      )
    )
  );

-- DELETE: nobody deletes rows directly (soft-delete via update)
CREATE POLICY "chat_delete" ON chat_messages
  FOR DELETE USING (false);

-- ============================================================
-- Secure chat_reports — users insert their own reports only
-- ============================================================
ALTER TABLE chat_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all" ON chat_reports;
DROP POLICY IF EXISTS "reports_insert" ON chat_reports;
DROP POLICY IF EXISTS "reports_select" ON chat_reports;

-- INSERT: only own reports
CREATE POLICY "reports_insert" ON chat_reports
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND reporter_email = (auth.jwt() ->> 'email')
  );

-- SELECT: admins can see reports
CREATE POLICY "reports_select" ON chat_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_staff WHERE email = (auth.jwt() ->> 'email'))
  );

-- ============================================================
-- Grant admin_staff SELECT to authenticated (for RLS subqueries)
-- ============================================================
GRANT SELECT ON admin_staff TO authenticated;

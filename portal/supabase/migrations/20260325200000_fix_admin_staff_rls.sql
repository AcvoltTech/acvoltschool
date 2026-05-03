-- Fix: Allow anon role to SELECT from admin_staff
-- Needed because RLS policies on live_streams (and other tables) reference admin_staff
-- Without this, any UPDATE on live_streams fails with "permission denied for table admin_staff"
CREATE POLICY "anon_select_admin_staff" ON admin_staff
  FOR SELECT TO anon USING (true);

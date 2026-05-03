-- Fix: Grant SELECT on admin_staff to anon and authenticated roles
-- Without this, RLS policies on other tables that reference admin_staff fail with "permission denied"
GRANT SELECT ON admin_staff TO anon;
GRANT SELECT ON admin_staff TO authenticated;

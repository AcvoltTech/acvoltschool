-- Fix #5: admin_students table should NOT be publicly readable
-- Previously: USING (true) allowed anyone to enumerate admin emails
-- Now: Only service_role can read admin tables directly

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can read admin_students" ON admin_students;

-- Create restrictive policy: only authenticated admins can read their own row
CREATE POLICY "Admins can read own row"
  ON admin_students FOR SELECT
  USING (auth.email() = email);

-- Also lock down admin_staff if it has a similar permissive policy
DROP POLICY IF EXISTS "Anyone can read admin_staff" ON admin_staff;

CREATE POLICY "Staff can read own row"
  ON admin_staff FOR SELECT
  USING (auth.email() = email);

-- Revoke direct anon access (edge functions use service_role key anyway)
REVOKE SELECT ON admin_students FROM anon;
REVOKE SELECT ON admin_staff FROM anon;

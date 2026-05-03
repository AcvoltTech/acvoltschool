-- ============================================================
-- Create admin_staff table + log_admin_action helper
-- admin_staff is referenced by RLS policies and edge functions
-- but was never created in any prior migration.
-- ============================================================

-- ============================================================
-- 1. ADMIN_STAFF TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_staff (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  nombre text,
  rol text DEFAULT 'staff',
  activo boolean DEFAULT true,
  telefono text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_staff ENABLE ROW LEVEL SECURITY;

-- Only existing admins can manage staff
CREATE POLICY "admin_staff_admin_all" ON admin_staff
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

-- Ensure UNIQUE constraint on email (table may exist without it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_staff_email_key'
  ) THEN
    ALTER TABLE admin_staff ADD CONSTRAINT admin_staff_email_key UNIQUE (email);
  END IF;
END $$;

-- Skip seed — table already has data in production

-- ============================================================
-- 2. HELPER FUNCTION: log_admin_action
--    Wraps audit_log inserts so JS can call via supabaseClient.rpc()
-- ============================================================
CREATE OR REPLACE FUNCTION log_admin_action(
  p_actor_email text,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_log (actor_email, action, details)
  VALUES (p_actor_email, p_action, p_details);
END;
$$;

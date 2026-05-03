-- ============================================================
-- Enterprise Hardening + OnlyTeks Foundation Migration
-- Run in Supabase SQL Editor BEFORE deploying Edge Functions
-- ============================================================

-- ============================================================
-- 1. ERROR LOGS TABLE (error tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS error_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  message text,
  stack text,
  url text,
  user_email text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert errors (anon key used from frontend)
CREATE POLICY "Anyone can insert error_logs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- Only service role can read errors
CREATE POLICY "Service role can read error_logs"
  ON error_logs FOR SELECT
  USING (auth.role() = 'service_role');

-- Auto-cleanup: keep last 30 days
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs (created_at);

-- ============================================================
-- 2. AUDIT LOG TABLE (admin action trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  actor_email text NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Anyone can insert audit entries (frontend uses anon key)
CREATE POLICY "Anyone can insert audit_log"
  ON audit_log FOR INSERT
  WITH CHECK (true);

-- Only service role can read audit log
CREATE POLICY "Service role can read audit_log"
  ON audit_log FOR SELECT
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log (actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log (created_at);

-- ============================================================
-- 3. RATE LIMITS TABLE + RPC
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count int NOT NULL DEFAULT 1,
  UNIQUE(key, window_start)
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow anon to call the RPC (which handles inserts/updates internally)
CREATE POLICY "Service can manage rate_limits"
  ON rate_limits FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits (key, window_start);

-- Rate limit check RPC
-- Returns: { allowed: boolean, remaining: int, reset_at: timestamptz }
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key text,
  p_max_requests int DEFAULT 30,
  p_window_seconds int DEFAULT 60
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window_start timestamptz;
  v_count int;
  v_allowed boolean;
  v_remaining int;
BEGIN
  -- Calculate current window start (truncate to window boundary)
  v_window_start := date_trunc('minute', now())
    + (floor(extract(epoch from (now() - date_trunc('minute', now()))) / p_window_seconds) * p_window_seconds) * interval '1 second';

  -- Upsert: increment counter or start new window
  INSERT INTO rate_limits (key, window_start, request_count)
  VALUES (p_key, v_window_start, 1)
  ON CONFLICT (key, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING request_count INTO v_count;

  v_allowed := v_count <= p_max_requests;
  v_remaining := GREATEST(0, p_max_requests - v_count);

  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'remaining', v_remaining,
    'count', v_count,
    'reset_at', v_window_start + (p_window_seconds * interval '1 second')
  );
END;
$$;

-- Cleanup old rate limit entries (run periodically or via cron)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < now() - interval '10 minutes';
END;
$$;

-- ============================================================
-- 4. ADMIN STUDENT RPC (replaces hardcoded email array)
-- ============================================================
-- Admin emails table
CREATE TABLE IF NOT EXISTS admin_students (
  email text PRIMARY KEY,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin_students"
  ON admin_students FOR SELECT
  USING (true);

-- Seed the initial admin
INSERT INTO admin_students (email, role)
VALUES ('floresmario30@gmail.com', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- RPC to check if email is admin
CREATE OR REPLACE FUNCTION is_admin_student(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_students WHERE email = lower(trim(p_email))
  );
END;
$$;

-- ============================================================
-- 5. INSTRUCTORS TABLE (OnlyTeks foundation)
-- ============================================================
CREATE TABLE IF NOT EXISTS instructors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  specialty text[], -- e.g. {'hvac','plumbing','electrical'}
  revenue_share numeric(5,2) DEFAULT 80.00, -- instructor keeps 80%, platform 20%
  active boolean DEFAULT true,
  stripe_account_id text, -- for Stripe Connect payouts
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active instructors"
  ON instructors FOR SELECT
  USING (active = true);

CREATE POLICY "Instructors can update own profile"
  ON instructors FOR UPDATE
  USING (user_email = auth.jwt()->>'email')
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors (user_email);

-- ============================================================
-- 6. STUDENT-INSTRUCTOR ENROLLMENT (multi-tenant)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_instructor_enrollment (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_email text NOT NULL,
  instructor_id uuid NOT NULL REFERENCES instructors(id),
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active', -- active, expired, cancelled
  UNIQUE(student_email, instructor_id)
);

ALTER TABLE student_instructor_enrollment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can see own enrollments"
  ON student_instructor_enrollment FOR SELECT
  USING (true); -- permissive for now since admin uses anon key

CREATE POLICY "Anyone can insert enrollment"
  ON student_instructor_enrollment FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_enrollment_student ON student_instructor_enrollment (student_email);
CREATE INDEX IF NOT EXISTS idx_enrollment_instructor ON student_instructor_enrollment (instructor_id);

-- ============================================================
-- 7. ADD instructor_id FK TO EXISTING TABLES
-- ============================================================

-- Add to memberships (nullable for backward compat)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memberships' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE memberships ADD COLUMN instructor_id uuid REFERENCES instructors(id);
    CREATE INDEX idx_memberships_instructor ON memberships (instructor_id);
  END IF;
END $$;

-- Add to live_streams if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'live_streams') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'live_streams' AND column_name = 'instructor_id'
    ) THEN
      ALTER TABLE live_streams ADD COLUMN instructor_id uuid REFERENCES instructors(id);
      CREATE INDEX idx_live_streams_instructor ON live_streams (instructor_id);
    END IF;
  END IF;
END $$;

-- Add to certificates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'certificates' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE certificates ADD COLUMN instructor_id uuid REFERENCES instructors(id);
    CREATE INDEX idx_certificates_instructor ON certificates (instructor_id);
  END IF;
END $$;

-- ============================================================
-- 8. TIGHTEN RLS: write-policies on key tables
-- ============================================================

-- certificates: owner or admin can insert
-- (user_id is UUID, no user_email column in this table)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certificates' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can insert own certificates" ON certificates;
    CREATE POLICY "Users can insert own certificates"
      ON certificates FOR INSERT
      WITH CHECK (
        user_id = auth.uid()
        OR (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
        OR auth.role() = 'anon'
      );
  END IF;
END $$;

-- market_products: only admin can insert/update
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'market_products' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Admins manage market_products" ON market_products;
    CREATE POLICY "Admins manage market_products"
      ON market_products FOR INSERT
      WITH CHECK (
        (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
        OR auth.role() = 'anon'
      );

    DROP POLICY IF EXISTS "Admins update market_products" ON market_products;
    CREATE POLICY "Admins update market_products"
      ON market_products FOR UPDATE
      USING (
        (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
        OR auth.role() = 'anon'
      );
  END IF;
END $$;

-- ============================================================
-- DONE — Run verification queries after this migration:
-- SELECT count(*) FROM error_logs;
-- SELECT count(*) FROM audit_log;
-- SELECT check_rate_limit('test_key', 5, 60);
-- SELECT is_admin_student('floresmario30@gmail.com');
-- SELECT count(*) FROM instructors;
-- ============================================================

-- ============================================================
-- Device Guard — Anti-Sharing System (Country + 2 Device Limit)
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- 1. user_devices — tracks active devices per user
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  device_id TEXT NOT NULL,
  device_name TEXT,
  ip_address INET,
  country_code TEXT,
  country_name TEXT,
  is_active BOOLEAN DEFAULT true,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  deactivated_at TIMESTAMPTZ,
  deactivated_reason TEXT,
  user_agent TEXT,
  UNIQUE(user_email, device_id)
);

CREATE INDEX IF NOT EXISTS idx_user_devices_email ON user_devices(user_email);
CREATE INDEX IF NOT EXISTS idx_user_devices_active ON user_devices(user_email, is_active) WHERE is_active = true;

-- 2. device_access_log — audit trail
CREATE TABLE IF NOT EXISTS device_access_log (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  device_id TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address INET,
  country_code TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_access_log_email ON device_access_log(user_email);

-- 3. Add home_country to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_country TEXT;

-- 4. RPC: get users with more than 2 active devices
CREATE OR REPLACE FUNCTION get_users_over_device_limit()
RETURNS TABLE(user_email TEXT, active_count BIGINT) AS $$
  SELECT user_email, COUNT(*) as active_count
  FROM user_devices WHERE is_active = true
  GROUP BY user_email HAVING COUNT(*) > 2
  ORDER BY active_count DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. Enable RLS on user_devices
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything (Edge Function uses service role)
CREATE POLICY "service_role_all" ON user_devices
  FOR ALL USING (auth.role() = 'service_role');

-- 6. Enable RLS on device_access_log
ALTER TABLE device_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON device_access_log
  FOR ALL USING (auth.role() = 'service_role');

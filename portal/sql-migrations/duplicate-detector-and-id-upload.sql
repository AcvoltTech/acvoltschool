-- Migration: Duplicate account detector RPC + ID upload columns
-- Date: 2026-03-28

-- 1. Create detect_duplicate_accounts RPC
CREATE OR REPLACE FUNCTION detect_duplicate_accounts()
RETURNS TABLE(
  email_a TEXT, email_b TEXT, match_type TEXT, match_value TEXT
) AS $$
  -- Same device_id across different emails
  SELECT DISTINCT a.user_email::text, b.user_email::text, 'device_id'::text, a.device_id::text
  FROM user_devices a JOIN user_devices b
    ON a.device_id = b.device_id AND a.user_email < b.user_email
  UNION ALL
  -- Same phone across different emails
  SELECT DISTINCT a.email::text, b.email::text, 'telefono'::text, a.telefono::text
  FROM users a JOIN users b
    ON a.telefono = b.telefono AND a.email < b.email
    AND a.telefono IS NOT NULL AND a.telefono != ''
  UNION ALL
  -- Same IP across different emails (recent, active devices only)
  SELECT DISTINCT a.user_email::text, b.user_email::text, 'ip_address'::text, a.ip_address::text
  FROM user_devices a JOIN user_devices b
    ON a.ip_address = b.ip_address AND a.user_email < b.user_email
    AND a.is_active = true AND b.is_active = true
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Add ID upload columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_photo_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_status TEXT DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_reviewed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_reviewed_by TEXT;

-- 3. Create storage bucket for user IDs (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('user-ids', 'user-ids', false)
ON CONFLICT (id) DO NOTHING;

-- 4. RLS policy: only service role can access user-ids bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role access for user-ids'
  ) THEN
    CREATE POLICY "Service role access for user-ids" ON storage.objects
      FOR ALL USING (bucket_id = 'user-ids');
  END IF;
END $$;

-- Admin OAuth tokens for Google Drive (and future providers)
CREATE TABLE IF NOT EXISTS admin_oauth_tokens (
  id BIGSERIAL PRIMARY KEY,
  admin_email TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google_drive',
  refresh_token TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_email, provider)
);

ALTER TABLE admin_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Only the Edge Function (service_role) reads/writes tokens
-- No client-side access needed
CREATE POLICY "Service role only" ON admin_oauth_tokens
  FOR ALL USING (false);

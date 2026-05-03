-- Track AI tutor usage per student for server-side rate limiting
-- Free tier: 5 questions per week
-- Drop legacy table if it exists with wrong schema (no data to preserve)
DROP TABLE IF EXISTS ai_usage CASCADE;
CREATE TABLE ai_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  action text NOT NULL DEFAULT 'chat',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for efficient weekly count queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_email_created
  ON ai_usage(email, created_at DESC);

-- RLS: service role can insert/read, students can read their own
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role (Edge Functions) full access
CREATE POLICY "Service role full access" ON ai_usage
  FOR ALL USING (true) WITH CHECK (true);

-- Allow authenticated users to read their own usage
CREATE POLICY "Users can read own usage" ON ai_usage
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Auto-cleanup: delete records older than 30 days (optional, keeps table small)
-- This can be run as a cron job or pg_cron

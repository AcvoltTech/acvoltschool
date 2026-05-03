-- ============================================================
-- Analytics Events — lightweight event tracking for admin analytics
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  screen TEXT,
  user_email TEXT,
  metadata JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ae_event ON analytics_events (event);
CREATE INDEX IF NOT EXISTS idx_ae_created ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_email ON analytics_events (user_email);
CREATE INDEX IF NOT EXISTS idx_ae_session ON analytics_events (session_id);

-- RLS: anyone can insert (client tracking), only admin can read
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ae_insert" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Admin read via RPC (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION get_analytics_events(p_since timestamptz, p_event text DEFAULT NULL)
RETURNS SETOF analytics_events
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT * FROM analytics_events
  WHERE created_at >= p_since
    AND (p_event IS NULL OR event = p_event)
  ORDER BY created_at DESC
  LIMIT 10000;
$$;

-- Aggregate: screen view counts by period
CREATE OR REPLACE FUNCTION get_screen_analytics(p_since timestamptz)
RETURNS TABLE(screen text, view_count bigint, unique_users bigint)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT screen, COUNT(*) as view_count, COUNT(DISTINCT user_email) as unique_users
  FROM analytics_events
  WHERE event = 'screen_view' AND created_at >= p_since AND screen IS NOT NULL
  GROUP BY screen
  ORDER BY view_count DESC;
$$;

-- Aggregate: session durations
CREATE OR REPLACE FUNCTION get_session_durations(p_since timestamptz)
RETURNS TABLE(user_email text, session_id text, duration_seconds bigint, started_at timestamptz)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT
    user_email,
    session_id,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))::bigint as duration_seconds,
    MIN(created_at) as started_at
  FROM analytics_events
  WHERE session_id IS NOT NULL AND created_at >= p_since
  GROUP BY user_email, session_id
  HAVING COUNT(*) > 1
  ORDER BY started_at DESC
  LIMIT 500;
$$;

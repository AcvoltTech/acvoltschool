-- ============================================
-- SOCIAL SYSTEM TABLES — Maestro HVACR
-- user_presence, friendships, job_listings, study_sessions, help_events
-- 2026-04-11
-- ============================================

-- 1. user_presence — live presence tracking
CREATE TABLE IF NOT EXISTS user_presence (
  user_email TEXT PRIMARY KEY,
  user_name TEXT,
  screen TEXT,
  module TEXT,
  module_label TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_presence_live ON user_presence (is_live, last_seen);

ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read presence" ON user_presence FOR SELECT USING (true);
CREATE POLICY "Users manage own presence" ON user_presence FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');
CREATE POLICY "Users update own presence" ON user_presence FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
CREATE POLICY "Users delete own presence" ON user_presence FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- 2. friendships — friend requests and connections
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_email TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (requester_email, receiver_email)
);
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships (requester_email);
CREATE INDEX IF NOT EXISTS idx_friendships_receiver ON friendships (receiver_email);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships (status);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own friendships" ON friendships FOR SELECT USING (
  requester_email = current_setting('request.jwt.claims', true)::json->>'email'
  OR receiver_email = current_setting('request.jwt.claims', true)::json->>'email'
);
CREATE POLICY "Users send friend requests" ON friendships FOR INSERT WITH CHECK (
  requester_email = current_setting('request.jwt.claims', true)::json->>'email'
);
CREATE POLICY "Users update own friendships" ON friendships FOR UPDATE USING (
  requester_email = current_setting('request.jwt.claims', true)::json->>'email'
  OR receiver_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- 3. job_listings — job board
CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seeking_work', 'hiring')),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  certifications TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  pay_range TEXT,
  contact_method TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON job_listings (active, type, created_at DESC);

ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active jobs" ON job_listings FOR SELECT USING (active = true);
CREATE POLICY "Users manage own jobs" ON job_listings FOR INSERT WITH CHECK (
  poster_email = current_setting('request.jwt.claims', true)::json->>'email'
);
CREATE POLICY "Users update own jobs" ON job_listings FOR UPDATE USING (
  poster_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- 4. study_sessions — collaborative study
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_email TEXT NOT NULL,
  module TEXT NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  current_question_idx INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_study_sessions_active ON study_sessions (is_active, module);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active sessions" ON study_sessions FOR SELECT USING (is_active = true);
CREATE POLICY "Host manages session" ON study_sessions FOR INSERT WITH CHECK (
  host_email = current_setting('request.jwt.claims', true)::json->>'email'
);
CREATE POLICY "Host updates session" ON study_sessions FOR UPDATE USING (
  host_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- 5. help_events — XP for helping others
CREATE TABLE IF NOT EXISTS help_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_email TEXT NOT NULL,
  helped_email TEXT NOT NULL,
  module TEXT,
  xp_awarded INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_help_helper ON help_events (helper_email);

ALTER TABLE help_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own help events" ON help_events FOR SELECT USING (
  helper_email = current_setting('request.jwt.claims', true)::json->>'email'
  OR helped_email = current_setting('request.jwt.claims', true)::json->>'email'
);
CREATE POLICY "Users insert help events" ON help_events FOR INSERT WITH CHECK (
  helped_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- RPC: award_help_xp — SECURITY DEFINER to update helper's XP
CREATE OR REPLACE FUNCTION award_help_xp(p_helper_email TEXT, p_amount INT DEFAULT 50)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find the helper's user_id from auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_helper_email LIMIT 1;
  IF v_user_id IS NULL THEN RETURN; END IF;
  -- Update user_stats XP
  UPDATE user_stats SET xp = xp + p_amount, updated_at = NOW() WHERE user_id = v_user_id;
  -- Insert help event
  INSERT INTO help_events (helper_email, helped_email, module, xp_awarded)
  VALUES (p_helper_email, current_setting('request.jwt.claims', true)::json->>'email', '', p_amount);
END;
$$;

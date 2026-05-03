-- ============================================================
-- Migration: Gamification System Tables
-- Date: 2026-04-11
-- Description: user_streaks, user_stats, study_progress,
--              tool_usage, video_watches, user_achievements
--              + leaderboard_top materialized view
-- ============================================================

-- ===========================================
-- 1. user_streaks — persistent streak tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id        uuid        PRIMARY KEY REFERENCES auth.users(id),
  current_streak int         DEFAULT 0,
  longest_streak int         DEFAULT 0,
  last_active    date        DEFAULT current_date,
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streak"
  ON user_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- 2. user_stats — XP + level tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id         uuid        PRIMARY KEY REFERENCES auth.users(id),
  xp              int         DEFAULT 0,
  level           int         DEFAULT 1,
  questions_total int         DEFAULT 0,
  questions_correct int       DEFAULT 0,
  modules_completed int       DEFAULT 0,
  tools_used      int         DEFAULT 0,
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own stats"
  ON user_stats FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- 3. study_progress — per-module quiz tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS study_progress (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id),
  module      text        NOT NULL,
  category    text,
  correct     int         DEFAULT 0,
  total       int         DEFAULT 0,
  best_pct    numeric(5,2) DEFAULT 0,
  attempts    int         DEFAULT 1,
  last_at     timestamptz DEFAULT now(),
  UNIQUE(user_id, module, category)
);

ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own study_progress"
  ON study_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_study_progress_user ON study_progress(user_id);
CREATE INDEX idx_study_progress_module ON study_progress(user_id, module);

-- ===========================================
-- 4. tool_usage — tool open tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS tool_usage (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id),
  tool_name   text        NOT NULL,
  used_at     timestamptz DEFAULT now()
);

ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tool_usage"
  ON tool_usage FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_tool_usage_user ON tool_usage(user_id);

-- ===========================================
-- 5. video_watches — video consumption tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS video_watches (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id),
  video_id    text        NOT NULL,
  duration_s  int         DEFAULT 0,
  watched_at  timestamptz DEFAULT now()
);

ALTER TABLE video_watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own video_watches"
  ON video_watches FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_video_watches_user ON video_watches(user_id);

-- ===========================================
-- 6. user_achievements — badges/achievements
-- ===========================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id),
  badge_id    text        NOT NULL,
  earned_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own achievements"
  ON user_achievements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_achievements_user ON user_achievements(user_id);

-- ===========================================
-- 7. Leaderboard view — Desafío certificates + avg score
-- ===========================================
CREATE OR REPLACE VIEW leaderboard_top AS
SELECT
  dp.user_email as email,
  COALESCE(
    (SELECT u.nombre FROM users u WHERE u.email = dp.user_email LIMIT 1),
    split_part(dp.user_email, '@', 1)
  ) as nombre,
  COUNT(*) FILTER (WHERE dp.porcentaje >= 70 AND dp.certificate_id IS NOT NULL) as total_certificates,
  ROUND(AVG(dp.porcentaje)::numeric, 1) as avg_score,
  COUNT(*) as total_attempts,
  COALESCE(
    (SELECT s.current_streak FROM user_streaks s JOIN users u2 ON s.user_id = u2.auth_id WHERE u2.email = dp.user_email LIMIT 1),
    0
  ) as current_streak,
  COALESCE(
    (SELECT st.xp FROM user_stats st JOIN users u3 ON st.user_id = u3.auth_id WHERE u3.email = dp.user_email LIMIT 1),
    0
  ) as total_xp,
  RANK() OVER (
    ORDER BY COUNT(*) FILTER (WHERE dp.porcentaje >= 70 AND dp.certificate_id IS NOT NULL) DESC,
    AVG(dp.porcentaje) DESC
  ) as ranking
FROM desafio_progress dp
WHERE dp.user_email != 'floresmario30@gmail.com'
GROUP BY dp.user_email
HAVING COUNT(*) FILTER (WHERE dp.porcentaje >= 70 AND dp.certificate_id IS NOT NULL) > 0
ORDER BY total_certificates DESC, avg_score DESC
LIMIT 100;

-- Grant read access to the view
GRANT SELECT ON leaderboard_top TO authenticated;
GRANT SELECT ON leaderboard_top TO anon;

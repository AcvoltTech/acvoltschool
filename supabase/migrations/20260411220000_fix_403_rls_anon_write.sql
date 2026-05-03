-- ============================================================
-- FIX: 403 errors on user_progress, certificates, quiz_attempts
-- ROOT CAUSE: App uses anon key but these tables only have
--   anon SELECT policies. INSERT/UPDATE (upsert) fails with 403.
-- FIX: Add anon INSERT/UPDATE policies + grants (same pattern as users table)
-- ALSO: Fix study_sessions and ai_usage broken current_setting() policies
-- ============================================================

-- ============================================================
-- 1. USER_PROGRESS — add anon write policies
-- ============================================================
DROP POLICY IF EXISTS "user_progress_anon_insert" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_anon_update" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_anon_upsert" ON public.user_progress;

CREATE POLICY "user_progress_anon_insert"
  ON public.user_progress FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "user_progress_anon_update"
  ON public.user_progress FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT INSERT, UPDATE ON public.user_progress TO anon;

-- ============================================================
-- 2. CERTIFICATES — add anon write policies
-- ============================================================
DROP POLICY IF EXISTS "certificates_anon_insert" ON public.certificates;
DROP POLICY IF EXISTS "certificates_anon_update" ON public.certificates;
DROP POLICY IF EXISTS "certificates_anon_upsert" ON public.certificates;

CREATE POLICY "certificates_anon_insert"
  ON public.certificates FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "certificates_anon_update"
  ON public.certificates FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT INSERT, UPDATE ON public.certificates TO anon;

-- ============================================================
-- 3. QUIZ_ATTEMPTS — add anon write policies
-- ============================================================
DROP POLICY IF EXISTS "quiz_attempts_anon_insert" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_anon_update" ON public.quiz_attempts;

CREATE POLICY "quiz_attempts_anon_insert"
  ON public.quiz_attempts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "quiz_attempts_anon_update"
  ON public.quiz_attempts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT INSERT, UPDATE ON public.quiz_attempts TO anon;

-- ============================================================
-- 4. STUDY_SESSIONS — fix broken current_setting() policies
-- ============================================================
DROP POLICY IF EXISTS "Anyone reads active sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Host manages session" ON public.study_sessions;
DROP POLICY IF EXISTS "Host updates session" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_anon_select" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_anon_insert" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_anon_update" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_auth_select" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_auth_insert" ON public.study_sessions;
DROP POLICY IF EXISTS "study_sessions_auth_update" ON public.study_sessions;

-- Anon: full access (app uses anon key)
CREATE POLICY "study_sessions_anon_select"
  ON public.study_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "study_sessions_anon_insert"
  ON public.study_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "study_sessions_anon_update"
  ON public.study_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Authenticated: full access
CREATE POLICY "study_sessions_auth_select"
  ON public.study_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "study_sessions_auth_insert"
  ON public.study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "study_sessions_auth_update"
  ON public.study_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.study_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.study_sessions TO authenticated;

-- ============================================================
-- 5. AI_USAGE — fix broken current_setting() policy
-- ============================================================
DROP POLICY IF EXISTS "Users can read own usage" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_anon_select" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_anon_insert" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_auth_select" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_auth_insert" ON public.ai_usage;

-- Anon: SELECT + INSERT (app tracks AI usage via anon key)
CREATE POLICY "ai_usage_anon_select"
  ON public.ai_usage FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "ai_usage_anon_insert"
  ON public.ai_usage FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated: SELECT + INSERT
CREATE POLICY "ai_usage_auth_select"
  ON public.ai_usage FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "ai_usage_auth_insert"
  ON public.ai_usage FOR INSERT
  TO authenticated
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.ai_usage TO anon;
GRANT SELECT, INSERT ON public.ai_usage TO authenticated;

-- ============================================================
-- 6. GAMIFICATION TABLES — add anon policies
--    (user_streaks, user_stats, study_progress, tool_usage,
--     video_watches, user_achievements use auth.uid() which
--     fails for anon key)
-- ============================================================

-- user_achievements (badges)
DROP POLICY IF EXISTS "user_achievements_anon_select" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_anon_insert" ON public.user_achievements;
DROP POLICY IF EXISTS "user_achievements_anon_update" ON public.user_achievements;

CREATE POLICY "user_achievements_anon_select"
  ON public.user_achievements FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "user_achievements_anon_insert"
  ON public.user_achievements FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "user_achievements_anon_update"
  ON public.user_achievements FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.user_achievements TO anon;

-- user_streaks
DROP POLICY IF EXISTS "user_streaks_anon_select" ON public.user_streaks;
DROP POLICY IF EXISTS "user_streaks_anon_insert" ON public.user_streaks;
DROP POLICY IF EXISTS "user_streaks_anon_update" ON public.user_streaks;

CREATE POLICY "user_streaks_anon_select"
  ON public.user_streaks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "user_streaks_anon_insert"
  ON public.user_streaks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "user_streaks_anon_update"
  ON public.user_streaks FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.user_streaks TO anon;

-- user_stats
DROP POLICY IF EXISTS "user_stats_anon_select" ON public.user_stats;
DROP POLICY IF EXISTS "user_stats_anon_insert" ON public.user_stats;
DROP POLICY IF EXISTS "user_stats_anon_update" ON public.user_stats;

CREATE POLICY "user_stats_anon_select"
  ON public.user_stats FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "user_stats_anon_insert"
  ON public.user_stats FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "user_stats_anon_update"
  ON public.user_stats FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.user_stats TO anon;

-- study_progress
DROP POLICY IF EXISTS "study_progress_anon_select" ON public.study_progress;
DROP POLICY IF EXISTS "study_progress_anon_insert" ON public.study_progress;
DROP POLICY IF EXISTS "study_progress_anon_update" ON public.study_progress;

CREATE POLICY "study_progress_anon_select"
  ON public.study_progress FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "study_progress_anon_insert"
  ON public.study_progress FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "study_progress_anon_update"
  ON public.study_progress FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.study_progress TO anon;

-- tool_usage
DROP POLICY IF EXISTS "tool_usage_anon_select" ON public.tool_usage;
DROP POLICY IF EXISTS "tool_usage_anon_insert" ON public.tool_usage;
DROP POLICY IF EXISTS "tool_usage_anon_update" ON public.tool_usage;

CREATE POLICY "tool_usage_anon_select"
  ON public.tool_usage FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "tool_usage_anon_insert"
  ON public.tool_usage FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "tool_usage_anon_update"
  ON public.tool_usage FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.tool_usage TO anon;

-- video_watches
DROP POLICY IF EXISTS "video_watches_anon_select" ON public.video_watches;
DROP POLICY IF EXISTS "video_watches_anon_insert" ON public.video_watches;
DROP POLICY IF EXISTS "video_watches_anon_update" ON public.video_watches;

CREATE POLICY "video_watches_anon_select"
  ON public.video_watches FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "video_watches_anon_insert"
  ON public.video_watches FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "video_watches_anon_update"
  ON public.video_watches FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.video_watches TO anon;

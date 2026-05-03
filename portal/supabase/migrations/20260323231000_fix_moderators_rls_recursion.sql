-- ============================================================
-- FIX: stream_moderators SELECT policy had self-referential
-- check causing infinite recursion → PostgreSQL 500 error.
--
-- The old policy checked: "OR EXISTS (SELECT 1 FROM
-- stream_moderators WHERE ...)" inside stream_moderators' own
-- RLS, creating a recursive loop.
--
-- Fix: Allow all authenticated users to read moderator list.
-- The list only contains emails — not sensitive data — and
-- students already need to check if they are moderators
-- (for chat moderation features).
-- ============================================================

-- Drop the broken self-referential policy
DROP POLICY IF EXISTS "stream_moderators_select" ON public.stream_moderators;

-- New policy: any authenticated user can read moderator list
CREATE POLICY "stream_moderators_select"
  ON public.stream_moderators FOR SELECT
  USING (auth.role() = 'authenticated');

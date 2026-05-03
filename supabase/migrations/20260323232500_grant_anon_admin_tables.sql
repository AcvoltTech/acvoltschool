-- ============================================================
-- FIX: RLS policies on stream_recordings reference admin_students
-- and admin_staff in subqueries. When the user's JWT is expired
-- (anon role), PostgreSQL evaluates ALL conditions in the policy
-- even if visible=true would short-circuit. The anon role needs
-- SELECT on these lookup tables for the subqueries to work.
--
-- These tables only contain emails — not sensitive data.
-- ============================================================

GRANT SELECT ON admin_students TO anon;
GRANT SELECT ON admin_staff TO anon;
GRANT SELECT ON stream_moderators TO anon;

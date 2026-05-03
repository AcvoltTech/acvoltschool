-- ============================================================
-- FIX: Memberships RLS — allow email-based access (not just user_id)
-- Problem: Mario creates memberships with email but no user_id.
-- RLS policy only checked user_id, so paying students got paywall.
-- Now checks: user_id OR email matches JWT email.
-- ============================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "memberships_select_own" ON public.memberships;

-- New SELECT policy: match by user_id OR email
CREATE POLICY "memberships_select_own"
  ON public.memberships FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      user_id = public.my_user_id()
      OR email = (auth.jwt() ->> 'email')
    )
  );

-- Add UPDATE policy so auto-connect (setting user_id) works
DROP POLICY IF EXISTS "memberships_update_own" ON public.memberships;
CREATE POLICY "memberships_update_own"
  ON public.memberships FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND (
      user_id = public.my_user_id()
      OR email = (auth.jwt() ->> 'email')
    )
  );

-- Performance: index on email column for RLS lookups
CREATE INDEX IF NOT EXISTS idx_memberships_email ON public.memberships (email);

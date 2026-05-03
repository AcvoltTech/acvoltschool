-- ============================================================
-- FIX: Remove auth.role() = 'anon' from RLS policies
-- This migration patches 3 dangerous policies from enterprise_hardening.sql
-- that allowed anonymous (unauthenticated) users to bypass access control.
-- ============================================================

-- 1. CERTIFICATES: Remove anon access — users are authenticated via Supabase auth
--    so user_id = auth.uid() works. Admin check preserved.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certificates' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can insert own certificates" ON certificates;
    CREATE POLICY "Users can insert own certificates"
      ON certificates FOR INSERT
      WITH CHECK (
        user_id = auth.uid()
        OR (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
      );
  END IF;
END $$;

-- 2. MARKET_PRODUCTS INSERT: Remove anon access.
--    Admin operations now routed through edge functions (service role).
--    Frontend admin panel uses map-stream-uids or admin-market edge function.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'market_products' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Admins manage market_products" ON market_products;
    CREATE POLICY "Admins manage market_products"
      ON market_products FOR INSERT
      WITH CHECK (
        (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
      );

    -- 3. MARKET_PRODUCTS UPDATE: Same fix
    DROP POLICY IF EXISTS "Admins update market_products" ON market_products;
    CREATE POLICY "Admins update market_products"
      ON market_products FOR UPDATE
      USING (
        (SELECT EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt()->>'email')))
      );
  END IF;
END $$;

-- ============================================================
-- NOTE: market_products admin operations from the frontend (acvolt-market.js)
-- use the anon key which means auth.jwt()->>'email' is empty.
-- These operations must be routed through an edge function that uses
-- the service role key. The admin-market edge function handles this.
-- ============================================================

-- ============================================================
-- Admin Monitoring RPCs — Error Monitor + Web Vitals Dashboard
-- SECURITY DEFINER bypasses error_logs RLS (service_role only)
-- ============================================================

-- Get error logs for admin dashboard (excludes web-vital entries)
CREATE OR REPLACE FUNCTION get_error_logs(p_since timestamptz)
RETURNS SETOF error_logs
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT * FROM error_logs
  WHERE created_at >= p_since
    AND (metadata->>'type' IS NULL OR metadata->>'type' != 'web-vital')
  ORDER BY created_at DESC
  LIMIT 2000;
$$;

-- Get web vitals data for admin dashboard
CREATE OR REPLACE FUNCTION get_web_vitals(p_since timestamptz)
RETURNS SETOF error_logs
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT * FROM error_logs
  WHERE metadata->>'type' = 'web-vital'
    AND created_at >= p_since
  ORDER BY created_at DESC
  LIMIT 5000;
$$;

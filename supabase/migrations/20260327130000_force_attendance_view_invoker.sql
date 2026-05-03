-- Force attendance_with_names to SECURITY INVOKER
-- Postgres 15+ supports this ALTER syntax
ALTER VIEW IF EXISTS public.attendance_with_names SET (security_invoker = on);

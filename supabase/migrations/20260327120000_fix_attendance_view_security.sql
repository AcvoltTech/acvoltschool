-- Fix: attendance_with_names still has SECURITY DEFINER
-- Drop and recreate as plain view (SECURITY INVOKER by default)

DROP VIEW IF EXISTS public.attendance_with_names;

CREATE VIEW public.attendance_with_names AS
SELECT
  sa.id,
  sa.stream_id,
  sa.student_email,
  sa.joined_at,
  sa.left_at,
  sa.duration_seconds,
  COALESCE(sa.student_name, sa.student_email) AS user_name
FROM public.stream_attendance sa;

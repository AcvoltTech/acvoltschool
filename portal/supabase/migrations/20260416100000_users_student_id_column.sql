-- Add student_id and student_id_date columns to users table
-- These persist the student ID to Supabase so it survives logout/reinstall
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id_date TEXT;

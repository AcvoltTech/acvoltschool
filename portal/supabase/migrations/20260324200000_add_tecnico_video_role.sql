-- Add 'tecnico_video' to allowed roles in create_admin_staff function
-- Uses pg_get_functiondef to dynamically modify the existing function
DO $$
DECLARE
  func_text TEXT;
BEGIN
  -- Get the full CREATE FUNCTION statement
  SELECT pg_get_functiondef(p.oid) INTO func_text
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE p.proname = 'create_admin_staff' AND n.nspname = 'public';

  IF func_text IS NULL THEN
    RAISE EXCEPTION 'Function create_admin_staff not found';
  END IF;

  -- Check if tecnico_video is already in the function (idempotent)
  IF func_text LIKE '%tecnico_video%' THEN
    RAISE NOTICE 'tecnico_video role already present in create_admin_staff — skipping';
    RETURN;
  END IF;

  -- Replace CREATE FUNCTION with CREATE OR REPLACE FUNCTION
  func_text := regexp_replace(func_text, '^CREATE FUNCTION', 'CREATE OR REPLACE FUNCTION');

  -- Add tecnico_video after student_success in the role validation list
  func_text := replace(func_text,
    '''student_success'')',
    '''student_success'', ''tecnico_video'')');

  EXECUTE func_text;

  RAISE NOTICE 'Successfully added tecnico_video to create_admin_staff allowed roles';
END $$;

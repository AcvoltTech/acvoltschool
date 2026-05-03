-- Add all active admin_staff emails to admin_students
-- So edge function auth works for all staff members
INSERT INTO admin_students (email)
SELECT LOWER(TRIM(email)) FROM admin_staff
WHERE activo = true AND email IS NOT NULL AND TRIM(email) != ''
ON CONFLICT (email) DO NOTHING;

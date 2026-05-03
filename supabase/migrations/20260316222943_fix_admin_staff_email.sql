-- Fix admin_staff records that have NULL email
-- Set email from admin_students table (first admin email found)
-- This ensures the admin login can pass the email to edge functions for auth

UPDATE admin_staff
SET email = (SELECT email FROM admin_students LIMIT 1)
WHERE email IS NULL AND activo = true;

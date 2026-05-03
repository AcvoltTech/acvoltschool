-- Fix zm_exam_attempts: add missing columns + fix RLS for localStorage auth

-- 1. Add missing columns used by startStudentExam()
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS student_email TEXT;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS exam_title TEXT;

-- 2. Drop restrictive RLS policies that require auth.uid() (always NULL for localStorage auth)
DROP POLICY IF EXISTS "Users can manage own attempts" ON zm_exam_attempts;
DROP POLICY IF EXISTS "Admins can read all attempts" ON zm_exam_attempts;

-- 3. Create permissive policies (matches pattern used by zm_perf_grades, zm_perf_sessions)
CREATE POLICY "Allow read exam attempts" ON zm_exam_attempts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert exam attempts" ON zm_exam_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update exam attempts" ON zm_exam_attempts
  FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student_email ON zm_exam_attempts(student_email);

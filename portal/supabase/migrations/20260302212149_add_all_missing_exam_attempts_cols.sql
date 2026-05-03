-- Add ALL columns expected by the code to zm_exam_attempts
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS exam_id UUID;

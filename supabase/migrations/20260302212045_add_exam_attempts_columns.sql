-- Add all missing columns to zm_exam_attempts that the code expects
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]';
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS time_taken INTEGER DEFAULT 0;
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE zm_exam_attempts ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

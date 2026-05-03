ALTER TABLE zm_generated_questions ADD COLUMN IF NOT EXISTS instructor_notes TEXT DEFAULT '';
ALTER TABLE zm_generated_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

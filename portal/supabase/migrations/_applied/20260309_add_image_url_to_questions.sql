-- Add image_url column to zm_generated_questions for image-based questions
-- (identification of parts, products, components)
ALTER TABLE zm_generated_questions
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

COMMENT ON COLUMN zm_generated_questions.image_url IS 'Optional image URL for visual identification questions';

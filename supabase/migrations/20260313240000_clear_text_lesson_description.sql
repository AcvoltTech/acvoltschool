-- Clear description for text lessons since content is now in html_content
-- This prevents duplicate rendering (html_content + escaped description)
UPDATE acvolt_lessons
SET description = NULL
WHERE lesson_type = 1
  AND html_content IS NOT NULL
  AND html_content != '';

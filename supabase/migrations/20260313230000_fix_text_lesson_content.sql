-- Copy description HTML to html_content for text lessons (lesson_type=1)
UPDATE acvolt_lessons
SET html_content = description
WHERE lesson_type = 1
  AND (html_content IS NULL OR html_content = '')
  AND description IS NOT NULL
  AND description != '';

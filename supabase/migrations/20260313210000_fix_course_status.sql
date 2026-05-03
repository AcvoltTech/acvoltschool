-- Fix course status: Activate original acvolt.school courses (with real videos + quizzes)
-- and deactivate AI-generated stub courses (no video content)

-- Activate original courses from acvolt.school (have real video files + granular quizzes)
UPDATE acvolt_courses SET status = 1 WHERE id IN (1, 2, 3, 5, 6, 7);

-- Deactivate AI-generated stub courses (no video files, only lesson title stubs)
-- Courses 11, 12, 16 are duplicates of 5, 6, 7 respectively
-- Courses 8, 9, 10, 13, 14, 15 have no video content yet
UPDATE acvolt_courses SET status = 0 WHERE id IN (8, 9, 10, 11, 12, 13, 14, 15, 16);

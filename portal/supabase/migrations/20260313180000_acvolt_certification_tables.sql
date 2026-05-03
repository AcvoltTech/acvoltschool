-- =============================================
-- ACVOLT Certification Program — Supabase Schema
-- Migrated from acvolt.school MySQL (acvolt_data)
-- =============================================

-- 1. Courses (17 cursos)
CREATE TABLE IF NOT EXISTS acvolt_courses (
  id SERIAL PRIMARY KEY,
  old_id INTEGER UNIQUE,
  title TEXT NOT NULL,
  slug TEXT,
  short_description TEXT,
  description TEXT,
  logo TEXT,
  banner TEXT,
  video_intro TEXT,
  lessons_count INTEGER DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sections/Modules dentro de cada curso (105)
CREATE TABLE IF NOT EXISTS acvolt_sections (
  id SERIAL PRIMARY KEY,
  old_id INTEGER UNIQUE,
  course_id INTEGER REFERENCES acvolt_courses(id) ON DELETE CASCADE,
  old_course_id INTEGER,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1
);

-- 3. Lessons — video, texto, o quiz (427)
CREATE TABLE IF NOT EXISTS acvolt_lessons (
  id SERIAL PRIMARY KEY,
  old_id INTEGER UNIQUE,
  course_id INTEGER REFERENCES acvolt_courses(id) ON DELETE CASCADE,
  section_id INTEGER REFERENCES acvolt_sections(id) ON DELETE CASCADE,
  old_course_id INTEGER,
  old_section_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  lesson_type INTEGER DEFAULT 0,
  video_filename TEXT,
  stream_uid TEXT,
  html_content TEXT,
  duration_hours INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  quiz_question_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1
);

-- 4. Quiz questions (542 preguntas)
CREATE TABLE IF NOT EXISTS acvolt_questions (
  id SERIAL PRIMARY KEY,
  old_id INTEGER UNIQUE,
  lesson_id INTEGER REFERENCES acvolt_lessons(id) ON DELETE CASCADE,
  old_lesson_id INTEGER,
  question TEXT NOT NULL,
  question_type INTEGER DEFAULT 0,
  correct_answer_old_id INTEGER,
  status INTEGER DEFAULT 1
);

-- 5. Answer options (2,168 — ~4 por pregunta)
CREATE TABLE IF NOT EXISTS acvolt_answers (
  id SERIAL PRIMARY KEY,
  old_id INTEGER UNIQUE,
  question_id INTEGER REFERENCES acvolt_questions(id) ON DELETE CASCADE,
  old_question_id INTEGER,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  status INTEGER DEFAULT 1
);

-- 6. Student progress
CREATE TABLE IF NOT EXISTS acvolt_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  lesson_id INTEGER REFERENCES acvolt_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  video_seconds_watched INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_email, lesson_id)
);

-- 7. Quiz attempts
CREATE TABLE IF NOT EXISTS acvolt_quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  lesson_id INTEGER REFERENCES acvolt_lessons(id),
  correct_count INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Certificates
CREATE TABLE IF NOT EXISTS acvolt_certificates (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  course_id INTEGER REFERENCES acvolt_courses(id),
  certificate_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_acvolt_lessons_course ON acvolt_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_acvolt_lessons_section ON acvolt_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_acvolt_questions_lesson ON acvolt_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_acvolt_answers_question ON acvolt_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_acvolt_progress_email ON acvolt_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_acvolt_attempts_email ON acvolt_quiz_attempts(user_email);

-- RLS
ALTER TABLE acvolt_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_certificates ENABLE ROW LEVEL SECURITY;

-- Public read for course content
CREATE POLICY "read_courses" ON acvolt_courses FOR SELECT USING (true);
CREATE POLICY "read_sections" ON acvolt_sections FOR SELECT USING (true);
CREATE POLICY "read_lessons" ON acvolt_lessons FOR SELECT USING (true);
CREATE POLICY "read_questions" ON acvolt_questions FOR SELECT USING (true);
CREATE POLICY "read_answers" ON acvolt_answers FOR SELECT USING (true);

-- Users manage their own data
CREATE POLICY "manage_progress" ON acvolt_progress FOR ALL USING (true);
CREATE POLICY "manage_attempts" ON acvolt_quiz_attempts FOR ALL USING (true);
CREATE POLICY "read_certs" ON acvolt_certificates FOR SELECT USING (true);
CREATE POLICY "insert_certs" ON acvolt_certificates FOR INSERT WITH CHECK (true);

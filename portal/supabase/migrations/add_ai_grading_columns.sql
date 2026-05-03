-- Migración: Agregar columnas de calificación IA a submitted_tasks
-- Ejecutar en Supabase SQL Editor

ALTER TABLE submitted_tasks
  ADD COLUMN IF NOT EXISTS grade integer CHECK (grade >= 0 AND grade <= 100),
  ADD COLUMN IF NOT EXISTS ai_feedback text,
  ADD COLUMN IF NOT EXISTS ai_category_scores jsonb,
  ADD COLUMN IF NOT EXISTS ai_graded_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_override_grade integer CHECK (admin_override_grade >= 0 AND admin_override_grade <= 100),
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS has_video boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_frame_urls jsonb;

-- Índice para consultas de calificaciones por estudiante
CREATE INDEX IF NOT EXISTS idx_submitted_tasks_grade ON submitted_tasks (student_email, grade) WHERE grade IS NOT NULL;

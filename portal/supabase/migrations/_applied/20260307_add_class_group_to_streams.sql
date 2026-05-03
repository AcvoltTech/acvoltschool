-- Add class_group column to live_streams for group-based access control
ALTER TABLE live_streams ADD COLUMN IF NOT EXISTS class_group TEXT DEFAULT 'todos';

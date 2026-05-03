-- Add English subtitle URL column to tutorial_videos
ALTER TABLE tutorial_videos ADD COLUMN IF NOT EXISTS subtitle_url_en TEXT DEFAULT NULL;

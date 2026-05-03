-- Add video support to marketplace listings
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;

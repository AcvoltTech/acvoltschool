-- Add view counter to job_listings
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- RPC to increment views atomically (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE job_listings SET views = COALESCE(views, 0) + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION increment_job_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_job_views(UUID) TO authenticated;

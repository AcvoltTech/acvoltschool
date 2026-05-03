-- Add metadata JSONB column to job_listings for extra profile fields
-- (specialty, experience, tools, transport, availability, company, etc.)
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

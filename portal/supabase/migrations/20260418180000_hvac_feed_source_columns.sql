-- Add source attribution columns to hvac_daily_feed
-- Enables real-news ingestion from RSS sources (ACHR News, ACR News UK, Mundo HVACR, etc)
ALTER TABLE public.hvac_daily_feed
  ADD COLUMN IF NOT EXISTS fuente text,
  ADD COLUMN IF NOT EXISTS fuente_url text,
  ADD COLUMN IF NOT EXISTS region text;

CREATE INDEX IF NOT EXISTS idx_hvac_daily_feed_region ON public.hvac_daily_feed(region);

-- Webhook events idempotency table
-- Prevents duplicate processing of Stripe webhook events on retry
CREATE TABLE IF NOT EXISTS webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-cleanup: delete events older than 7 days (Stripe retries window is 72h)
-- Run via pg_cron or manual cleanup
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at ON webhook_events (received_at);

-- RLS: only service_role can access this table
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies = only service_role (used by Edge Functions) can read/write

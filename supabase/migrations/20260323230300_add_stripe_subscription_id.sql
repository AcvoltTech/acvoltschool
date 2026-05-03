-- Add stripe_subscription_id to memberships if not exists
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
CREATE INDEX IF NOT EXISTS idx_memberships_stripe_sub_id ON memberships(stripe_subscription_id);

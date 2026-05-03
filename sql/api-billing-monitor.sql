-- =============================================
-- API Billing Monitor — 3 Tables + Seed Data
-- Created: 2026-03-20
-- Purpose: Centralized monitoring of 10+ API/SaaS billing
-- =============================================

-- 1) api_billing_config — Per-API settings
CREATE TABLE IF NOT EXISTS api_billing_config (
  id            SERIAL PRIMARY KEY,
  api_name      TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  icon          TEXT DEFAULT '🔌',
  endpoint_url  TEXT,                         -- NULL = manual-only API
  auth_header   TEXT,                         -- e.g. 'xi-api-key', 'Authorization'
  auth_env_var  TEXT,                         -- Supabase secret name for API key
  has_api       BOOLEAN DEFAULT true,
  monthly_cost  NUMERIC(10,2) DEFAULT 0,      -- Fixed monthly cost (for display/budget)
  budget_limit  NUMERIC(10,2) DEFAULT 0,      -- Max monthly budget
  warning_pct   INTEGER DEFAULT 20,           -- Alert at ≤20% remaining
  critical_pct  INTEGER DEFAULT 10,           -- Critical at ≤10% remaining
  depleted_pct  INTEGER DEFAULT 2,            -- Depleted at ≤2% remaining
  auto_recharge_enabled  BOOLEAN DEFAULT false,
  auto_recharge_amount   NUMERIC(10,2) DEFAULT 0,
  notify_email   BOOLEAN DEFAULT true,
  notify_push    BOOLEAN DEFAULT true,
  notify_whatsapp BOOLEAN DEFAULT false,
  check_interval_hours INTEGER DEFAULT 6,
  is_active      BOOLEAN DEFAULT true,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2) api_billing_snapshots — Usage snapshots (every 6h)
CREATE TABLE IF NOT EXISTS api_billing_snapshots (
  id             SERIAL PRIMARY KEY,
  api_name       TEXT NOT NULL REFERENCES api_billing_config(api_name) ON DELETE CASCADE,
  usage_current  NUMERIC DEFAULT 0,           -- Current usage (chars, mins, reqs, $)
  usage_limit    NUMERIC DEFAULT 0,           -- Plan limit
  usage_pct      NUMERIC(5,2) DEFAULT 0,      -- Percentage used (0-100)
  cost_usd       NUMERIC(10,2) DEFAULT 0,     -- Current month cost in USD
  status         TEXT DEFAULT 'ok',           -- ok | warning | critical | depleted | manual | error | unknown
  raw_response   JSONB,                       -- Full API response for debugging
  error_message  TEXT,
  snapshot_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_snap_api_time
  ON api_billing_snapshots(api_name, snapshot_at DESC);

-- 3) api_billing_events — Alerts, recharges, errors
CREATE TABLE IF NOT EXISTS api_billing_events (
  id             SERIAL PRIMARY KEY,
  api_name       TEXT NOT NULL REFERENCES api_billing_config(api_name) ON DELETE CASCADE,
  event_type     TEXT NOT NULL,               -- warning | critical | depleted | recharge_success | recharge_failed | error | manual_update | config_change
  severity       TEXT DEFAULT 'info',         -- info | warning | critical
  message        TEXT NOT NULL,
  details        JSONB,
  acknowledged   BOOLEAN DEFAULT false,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_api_time
  ON api_billing_events(api_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_billing_events_unack
  ON api_billing_events(acknowledged, created_at DESC)
  WHERE acknowledged = false;

-- =============================================
-- RLS Policies
-- =============================================

ALTER TABLE api_billing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_billing_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_billing_events ENABLE ROW LEVEL SECURITY;

-- Service role (Edge Functions) can do everything
CREATE POLICY "service_role_all_config" ON api_billing_config
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_snapshots" ON api_billing_snapshots
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_events" ON api_billing_events
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Seed Data — 10 APIs
-- =============================================

INSERT INTO api_billing_config (api_name, display_name, icon, has_api, monthly_cost, budget_limit, auth_env_var, notes) VALUES
  ('cloudflare',    'Cloudflare',       '☁️', true,    0,    50,   'CF_API_TOKEN',        'Workers + Stream. Usage-based. Workers KV hitting 1K req/day limit.'),
  ('elevenlabs',    'ElevenLabs',       '🔊', true,  330,   350,  'ELEVENLABS_API_KEY',   'Scale plan. 996,930 flexible credits/mo. $330/mo.'),
  ('anthropic',     'Anthropic Claude', '🧠', false,  50,   100,  'ANTHROPIC_API_KEY',    'No billing API. Manual entry from console.anthropic.com.'),
  ('heygen',        'HeyGen',           '🎥', true,    0,    50,  'HEYGEN_API_KEY',       'Pro plan. Video credits remaining via API.'),
  ('supabase',      'Supabase',         '⚡', true,   25,    50,  'SUPABASE_MGMT_TOKEN',  'Pro plan. DB rows, storage, bandwidth, Edge invocations.'),
  ('netlify',       'Netlify',          '🌐', true,    0,    50,  'NETLIFY_TOKEN',        'Credits-based. 50% of 3,000 credits used.'),
  ('runway',        'Runway AI',        '🎬', false,  95,   100,  NULL,                   'Unlimited plan $95/mo. No public billing API.'),
  ('resend',        'Resend',           '📧', true,   40,    50,  'RESEND_API_KEY',       'Marketing Pro $40/mo. Count emails vs plan limit.'),
  ('deepgram',      'Deepgram',         '🎙️', true,    0,    30,  'DEEPGRAM_API_KEY',     'New signup. Minutes/characters usage.'),
  ('google_ai',     'Google AI Studio', '🤖', false,   0,    30,  NULL,                   'Usage-based. Manual entry. Billing caps coming Apr 2026.')
ON CONFLICT (api_name) DO NOTHING;

-- =============================================
-- Updated_at trigger
-- =============================================

CREATE OR REPLACE FUNCTION update_billing_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_billing_config_updated ON api_billing_config;
CREATE TRIGGER trg_billing_config_updated
  BEFORE UPDATE ON api_billing_config
  FOR EACH ROW EXECUTE FUNCTION update_billing_config_timestamp();

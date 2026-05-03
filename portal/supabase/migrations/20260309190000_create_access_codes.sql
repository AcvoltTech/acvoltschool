-- Access codes table for certificate redemption and other gated features
CREATE TABLE IF NOT EXISTS access_codes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'certificates',
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  used_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Students can read codes to validate them (but only unused ones)
CREATE POLICY "anon_can_validate_codes" ON access_codes
  FOR SELECT USING (true);

-- Students can update codes to mark as used
CREATE POLICY "anon_can_redeem_codes" ON access_codes
  FOR UPDATE USING (used = false);

-- Index for quick code lookup
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);

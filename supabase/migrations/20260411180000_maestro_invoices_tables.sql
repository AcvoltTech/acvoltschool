-- ============================================================
-- Migration: Maestro Invoices Tables
-- Date: 2026-04-11
-- Description: Create inv_clients, inv_orders, inv_invoices,
--              inv_expenses tables with RLS, indexes, and
--              updated_at trigger.
-- ============================================================

-- ===========================================
-- 1. updated_at trigger function (idempotent)
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- 2. inv_clients
-- ===========================================
CREATE TABLE inv_clients (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id),
  name        text        NOT NULL,
  phone       text,
  email       text,
  address     text,
  city        text,
  state       text,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE inv_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inv_clients"
  ON inv_clients FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_inv_clients_user_id    ON inv_clients(user_id);
CREATE INDEX idx_inv_clients_created_at ON inv_clients(created_at DESC);

CREATE TRIGGER trg_inv_clients_updated_at
  BEFORE UPDATE ON inv_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 3. inv_orders
-- ===========================================
CREATE TABLE inv_orders (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id),
  client_id     uuid        REFERENCES inv_clients(id) ON DELETE SET NULL,
  equipment     text,
  brand         text,
  model         text,
  problem       text,
  address       text,
  status        text        DEFAULT 'pending'
                            CHECK (status IN ('pending','in_progress','completed','cancelled')),
  priority      text        DEFAULT 'normal'
                            CHECK (priority IN ('low','normal','high','urgent')),
  scheduled_at  timestamptz,
  completed_at  timestamptz,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE inv_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inv_orders"
  ON inv_orders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_inv_orders_user_id    ON inv_orders(user_id);
CREATE INDEX idx_inv_orders_created_at ON inv_orders(created_at DESC);

CREATE TRIGGER trg_inv_orders_updated_at
  BEFORE UPDATE ON inv_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 4. inv_invoices
-- ===========================================
CREATE TABLE inv_invoices (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id),
  order_id        uuid          REFERENCES inv_orders(id) ON DELETE SET NULL,
  client_id       uuid          REFERENCES inv_clients(id) ON DELETE SET NULL,
  invoice_number  text,
  items           jsonb         DEFAULT '[]'::jsonb,
  subtotal        numeric(10,2) DEFAULT 0,
  tax_rate        numeric(5,2)  DEFAULT 0,
  tax             numeric(10,2) DEFAULT 0,
  total           numeric(10,2) DEFAULT 0,
  status          text          DEFAULT 'draft'
                                CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  signature_url   text,
  signed_at       timestamptz,
  due_date        date,
  paid_at         timestamptz,
  notes           text,
  created_at      timestamptz   DEFAULT now(),
  updated_at      timestamptz   DEFAULT now()
);

ALTER TABLE inv_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inv_invoices"
  ON inv_invoices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_inv_invoices_user_id    ON inv_invoices(user_id);
CREATE INDEX idx_inv_invoices_created_at ON inv_invoices(created_at DESC);

CREATE TRIGGER trg_inv_invoices_updated_at
  BEFORE UPDATE ON inv_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 5. inv_expenses
-- ===========================================
CREATE TABLE inv_expenses (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid          NOT NULL REFERENCES auth.users(id),
  category    text          DEFAULT 'other'
                            CHECK (category IN ('parts','tools','gas','insurance','marketing','other')),
  description text,
  amount      numeric(10,2) NOT NULL,
  date        date          DEFAULT current_date,
  created_at  timestamptz   DEFAULT now()
);

ALTER TABLE inv_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inv_expenses"
  ON inv_expenses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_inv_expenses_user_id    ON inv_expenses(user_id);
CREATE INDEX idx_inv_expenses_created_at ON inv_expenses(created_at DESC);

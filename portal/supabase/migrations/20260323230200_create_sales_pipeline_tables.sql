-- ============================================================
-- CREATE SALES PIPELINE TABLES: sales_reps & sales_leads
-- ============================================================
-- These tables back the CRM Pipeline (pipeline.js).
-- Previously the JS code queried these tables but they were
-- never created, causing all pipeline operations to fail silently.
-- ============================================================

-- 1. SALES_REPS — vendedores / sales representatives
CREATE TABLE IF NOT EXISTS sales_reps (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text        NOT NULL,
  email         text,
  phone         text,
  monthly_goal  numeric(10,2) DEFAULT 0,
  commission_pct numeric(5,2) DEFAULT 10,
  status        text        DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 2. SALES_LEADS — leads in the pipeline
CREATE TABLE IF NOT EXISTS sales_leads (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  phone           text,
  email           text,
  city            text,
  state           text,
  source          text        CHECK (source IN ('instagram','facebook','tiktok','youtube','whatsapp','referido','otro')),
  stage           text        NOT NULL DEFAULT 'contacto' CHECK (stage IN ('contacto','interesado','inscrito','pagado','perdido')),
  plan_interest   text,
  estimated_value numeric(10,2) DEFAULT 0,
  assigned_rep    uuid        REFERENCES sales_reps(id) ON DELETE SET NULL,
  follow_up_date  date,
  closed_date     timestamptz,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 3. INDEXES for common query patterns
CREATE INDEX IF NOT EXISTS idx_sales_leads_stage       ON sales_leads(stage);
CREATE INDEX IF NOT EXISTS idx_sales_leads_source      ON sales_leads(source);
CREATE INDEX IF NOT EXISTS idx_sales_leads_assigned_rep ON sales_leads(assigned_rep);
CREATE INDEX IF NOT EXISTS idx_sales_leads_created_at  ON sales_leads(created_at);

-- 4. AUTO-UPDATE updated_at trigger
CREATE OR REPLACE FUNCTION update_sales_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sales_reps_updated_at
  BEFORE UPDATE ON sales_reps
  FOR EACH ROW
  EXECUTE FUNCTION update_sales_updated_at();

CREATE TRIGGER trg_sales_leads_updated_at
  BEFORE UPDATE ON sales_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_sales_updated_at();

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE sales_reps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES — admin only (check admin_students table)
-- SELECT
CREATE POLICY "sales_reps_select_admin"
  ON sales_reps FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

CREATE POLICY "sales_leads_select_admin"
  ON sales_leads FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

-- INSERT
CREATE POLICY "sales_reps_insert_admin"
  ON sales_reps FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

CREATE POLICY "sales_leads_insert_admin"
  ON sales_leads FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

-- UPDATE
CREATE POLICY "sales_reps_update_admin"
  ON sales_reps FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

CREATE POLICY "sales_leads_update_admin"
  ON sales_leads FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

-- DELETE
CREATE POLICY "sales_reps_delete_admin"
  ON sales_reps FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

CREATE POLICY "sales_leads_delete_admin"
  ON sales_leads FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admin_students WHERE email = (auth.jwt() ->> 'email'))
  );

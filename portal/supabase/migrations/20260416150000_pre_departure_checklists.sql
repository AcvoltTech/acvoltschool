-- Pre-departure checklists for HVAC technicians
-- Daily PASS/FAIL checklist before leaving for job site

CREATE TABLE IF NOT EXISTS public.pre_departure_checklists (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  technician_name TEXT,
  checklist_date DATE NOT NULL,
  role TEXT DEFAULT 'driver' CHECK (role IN ('driver', 'passenger')),
  total_items INTEGER DEFAULT 0,
  passed INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  fail_details TEXT,
  checklist_data JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, checklist_date)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_pdc_email ON public.pre_departure_checklists(email);
CREATE INDEX IF NOT EXISTS idx_pdc_date ON public.pre_departure_checklists(checklist_date DESC);

-- RLS
ALTER TABLE public.pre_departure_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_pdc_select" ON public.pre_departure_checklists FOR SELECT TO anon USING (true);
CREATE POLICY "anon_pdc_insert" ON public.pre_departure_checklists FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_pdc_update" ON public.pre_departure_checklists FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "auth_pdc_all" ON public.pre_departure_checklists FOR ALL TO authenticated USING (true) WITH CHECK (true);

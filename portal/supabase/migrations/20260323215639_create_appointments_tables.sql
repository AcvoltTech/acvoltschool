-- Sales reps for round-robin appointment assignment
CREATE TABLE IF NOT EXISTS acvolt_sales_reps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text,
  email text,
  active boolean DEFAULT true,
  last_assigned_at timestamptz DEFAULT '2000-01-01',
  created_at timestamptz DEFAULT now()
);

-- Scheduled appointments
CREATE TABLE IF NOT EXISTS acvolt_appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name text NOT NULL,
  visitor_phone text NOT NULL,
  visitor_email text,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  assigned_rep_id uuid REFERENCES acvolt_sales_reps(id),
  assigned_rep_name text,
  status text DEFAULT 'pendiente' CHECK (status IN ('pendiente','confirmada','completada','cancelada')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (service role bypasses automatically)
ALTER TABLE acvolt_sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON acvolt_sales_reps FOR ALL USING (true);
CREATE POLICY "Service role full access" ON acvolt_appointments FOR ALL USING (true);

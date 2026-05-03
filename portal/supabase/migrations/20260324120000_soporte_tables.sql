-- ====== SOPORTE TICKETS ======
CREATE TABLE IF NOT EXISTS soporte_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email TEXT NOT NULL,
  student_name TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  equipment_brand TEXT,
  equipment_model TEXT,
  priority TEXT DEFAULT 'normal',
  estado TEXT DEFAULT 'abierto',
  admin_response TEXT,
  responded_by TEXT,
  responded_at TIMESTAMPTZ,
  attachment_urls TEXT[] DEFAULT '{}',
  ai_attempted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE soporte_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS soporte_tickets_read ON soporte_tickets;
CREATE POLICY soporte_tickets_read ON soporte_tickets FOR SELECT USING (true);
DROP POLICY IF EXISTS soporte_tickets_insert ON soporte_tickets;
CREATE POLICY soporte_tickets_insert ON soporte_tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS soporte_tickets_update ON soporte_tickets;
CREATE POLICY soporte_tickets_update ON soporte_tickets FOR UPDATE USING (true);

-- ====== SOPORTE MANUALS ======
CREATE TABLE IF NOT EXISTS soporte_manuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  model TEXT,
  category TEXT DEFAULT 'service',
  equipment_type TEXT,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  language TEXT DEFAULT 'es',
  requires_membership BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  uploaded_by TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE soporte_manuals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS soporte_manuals_read ON soporte_manuals;
CREATE POLICY soporte_manuals_read ON soporte_manuals FOR SELECT USING (true);
DROP POLICY IF EXISTS soporte_manuals_write ON soporte_manuals;
CREATE POLICY soporte_manuals_write ON soporte_manuals FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS soporte_manuals_update ON soporte_manuals;
CREATE POLICY soporte_manuals_update ON soporte_manuals FOR UPDATE USING (true);
DROP POLICY IF EXISTS soporte_manuals_delete ON soporte_manuals;
CREATE POLICY soporte_manuals_delete ON soporte_manuals FOR DELETE USING (true);

-- ====== SOPORTE VIDEOS ======
CREATE TABLE IF NOT EXISTS soporte_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT DEFAULT 'general',
  equipment_type TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  file_size_bytes BIGINT,
  language TEXT DEFAULT 'es',
  requires_membership BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  uploaded_by TEXT,
  active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE soporte_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS soporte_videos_read ON soporte_videos;
CREATE POLICY soporte_videos_read ON soporte_videos FOR SELECT USING (true);
DROP POLICY IF EXISTS soporte_videos_write ON soporte_videos;
CREATE POLICY soporte_videos_write ON soporte_videos FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS soporte_videos_update ON soporte_videos;
CREATE POLICY soporte_videos_update ON soporte_videos FOR UPDATE USING (true);
DROP POLICY IF EXISTS soporte_videos_delete ON soporte_videos;
CREATE POLICY soporte_videos_delete ON soporte_videos FOR DELETE USING (true);

-- Grant anon access
GRANT SELECT, INSERT, UPDATE ON soporte_tickets TO anon;
GRANT SELECT ON soporte_manuals TO anon;
GRANT SELECT ON soporte_videos TO anon;
GRANT ALL ON soporte_tickets TO service_role;
GRANT ALL ON soporte_manuals TO service_role;
GRANT ALL ON soporte_videos TO service_role;

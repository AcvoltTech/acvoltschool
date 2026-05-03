-- Acvolt.school imported data tables

CREATE TABLE IF NOT EXISTS acvolt_school_users (
  id integer PRIMARY KEY,
  name text,
  username text,
  password_hash text,
  email text,
  type integer DEFAULT 0,
  status integer DEFAULT 0,
  created_at text
);

CREATE TABLE IF NOT EXISTS acvolt_school_profiles (
  id integer PRIMARY KEY,
  user_id integer REFERENCES acvolt_school_users(id),
  name text,
  lastname text,
  phone text,
  image text
);

CREATE TABLE IF NOT EXISTS acvolt_school_progress (
  id integer PRIMARY KEY,
  profile_id integer,
  course_id integer,
  lesson_id integer,
  date text,
  status integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS acvolt_school_checks (
  id integer PRIMARY KEY,
  profile_id integer,
  course_id integer,
  lesson_id integer,
  date text,
  status integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS acvolt_school_subscriptions (
  id integer PRIMARY KEY,
  profile_id integer,
  subscription_id text,
  status integer DEFAULT 0
);

-- RLS: allow read for all, insert/update for service role
ALTER TABLE acvolt_school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_school_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_school_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE acvolt_school_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_all" ON acvolt_school_users FOR SELECT USING (true);
CREATE POLICY "insert_all" ON acvolt_school_users FOR INSERT WITH CHECK (true);
CREATE POLICY "read_all" ON acvolt_school_profiles FOR SELECT USING (true);
CREATE POLICY "insert_all" ON acvolt_school_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "read_all" ON acvolt_school_progress FOR SELECT USING (true);
CREATE POLICY "insert_all" ON acvolt_school_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "read_all" ON acvolt_school_checks FOR SELECT USING (true);
CREATE POLICY "insert_all" ON acvolt_school_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "read_all" ON acvolt_school_subscriptions FOR SELECT USING (true);
CREATE POLICY "insert_all" ON acvolt_school_subscriptions FOR INSERT WITH CHECK (true);

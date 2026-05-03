-- Fix zm_perf_grades RLS: allow insert/update for localStorage-based auth
-- The "Admins can manage" policy requires auth.uid() which is always NULL

DROP POLICY IF EXISTS "Admins can manage perf grades" ON zm_perf_grades;

CREATE POLICY "Allow insert perf grades" ON zm_perf_grades
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update perf grades" ON zm_perf_grades
  FOR UPDATE USING (true) WITH CHECK (true);

-- Keep the existing SELECT policy ("Users can read own perf grades" FOR SELECT USING true)

-- Fix: Add UPDATE policy for stream-uploads storage bucket
-- The x-upsert header requires both INSERT and UPDATE policies
CREATE POLICY "Allow stream upload updates"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'stream-uploads')
  WITH CHECK (bucket_id = 'stream-uploads');

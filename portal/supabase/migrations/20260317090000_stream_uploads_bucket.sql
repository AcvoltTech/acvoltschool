-- Create storage bucket for temporary video uploads
-- Videos are uploaded here, then Cloudflare copies from the public URL
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('stream-uploads', 'stream-uploads', true, 5368709120)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to stream-uploads bucket
CREATE POLICY "Allow stream uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'stream-uploads');

-- Allow public reads (so Cloudflare can pull the file)
CREATE POLICY "Allow stream upload reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'stream-uploads');

-- Allow deletes (cleanup after CF ingests)
CREATE POLICY "Allow stream upload deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'stream-uploads');

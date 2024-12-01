-- First, drop existing policies and bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to flashcards bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to flashcards bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to flashcards bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from flashcards bucket" ON storage.objects;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated uploads to flashcards bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'flashcards');

CREATE POLICY "Allow public access to flashcards bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'flashcards');

CREATE POLICY "Allow authenticated updates to flashcards bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'flashcards');

CREATE POLICY "Allow authenticated deletes from flashcards bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'flashcards');

-- Create and configure bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('flashcards', 'flashcards', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

UPDATE storage.buckets
SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  owner = NULL,
  public = true
WHERE id = 'flashcards';

-- Grant permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;
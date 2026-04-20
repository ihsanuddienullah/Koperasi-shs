-- Jalankan di Supabase Dashboard → SQL Editor
-- Setup storage buckets untuk foto produk dan foto toko

-- Buat buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('foto-produk', 'foto-produk', true, 2097152, ARRAY['image/jpeg','image/png','image/webp']),
  ('foto-toko', 'foto-toko', true, 2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Public read untuk kedua bucket
CREATE POLICY "Public read foto-produk"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'foto-produk');

CREATE POLICY "Public read foto-toko"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'foto-toko');

-- Authenticated users bisa upload ke folder mereka sendiri
-- Path convention: {seller_auth_uid}/{filename}
CREATE POLICY "Authenticated upload foto-produk"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'foto-produk'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated upload foto-toko"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'foto-toko'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users bisa hapus file mereka sendiri
CREATE POLICY "Authenticated delete foto-produk"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'foto-produk'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated delete foto-toko"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'foto-toko'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

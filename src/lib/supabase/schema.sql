-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel kategori
CREATE TABLE kategori (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_kategori VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel sellers (TANPA FK ke auth.users — akan ditambahkan di Prompt 2B)
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  nama_toko VARCHAR(150) NOT NULL,
  slug_toko VARCHAR(150) NOT NULL UNIQUE,
  foto_toko_url TEXT,
  nomor_wa VARCHAR(20) NOT NULL,
  deskripsi_toko TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel produk
CREATE TABLE produk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  nama VARCHAR(100) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  harga BIGINT NOT NULL CHECK (harga >= 0),
  deskripsi TEXT,
  kategori_id UUID REFERENCES kategori(id) ON DELETE SET NULL,
  stok_tersedia BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(seller_id, slug)
);

-- Tabel foto produk
CREATE TABLE foto_produk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE CASCADE,
  url_foto TEXT NOT NULL,
  urutan INTEGER DEFAULT 0,
  is_utama BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel tracking klik WhatsApp
CREATE TABLE wa_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT
);

-- Indexes
CREATE INDEX idx_produk_seller ON produk(seller_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_produk_kategori ON produk(kategori_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_produk_slug ON produk(slug);
CREATE INDEX idx_foto_produk ON foto_produk(produk_id);
CREATE INDEX idx_wa_clicks_produk ON wa_clicks(produk_id);
CREATE INDEX idx_wa_clicks_date ON wa_clicks(clicked_at);
CREATE INDEX idx_sellers_slug ON sellers(slug_toko);

-- RLS (Row Level Security)
ALTER TABLE kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE foto_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_clicks ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa baca data publik
CREATE POLICY "Public read kategori" ON kategori FOR SELECT USING (true);
CREATE POLICY "Public read sellers" ON sellers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read produk" ON produk FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read foto" ON foto_produk FOR SELECT USING (true);
CREATE POLICY "Public insert wa_clicks" ON wa_clicks FOR INSERT WITH CHECK (true);

-- Policy seller (untuk Prompt 2B nanti — sementara buat dulu)
CREATE POLICY "Seller manage own data" ON sellers FOR ALL USING (auth.uid() = id);
CREATE POLICY "Seller manage own produk" ON produk FOR ALL USING (auth.uid() = seller_id);
CREATE POLICY "Seller manage own foto" ON foto_produk FOR ALL USING (
  produk_id IN (SELECT id FROM produk WHERE seller_id = auth.uid())
);

-- Seed kategori
INSERT INTO kategori (nama_kategori, slug) VALUES
  ('Makanan & Minuman', 'makanan-minuman'),
  ('Kerajinan Tangan', 'kerajinan-tangan'),
  ('Pertanian', 'pertanian'),
  ('Pakaian & Tekstil', 'pakaian-tekstil'),
  ('Elektronik & Aksesoris', 'elektronik-aksesoris'),
  ('Kebutuhan Rumah Tangga', 'kebutuhan-rumah-tangga'),
  ('Jasa', 'jasa'),
  ('Lainnya', 'lainnya');

-- Seed dummy sellers
INSERT INTO sellers (id, email, nama_toko, slug_toko, nomor_wa, deskripsi_toko) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'seller1@koperasishs.id', 'Toko Berkah Jaya', 'toko-berkah-jaya', '081234567890', 'Menyediakan berbagai kebutuhan rumah tangga dan makanan olahan berkualitas dari anggota koperasi.'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'seller2@koperasishs.id', 'Kerajinan Nusantara', 'kerajinan-nusantara', '082345678901', 'Kerajinan tangan asli Indonesia, dibuat dengan cinta oleh pengrajin lokal anggota koperasi SHS.'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'seller3@koperasishs.id', 'Tani Makmur', 'tani-makmur', '083456789012', 'Produk pertanian segar langsung dari kebun anggota koperasi. Tanpa pestisida, alami dan sehat.');

-- Seed dummy produk (seller 1 — Toko Berkah Jaya)
INSERT INTO produk (seller_id, nama, slug, harga, deskripsi, kategori_id, stok_tersedia) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Madu Hutan Asli 500ml', 'madu-hutan-asli-500ml', 85000,
   'Madu hutan murni dari lebah liar, dipanen langsung dari hutan Kalimantan. Tanpa campuran, tanpa pengawet. Khasiat terjamin untuk kesehatan dan daya tahan tubuh. Cocok dikonsumsi setiap hari.',
   (SELECT id FROM kategori WHERE slug = 'makanan-minuman'), true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Keripik Singkong Pedas', 'keripik-singkong-pedas', 25000,
   'Keripik singkong renyah dengan bumbu pedas khas Jawa Timur. Dibuat dari singkong pilihan, digoreng dengan minyak kelapa. Tahan 3 bulan dalam kemasan.',
   (SELECT id FROM kategori WHERE slug = 'makanan-minuman'), true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sambal Terasi Bu Darmi', 'sambal-terasi-bu-darmi', 30000,
   'Sambal terasi homemade resep turun temurun. Pedas nampol, cocok untuk lauk apa saja. Kemasan jar kaca 250gr.',
   (SELECT id FROM kategori WHERE slug = 'makanan-minuman'), true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kopi Robusta Dampit 250gr', 'kopi-robusta-dampit-250gr', 45000,
   'Kopi robusta premium dari Dampit, Malang. Roasting medium, aroma kuat dan rasa bold. Cocok untuk pecinta kopi tubruk maupun V60.',
   (SELECT id FROM kategori WHERE slug = 'makanan-minuman'), false);

-- Seed dummy produk (seller 2 — Kerajinan Nusantara)
INSERT INTO produk (seller_id, nama, slug, harga, deskripsi, kategori_id, stok_tersedia) VALUES
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Tas Anyaman Rotan Premium', 'tas-anyaman-rotan-premium', 175000,
   'Tas anyaman rotan handmade, desain modern minimalis. Cocok untuk gaya kasual maupun formal. Tali kulit sintetis premium. Ukuran 25x20x10cm.',
   (SELECT id FROM kategori WHERE slug = 'kerajinan-tangan'), true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Dompet Batik Tulis', 'dompet-batik-tulis', 95000,
   'Dompet dengan kain batik tulis asli Jawa. Setiap dompet memiliki motif unik karena dibuat satu per satu. Bahan dalam kulit sintetis.',
   (SELECT id FROM kategori WHERE slug = 'kerajinan-tangan'), true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Vas Keramik Handmade', 'vas-keramik-handmade', 120000,
   'Vas keramik buatan tangan dengan glasir natural. Tinggi 20cm, cocok untuk dekorasi ruang tamu. Setiap vas sedikit berbeda — itulah keunikannya.',
   (SELECT id FROM kategori WHERE slug = 'kerajinan-tangan'), true);

-- Seed dummy produk (seller 3 — Tani Makmur)
INSERT INTO produk (seller_id, nama, slug, harga, deskripsi, kategori_id, stok_tersedia) VALUES
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Beras Organik 5kg', 'beras-organik-5kg', 95000,
   'Beras organik putih varietas Mentik Wangi. Ditanam tanpa pestisida kimia. Tekstur pulen, aroma harum alami. Sertifikasi organik Indonesia.',
   (SELECT id FROM kategori WHERE slug = 'pertanian'), true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gula Kelapa Aren 1kg', 'gula-kelapa-aren-1kg', 55000,
   'Gula aren murni dari nira kelapa segar. Tanpa pemutih, tanpa campuran. Cocok untuk memasak, membuat kopi, atau jamu tradisional.',
   (SELECT id FROM kategori WHERE slug = 'pertanian'), true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Paket Sayur Segar Mingguan', 'paket-sayur-segar-mingguan', 65000,
   'Paket sayuran segar langsung dari kebun. Isi: kangkung, bayam, tomat, cabai, terong, dan buncis. Dipetik pagi, diantar siang. Area Kediri dan sekitarnya.',
   (SELECT id FROM kategori WHERE slug = 'pertanian'), true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Pupuk Kompos Organik 10kg', 'pupuk-kompos-organik-10kg', 35000,
   'Pupuk kompos dari limbah pertanian terfermentasi. Cocok untuk tanaman hias, sayuran, dan buah. Memperbaiki struktur tanah secara alami.',
   (SELECT id FROM kategori WHERE slug = 'pertanian'), false);

-- Seed foto produk (menggunakan placeholder URL — ganti dengan foto asli nanti)
INSERT INTO foto_produk (produk_id, url_foto, urutan, is_utama)
SELECT p.id, 'https://placehold.co/600x600/1a6b3c/ffffff?text=' || REPLACE(p.nama, ' ', '+'), 0, true
FROM produk p;

-- Tambah foto kedua untuk beberapa produk
INSERT INTO foto_produk (produk_id, url_foto, urutan, is_utama)
SELECT p.id, 'https://placehold.co/600x600/f5a623/ffffff?text=' || REPLACE(p.nama, ' ', '+') || '+2', 1, false
FROM produk p
WHERE p.slug IN ('madu-hutan-asli-500ml', 'tas-anyaman-rotan-premium', 'beras-organik-5kg');

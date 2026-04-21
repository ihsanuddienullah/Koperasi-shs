# Redesign Koperasi SHS — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## Ringkasan

Redesign menyeluruh semua halaman Koperasi SHS dengan estetik **Soft Modern** — polished, mobile-responsive, dengan design system yang konsisten. Mencakup 11 halaman publik dan seller.

---

## Design System

### Warna

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `--g950` | `#0a2218` | Sidebar background |
| `--g900` | `#1a4d2e` | Heading, logo |
| `--g700` | `#2d6a4f` | Primary button, link aktif ★ |
| `--g500` | `#40916c` | Hover state |
| `--g300` | `#74c69d` | Border aksen |
| `--g100` | `#d8f3dc` | Badge background, bg tipis |
| `--g50`  | `#eaf7ed` | Section background |
| `--s600` | `#b45309` | Saffron teks/label |
| `--s500` | `#d97706` | Saffron accent ★ (overline, logo aksen, badge Terlaris) |
| `--s100` | `#fef3c7` | Saffron background |
| `--wa`   | `#25D366` | WhatsApp button ★ |
| `--wa-dark` | `#128C7E` | WA hover/disabled |
| `--n900` | `#111827` | Teks utama |
| `--n600` | `#4b5563` | Teks sekunder |
| `--n400` | `#9ca3af` | Muted / placeholder |
| `--n200` | `#e5e7eb` | Border |
| `--n100` | `#f3f4f6` | Background halaman |

### Tipografi

- **Heading / Display / Label:** `Plus Jakarta Sans` — weight 700–800, letter-spacing negatif pada ukuran besar
- **Body / Caption / Form:** `DM Sans` — weight 400–600, line-height 1.5–1.6
- **Import:** Google Fonts CDN di `__root.tsx`

### Radius & Elevation

| Level | Radius | Shadow |
|-------|--------|--------|
| sm | 8px | `0 1px 4px rgba(0,0,0,.06)` |
| md | 12px | `0 4px 16px rgba(0,0,0,.08)` |
| lg | 16px | `0 8px 32px rgba(0,0,0,.10)` |
| xl | 24px | — |

### Komponen Utama

**Navbar (publik):** Background putih, border-bottom tipis, logo "Koperasi **SHS**" dengan "SHS" berwarna saffron, nav links DM Sans, tombol "Masuk Seller" pill hijau.

**Tombol:**
- Primary: `bg-[#2d6a4f]` + rounded-full + shadow hijau
- WhatsApp: `bg-[#25D366]` + logo SVG resmi WhatsApp + shadow hijau WA — disabled saat stok habis
- Outline: border hijau + teks hijau
- Ghost: bg-green-50 + teks hijau

**Filter Pill:** Pill rounded-full, active = bg hijau putih, inactive = border gray hover hijau.

**Product Card:** Rounded-xl, shadow-sm, hover naik 3px + shadow-md, badge kategori + badge stok.

**Badge:** Rounded-full kecil — hijau (tersedia), saffron (terlaris), merah (habis), abu (neutral).

---

## Halaman Publik

### 1. Beranda (`/`)

- **Hero:** Gradient `g50 → g100 → s50`, teks display "Belanja Produk **Lokal** Terbaik", overline saffron "✦ Platform Koperasi Digital", 2 tombol (Lihat Produk + Tentang Kami), ilustrasi grid card floating di kanan, blob dekoratif
- **Produk Terbaru:** Heading + link "Lihat Semua →", filter pill horizontal, grid 4 kolom (2 kolom mobile)
- **Responsive:** Hero stack vertikal di mobile, ilustrasi disembunyikan

### 2. Daftar Produk (`/produk`)

- SearchBar dengan ikon kaca pembesar inline
- Filter pill kategori (horizontal scroll di mobile)
- Grid produk: 4 kolom desktop → 2 kolom mobile
- Pagination: tombol angka rounded-lg, active = bg hijau

### 3. Detail Produk (`/produk/$slug`)

- Breadcrumb "← Kembali ke produk"
- Grid 2 kolom: kiri gallery (gambar utama + thumbnail row), kanan info
- Info: nama (800), harga hijau (800), badge kategori + stok, deskripsi DM Sans, divider, seller link, **tombol WA `#25D366` full-width** dengan logo SVG
- Mobile: stack vertikal, tombol WA tetap full-width sticky di bottom

### 4. Halaman Toko (`/toko/$slugToko`)

- Store header card: gradient hijau tipis, avatar circle dengan shadow, nama toko + deskripsi + badge jumlah produk
- Grid produk sama seperti halaman daftar produk

### 5. Tentang (`/tentang`)

- Overline saffron + heading display "Koperasi **Selaras** Harmoni Sejahtera"
- Paragraf body DM Sans
- Grid nilai 2×2: card berwarna (hijau/saffron/neutral bergantian)
- CTA section: gradient dark `g700 → g900`, teks putih, tombol saffron "Daftar Sekarang"

---

## Halaman Seller (Protected)

### Layout Seller (`_seller.tsx`)

- **Sidebar dark** (`#0a2218`), lebar 240px desktop → hidden mobile (drawer/hamburger)
- Brand logo atas + avatar toko + nav items + logout di bawah
- Nav items: ikon emoji + label, active = bg `g700`
- Main area: `bg-[#f3f4f6]`, padding 24px

### 6. Login (`/seller/login`)

- Full-page centered, background gradient tipis `g50 → white`
- Logo icon hijau + overline saffron "SELLER PORTAL"
- Card form: shadow hijau, border `g100`
- Toggle show/hide password

### 7. Register (`/seller/register`)

- Sama dengan login tapi lebih panjang: email, nama toko, nomor WA, deskripsi (opsional), password, konfirmasi password
- Success state: card konfirmasi dengan tombol kembali ke beranda

### 8. Dashboard (`/seller/dashboard`)

- 3 stat card: Produk Aktif (hijau), Klik WA Bulan Ini (warna WA `#128C7E`), Total Klik (saffron)
- Bar chart klik per hari: warna bar gradasi `g100 → g700` dari kiri ke kanan
- Tabel performa produk: thumbnail + nama + klik WA + badge stok

### 9. Produk Saya (`/seller/produk`)

- Header: judul + badge "N produk aktif" + tombol "+ Tambah"
- Tabel: thumbnail, nama+kategori, harga, badge stok, aksi (ikon edit + delete)
- Empty state: card dengan ilustrasi dan tombol tambah produk pertama

### 10. Tambah/Edit Produk

- Zona upload foto drag-drop (border dashed, ikon kamera)
- Fields: nama, harga, kategori (select), deskripsi
- **Toggle stok:** visual pill toggle (bukan checkbox), bg hijau saat aktif, label "Stok tersedia / Stok habis"
- Tombol: Simpan (hijau) + Batal (ghost)

### 11. Profil Toko (`/seller/profil`)

- Preview avatar circle dengan tombol "Ganti Foto" di sampingnya
- Fields: nama toko, nomor WA, deskripsi
- Info box abu: email + URL toko (read-only)
- Tombol simpan hijau

---

## Mobile Responsiveness

- Breakpoint utama: `md` (768px)
- Navbar publik: hamburger menu, drawer slide-in
- Sidebar seller: tersembunyi, toggle dengan hamburger di atas
- Grid produk: 4 → 2 kolom
- Hero: stack vertikal, ilustrasi dihilangkan
- Filter pill: `overflow-x: auto` horizontal scroll
- Tombol WA: full-width di mobile
- Form: single column di mobile

---

## Implementasi — Pendekatan B (Shared Components First)

**Urutan pengerjaan:**

1. **Design tokens** — CSS variables di `src/app.css`, import font di `__root.tsx`
2. **Shared components publik** — `Navbar`, `Footer`, `ProductCard`, `KategoriFilter`, `SearchBar`, `Pagination`, `HeroBanner`, `WhatsAppButton`, `PhotoGallery`
3. **Shared components seller** — `SellerSidebar`, `StatCard`, `KlikChart`, `ProdukTable`, `FotoUpload`, `DeleteProdukDialog`
4. **Halaman publik** — `index.tsx`, `produk/index.tsx`, `produk/$slug.tsx`, `toko/$slugToko.tsx`, `tentang.tsx`
5. **Halaman auth** — `seller/login.tsx`, `seller/register.tsx`
6. **Layout seller** — `_seller.tsx`
7. **Halaman seller** — `seller/dashboard.tsx`, `seller/produk/index.tsx`, `seller/produk/tambah.tsx`, `seller/produk/$produkId/edit.tsx`, `seller/profil.tsx`

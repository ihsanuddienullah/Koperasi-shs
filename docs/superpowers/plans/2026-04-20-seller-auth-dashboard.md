# Prompt 2B — Seller Auth + Dashboard + CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem autentikasi seller berbasis Supabase Auth, dashboard analytics, dan CRUD produk lengkap dengan upload foto.

**Architecture:** Supabase Auth dengan cookie-based session via `@supabase/ssr`. Route-route seller yang protected dibungkus oleh `_seller.tsx` pathless layout route (TanStack Router) yang melakukan auth guard di `beforeLoad`. File upload foto dilakukan client-side (browser Supabase client), URL-nya disimpan via server function. Soft delete untuk produk agar data wa_clicks tetap tersimpan.

**Tech Stack:** TanStack Start + TanStack Router (file-based), Supabase Auth + Supabase Storage, shadcn/ui, Recharts, react-dropzone, Zod, Sonner (toast), `server-only`.

---

## File Map

**Create:**
- `src/lib/supabase/storage-setup.sql` — Storage buckets + policies SQL
- `src/lib/slug.ts` — generateSlug helper
- `src/routes/_seller.tsx` — Pathless layout route: auth guard + sidebar wrapper
- `src/routes/_seller/seller/dashboard.tsx` — `/seller/dashboard` (protected)
- `src/routes/_seller/seller/profil.tsx` — `/seller/profil` (protected)
- `src/routes/_seller/seller/produk/index.tsx` — `/seller/produk` (protected)
- `src/routes/_seller/seller/produk/tambah.tsx` — `/seller/produk/tambah` (protected)
- `src/routes/_seller/seller/produk/$produkId/edit.tsx` — `/seller/produk/:id/edit` (protected)
- `src/routes/seller/register.tsx` — `/seller/register` (public)
- `src/components/seller/SellerSidebar.tsx` — Sidebar navigasi seller
- `src/components/seller/DeleteProdukDialog.tsx` — Dialog konfirmasi hapus produk

**Modify:**
- `src/server/supabase.ts` — Tambah `getSupabaseServiceClient()`
- `src/lib/schemas.ts` — Fix `produkSchema`, tambah `registerSchema`, `profilSchema`
- `src/server/auth.ts` — Tambah `loginSeller`, `registerSeller`, `logoutSeller`, `getCurrentSeller`, `updateSellerProfil`
- `src/server/produk.ts` — Tambah `getSellerProduk`, `getProdukByIdForSeller`, `createProduk`, `updateProduk`, `softDeleteProduk`
- `src/server/storage.ts` — Implement `saveFotos`, `deleteFotos`, `uploadFotoToko`
- `src/server/analytics.ts` — Implement `getSellerDashboardData`
- `src/routes/__root.tsx` — Tambah `<Toaster />` dari sonner
- `src/routes/seller/login.tsx` — Implement login form
- `src/components/Navbar.tsx` — Tambah seller state + dropdown
- `src/components/dashboard/stat-card.tsx` — Implement `StatCard`
- `src/components/dashboard/klik-chart.tsx` — Implement `KlikChart`
- `src/components/dashboard/produk-table.tsx` — Implement `ProdukTable`
- `src/components/produk/foto-upload.tsx` — Implement `FotoUpload`

**Delete (diganti dengan versi _seller/):**
- `src/routes/seller/dashboard.tsx`
- `src/routes/seller/profil.tsx`
- `src/routes/seller/produk/index.tsx`
- `src/routes/seller/produk/tambah.tsx`
- `src/routes/seller/produk/$produkId/edit.tsx`

---

## Task 1: Storage Buckets SQL

**Files:**
- Create: `src/lib/supabase/storage-setup.sql`

- [ ] **Step 1: Tulis storage-setup.sql**

```sql
-- Jalankan di Supabase SQL Editor

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
```

- [ ] **Step 2: Jalankan SQL di Supabase**

Buka Supabase Dashboard → SQL Editor → New Query → paste isi file → Run.
Expected: "Success. No rows returned" untuk setiap statement.

- [ ] **Step 3: Verifikasi buckets**

Cek di Supabase Dashboard → Storage → Buckets: harus ada `foto-produk` dan `foto-toko` (public).

---

## Task 2: Service Role Client

**Files:**
- Modify: `src/server/supabase.ts`

- [ ] **Step 1: Tambah `getSupabaseServiceClient()` ke server/supabase.ts**

```typescript
import 'server-only'
import { createServerClient, createClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

export function getSupabaseServerClient() {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookies = getCookies()
          return Object.entries(cookies).map(([name, value]) => ({
            name,
            value: value as string,
          }))
        },
        setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options)
          })
        },
      },
    }
  )
}

// Service role client — bypass RLS, hanya untuk server-side admin operations
export function getSupabaseServiceClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
```

- [ ] **Step 2: Verifikasi tidak ada TypeScript error**

```bash
pnpm typecheck 2>&1 | head -30
```

---

## Task 3: Create lib/slug.ts

**Files:**
- Create: `src/lib/slug.ts`

- [ ] **Step 1: Tulis slug.ts**

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
```

---

## Task 4: Fix schemas.ts

**Files:**
- Modify: `src/lib/schemas.ts`

Masalah saat ini: `produkSchema` punya field `nomor_wa` yang seharusnya ada di seller profile, bukan produk.

- [ ] **Step 1: Rewrite schemas.ts**

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
  nama_toko: z.string().min(3, 'Nama toko minimal 3 karakter').max(100),
  nomor_wa: z
    .string()
    .regex(/^(0|62)[0-9]{8,12}$/, 'Format: 08xx atau 628xx')
    .transform((n) => (n.startsWith('0') ? '62' + n.slice(1) : n)),
  deskripsi_toko: z.string().max(500).optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export const profilSchema = z.object({
  nama_toko: z.string().min(3).max(100),
  nomor_wa: z
    .string()
    .regex(/^(0|62)[0-9]{8,12}$/, 'Format: 08xx atau 628xx')
    .transform((n) => (n.startsWith('0') ? '62' + n.slice(1) : n)),
  deskripsi_toko: z.string().max(500).optional(),
})

export const produkSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100).trim(),
  harga: z.number().positive('Harga harus positif').max(999_999_999),
  deskripsi: z.string().max(2000).optional(),
  kategori_id: z.string().uuid().optional(),
  stok_tersedia: z.boolean(),
})

export const fotoSchema = z.object({
  size: z.number().max(2 * 1024 * 1024, 'Maksimal 2MB per foto'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'Format: JPG, PNG, atau WebP' }),
  }),
})
```

- [ ] **Step 2: Verifikasi tidak ada error**

```bash
pnpm typecheck 2>&1 | grep schemas
```

---

## Task 5: Expand server/auth.ts

**Files:**
- Modify: `src/server/auth.ts`

- [ ] **Step 1: Rewrite server/auth.ts lengkap**

```typescript
import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase'
import { generateSlug } from '#/lib/slug'
import type { Seller } from '#/lib/supabase/types'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getCurrentSeller = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: seller } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', user.id)
      .single()

    return (seller as Seller) ?? null
  }
)

export const loginSeller = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) throw new Error(error.message)
    return { success: true }
  })

export const registerSeller = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      email: string
      password: string
      nama_toko: string
      nomor_wa: string
      deskripsi_toko?: string
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('Registrasi gagal, coba lagi')

    const baseSlug = generateSlug(data.nama_toko)

    // Cek keunikan slug, tambahkan angka jika perlu
    let slug_toko = baseSlug
    let attempt = 0
    while (true) {
      const { data: existing } = await supabase
        .from('sellers')
        .select('id')
        .eq('slug_toko', slug_toko)
        .maybeSingle()
      if (!existing) break
      attempt++
      slug_toko = `${baseSlug}-${attempt}`
    }

    const { error: sellerError } = await supabase.from('sellers').insert({
      id: authData.user.id,
      email: data.email,
      nama_toko: data.nama_toko,
      slug_toko,
      nomor_wa: data.nomor_wa,
      deskripsi_toko: data.deskripsi_toko ?? null,
      is_active: false,
    })
    if (sellerError) throw new Error(sellerError.message)

    return { success: true }
  })

export const logoutSeller = createServerFn({ method: 'POST' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    await supabase.auth.signOut()
    return { success: true }
  }
)

export const updateSellerProfil = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      nama_toko: string
      nomor_wa: string
      deskripsi_toko?: string
      foto_toko_url?: string
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
      .from('sellers')
      .update({
        nama_toko: data.nama_toko,
        nomor_wa: data.nomor_wa,
        deskripsi_toko: data.deskripsi_toko ?? null,
        ...(data.foto_toko_url !== undefined && { foto_toko_url: data.foto_toko_url }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "auth.ts"
```

---

## Task 6: Expand server/produk.ts (Seller CRUD)

**Files:**
- Modify: `src/server/produk.ts`

- [ ] **Step 1: Tambahkan seller-specific functions di akhir file produk.ts**

```typescript
// --- SELLER FUNCTIONS (tambahkan di bawah semua fungsi publik) ---
import { getSupabaseServerClient } from './supabase'
import { generateSlug } from '#/lib/slug'

export const getSellerProduk = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: rows, error } = await supabase
      .from('produk')
      .select('*, kategori(nama_kategori, slug), foto_produk(*)')
      .eq('seller_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return mapProdukRows((rows ?? []) as Array<Record<string, unknown>>)
  }
)

export const getProdukByIdForSeller = createServerFn({ method: 'GET' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: row, error } = await supabase
      .from('produk')
      .select('*, kategori(nama_kategori, slug), foto_produk(*)')
      .eq('id', data.id)
      .eq('seller_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error || !row) return null

    const fotos = ((row as Record<string, unknown>).foto_produk as Array<Record<string, unknown>>) ?? []
    const sortedFotos = [...fotos].sort((a, b) => (a.urutan as number) - (b.urutan as number))
    const utama = sortedFotos.find((f) => f.is_utama) ?? sortedFotos[0]

    return {
      ...row,
      foto_utama: utama ? (utama.url_foto as string) : null,
      foto_produk: sortedFotos,
    } as unknown as ProdukWithDetails
  })

export const createProduk = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      nama: string
      harga: number
      deskripsi?: string
      kategori_id?: string
      stok_tersedia: boolean
      fotos: Array<{ url: string; urutan: number; is_utama: boolean }>
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Generate unique slug
    const baseSlug = generateSlug(data.nama)
    let slug = baseSlug
    let attempt = 0
    while (true) {
      const { data: existing } = await supabase
        .from('produk')
        .select('id')
        .eq('seller_id', user.id)
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const { data: produk, error } = await supabase
      .from('produk')
      .insert({
        seller_id: user.id,
        nama: data.nama,
        slug,
        harga: data.harga,
        deskripsi: data.deskripsi ?? null,
        kategori_id: data.kategori_id ?? null,
        stok_tersedia: data.stok_tersedia,
      })
      .select('id')
      .single()

    if (error || !produk) throw new Error(error?.message ?? 'Gagal membuat produk')

    if (data.fotos.length > 0) {
      const fotoRows = data.fotos.map((f) => ({
        produk_id: (produk as { id: string }).id,
        url_foto: f.url,
        urutan: f.urutan,
        is_utama: f.is_utama,
      }))
      const { error: fotoError } = await supabase.from('foto_produk').insert(fotoRows)
      if (fotoError) throw new Error(fotoError.message)
    }

    return { id: (produk as { id: string }).id, slug }
  })

export const updateProduk = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      id: string
      nama: string
      harga: number
      deskripsi?: string
      kategori_id?: string
      stok_tersedia: boolean
      fotos: Array<{ url: string; urutan: number; is_utama: boolean }>
    }) => input
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Verifikasi kepemilikan
    const { data: existing } = await supabase
      .from('produk')
      .select('id, seller_id')
      .eq('id', data.id)
      .eq('seller_id', user.id)
      .single()
    if (!existing) throw new Error('Produk tidak ditemukan')

    const { error } = await supabase
      .from('produk')
      .update({
        nama: data.nama,
        harga: data.harga,
        deskripsi: data.deskripsi ?? null,
        kategori_id: data.kategori_id ?? null,
        stok_tersedia: data.stok_tersedia,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)
    if (error) throw new Error(error.message)

    // Replace semua foto
    await supabase.from('foto_produk').delete().eq('produk_id', data.id)

    if (data.fotos.length > 0) {
      const fotoRows = data.fotos.map((f) => ({
        produk_id: data.id,
        url_foto: f.url,
        urutan: f.urutan,
        is_utama: f.is_utama,
      }))
      const { error: fotoError } = await supabase.from('foto_produk').insert(fotoRows)
      if (fotoError) throw new Error(fotoError.message)
    }

    return { success: true }
  })

export const softDeleteProduk = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
      .from('produk')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('seller_id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
```

**PENTING:** Karena file produk.ts menggunakan `createServerSupabase` dari `lib/supabase/server.ts` untuk fungsi publik, dan `getSupabaseServerClient` dari `server/supabase.ts` untuk fungsi seller, tambahkan import `getSupabaseServerClient` di bagian atas produk.ts:

```typescript
import { getSupabaseServerClient } from './supabase'
import { generateSlug } from '#/lib/slug'
```

Dan tambahkan import `getKategoriList` yang sudah ada tetap menggunakan `createServerSupabase` (tidak perlu diubah — query publik tidak perlu cookie auth).

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "produk.ts"
```

---

## Task 7: Implement server/storage.ts

**Files:**
- Modify: `src/server/storage.ts`

Storage digunakan untuk hapus foto dari bucket (menggunakan service client). Upload foto dilakukan dari client-side.

- [ ] **Step 1: Implement storage.ts**

```typescript
import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient, getSupabaseServiceClient } from './supabase'

// Hapus multiple foto dari storage (dipanggil saat update/delete produk)
export const deleteFotosFromStorage = createServerFn({ method: 'POST' })
  .inputValidator((input: { paths: string[] }) => input)
  .handler(async ({ data }) => {
    if (data.paths.length === 0) return { success: true }

    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const serviceClient = getSupabaseServiceClient()

    // paths adalah storage paths, bukan URL
    // Extract path dari URL jika perlu
    const { error } = await serviceClient.storage
      .from('foto-produk')
      .remove(data.paths)

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const deleteFotoTokoFromStorage = createServerFn({ method: 'POST' })
  .inputValidator((input: { path: string }) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const serviceClient = getSupabaseServiceClient()
    await serviceClient.storage.from('foto-toko').remove([data.path])
    return { success: true }
  })

// Ekstrak storage path dari public URL
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl)
    // Format URL Supabase: /storage/v1/object/public/{bucket}/{path}
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "storage.ts"
```

---

## Task 8: Implement server/analytics.ts

**Files:**
- Modify: `src/server/analytics.ts`

- [ ] **Step 1: Implement analytics.ts**

```typescript
import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase'

export type DashboardData = {
  totalProduk: number
  totalKlikBulanIni: number
  totalKlikSemuaWaktu: number
  klikPerHari: Array<{ tanggal: string; klik: number }>
  produkPerforma: Array<{
    produk_id: string
    nama: string
    slug: string
    klik_bulan_ini: number
    stok_tersedia: boolean
  }>
}

export const getSellerDashboardData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardData> => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const now = new Date()
    const bulanIniStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const tigaPuluhHariLalu = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Total produk aktif
    const { count: totalProduk } = await supabase
      .from('produk')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .is('deleted_at', null)

    // Ambil semua produk seller untuk filter klik
    const { data: produkList } = await supabase
      .from('produk')
      .select('id, nama, slug, stok_tersedia')
      .eq('seller_id', user.id)
      .is('deleted_at', null)

    const produkIds = (produkList ?? []).map((p) => (p as { id: string }).id)

    if (produkIds.length === 0) {
      return {
        totalProduk: totalProduk ?? 0,
        totalKlikBulanIni: 0,
        totalKlikSemuaWaktu: 0,
        klikPerHari: [],
        produkPerforma: [],
      }
    }

    // Total klik bulan ini
    const { count: totalKlikBulanIni } = await supabase
      .from('wa_clicks')
      .select('*', { count: 'exact', head: true })
      .in('produk_id', produkIds)
      .gte('clicked_at', bulanIniStart)

    // Total klik semua waktu
    const { count: totalKlikSemuaWaktu } = await supabase
      .from('wa_clicks')
      .select('*', { count: 'exact', head: true })
      .in('produk_id', produkIds)

    // Klik per hari (30 hari terakhir) — ambil raw lalu aggregate di sini
    const { data: klikRows } = await supabase
      .from('wa_clicks')
      .select('clicked_at')
      .in('produk_id', produkIds)
      .gte('clicked_at', tigaPuluhHariLalu)
      .order('clicked_at', { ascending: true })

    // Aggregate by date
    const klikByDate = new Map<string, number>()
    // Pre-fill 30 hari dengan 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      klikByDate.set(key, 0)
    }
    for (const row of klikRows ?? []) {
      const key = (row as { clicked_at: string }).clicked_at.split('T')[0]
      klikByDate.set(key, (klikByDate.get(key) ?? 0) + 1)
    }
    const klikPerHari = Array.from(klikByDate.entries()).map(([tanggal, klik]) => ({
      tanggal,
      klik,
    }))

    // Klik per produk bulan ini
    const { data: klikPerProdukRows } = await supabase
      .from('wa_clicks')
      .select('produk_id')
      .in('produk_id', produkIds)
      .gte('clicked_at', bulanIniStart)

    const klikCountByProduk = new Map<string, number>()
    for (const row of klikPerProdukRows ?? []) {
      const pid = (row as { produk_id: string }).produk_id
      klikCountByProduk.set(pid, (klikCountByProduk.get(pid) ?? 0) + 1)
    }

    const produkPerforma = (produkList ?? []).map((p) => ({
      produk_id: (p as { id: string }).id,
      nama: (p as { nama: string }).nama,
      slug: (p as { slug: string }).slug,
      klik_bulan_ini: klikCountByProduk.get((p as { id: string }).id) ?? 0,
      stok_tersedia: (p as { stok_tersedia: boolean }).stok_tersedia,
    })).sort((a, b) => b.klik_bulan_ini - a.klik_bulan_ini)

    return {
      totalProduk: totalProduk ?? 0,
      totalKlikBulanIni: totalKlikBulanIni ?? 0,
      totalKlikSemuaWaktu: totalKlikSemuaWaktu ?? 0,
      klikPerHari,
      produkPerforma,
    }
  }
)
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "analytics.ts"
```

---

## Task 9: Add Toaster to __root.tsx

**Files:**
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Tambahkan Sonner Toaster**

Tambahkan import di atas:
```typescript
import { Toaster } from 'sonner'
```

Di dalam `RootComponent`, tambahkan `<Toaster />` setelah `<Footer />`:
```tsx
function RootComponent() {
  return (
    <RootDocument>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </RootDocument>
  )
}
```

- [ ] **Step 2: Verifikasi typecheck**

```bash
pnpm typecheck 2>&1 | grep "__root.tsx"
```

---

## Task 10: Implement seller/login.tsx

**Files:**
- Modify: `src/routes/seller/login.tsx`

- [ ] **Step 1: Implement login page**

```typescript
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { loginSeller, getCurrentSeller } from '#/server/auth'
import { loginSchema } from '#/lib/schemas'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/seller/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ navigate }) => {
    const seller = await getCurrentSeller()
    if (seller) {
      await navigate({ to: '/seller/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { redirect } = Route.useSearch()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await loginSeller({ data: result.data })
      toast.success('Login berhasil!')
      await router.navigate({ to: redirect ?? '/seller/dashboard' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1a6b3c]">Masuk Seller</CardTitle>
          <CardDescription>Kelola toko dan produk Anda di Koperasi SHS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1a6b3c] hover:bg-[#145730]"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/seller/register" className="text-[#1a6b3c] hover:underline">
              Daftar sebagai seller
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "login.tsx"
```

---

## Task 11: Create seller/register.tsx

**Files:**
- Create: `src/routes/seller/register.tsx`

- [ ] **Step 1: Buat register page**

```typescript
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { registerSeller } from '#/server/auth'
import { registerSchema } from '#/lib/schemas'

export const Route = createFileRoute('/seller/register')({
  component: RegisterPage,
})

type FormState = {
  email: string
  password: string
  confirmPassword: string
  nama_toko: string
  nomor_wa: string
  deskripsi_toko: string
}

function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    nama_toko: '',
    nomor_wa: '',
    deskripsi_toko: '',
  })

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse({
      ...form,
      deskripsi_toko: form.deskripsi_toko || undefined,
    })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await registerSeller({
        data: {
          email: result.data.email,
          password: result.data.password,
          nama_toko: result.data.nama_toko,
          nomor_wa: result.data.nomor_wa,
          deskripsi_toko: result.data.deskripsi_toko,
        },
      })
      setSuccess(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Pendaftaran gagal')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-[#1a6b3c]">Pendaftaran Berhasil!</CardTitle>
            <CardDescription>
              Akun Anda sedang menunggu persetujuan admin koperasi. Kami akan menghubungi Anda via email setelah akun diaktifkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#1a6b3c]">Daftar Sebagai Seller</CardTitle>
          <CardDescription>Bergabung dan jual produk Anda di Koperasi SHS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', field: 'email' as const },
              { id: 'nama_toko', label: 'Nama Toko', type: 'text', placeholder: 'Toko Berkah Jaya', field: 'nama_toko' as const },
              { id: 'nomor_wa', label: 'Nomor WhatsApp', type: 'tel', placeholder: '081234567890', field: 'nomor_wa' as const },
            ].map(({ id, label, type, placeholder, field }) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type={type} placeholder={placeholder} value={form[field]} onChange={set(field)} disabled={loading} />
                {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="deskripsi_toko">Deskripsi Toko (opsional)</Label>
              <Textarea
                id="deskripsi_toko"
                placeholder="Ceritakan tentang toko Anda..."
                value={form.deskripsi_toko}
                onChange={set('deskripsi_toko')}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={set('password')} disabled={loading} />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#1a6b3c] hover:bg-[#145730]" disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/seller/login" className="text-[#1a6b3c] hover:underline">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "register.tsx"
```

---

## Task 12: Create SellerSidebar Component

**Files:**
- Create: `src/components/seller/SellerSidebar.tsx`

- [ ] **Step 1: Buat SellerSidebar**

```typescript
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, Package, UserCircle, LogOut, Store } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { logoutSeller } from '#/server/auth'
import type { Seller } from '#/lib/supabase/types'

const NAV_ITEMS = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller/produk', label: 'Produk Saya', icon: Package },
  { to: '/seller/profil', label: 'Profil Toko', icon: UserCircle },
] as const

export function SellerSidebar({ seller }: { seller: Seller }) {
  const location = useLocation()
  const router = useRouter()

  const isActive = (to: string) => location.pathname.startsWith(to)

  const handleLogout = async () => {
    try {
      await logoutSeller()
      toast.success('Berhasil keluar')
      await router.navigate({ to: '/seller/login' })
    } catch {
      toast.error('Gagal keluar')
    }
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          {seller.foto_toko_url ? (
            <img
              src={seller.foto_toko_url}
              alt={seller.nama_toko}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f5e9]">
              <Store className="h-4 w-4 text-[#1a6b3c]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{seller.nama_toko}</p>
            <p className="truncate text-xs text-muted-foreground">{seller.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive(to)
                ? 'bg-[#e8f5e9] font-medium text-[#1a6b3c]'
                : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
```

---

## Task 13: Create _seller.tsx Layout Route

**Files:**
- Create: `src/routes/_seller.tsx`
- Delete: `src/routes/seller/dashboard.tsx`
- Delete: `src/routes/seller/profil.tsx`
- Delete: `src/routes/seller/produk/index.tsx`
- Delete: `src/routes/seller/produk/tambah.tsx`
- Delete: `src/routes/seller/produk/$produkId/edit.tsx`

- [ ] **Step 1: Buat `src/routes/_seller.tsx`**

```typescript
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SellerSidebar } from '#/components/seller/SellerSidebar'
import { getCurrentSeller } from '#/server/auth'

export const Route = createFileRoute('/_seller')({
  beforeLoad: async ({ location }) => {
    const seller = await getCurrentSeller()
    if (!seller) {
      throw redirect({
        to: '/seller/login',
        search: { redirect: location.pathname },
      })
    }
    return { seller }
  },
  component: SellerLayout,
})

function SellerLayout() {
  const { seller } = Route.useRouteContext()

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <SellerSidebar seller={seller} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Hapus file-file placeholder seller**

```bash
rm "src/routes/seller/dashboard.tsx"
rm "src/routes/seller/profil.tsx"
rm "src/routes/seller/produk/index.tsx"
rm "src/routes/seller/produk/tambah.tsx"
rm "src/routes/seller/produk/$produkId/edit.tsx"
rmdir "src/routes/seller/produk/$produkId" 2>/dev/null || true
rmdir "src/routes/seller/produk" 2>/dev/null || true
```

(Jalankan dari root proyek: `/Users/ihsanmacbook/Documents/Project/Personal Project/Koperasi-shs`)

- [ ] **Step 3: Buat direktori `_seller/seller/produk/$produkId/`**

```bash
mkdir -p "src/routes/_seller/seller/produk/\$produkId"
```

- [ ] **Step 4: Verifikasi struktur direktori**

```bash
find src/routes/_seller -type f
find src/routes/seller -type f
```

Expected:
```
src/routes/_seller/     # (kosong, file-file dibuat di task berikutnya)
src/routes/seller/login.tsx
src/routes/seller/register.tsx
```

---

## Task 14: Implement Dashboard Components

**Files:**
- Modify: `src/components/dashboard/stat-card.tsx`
- Modify: `src/components/dashboard/klik-chart.tsx`
- Modify: `src/components/dashboard/produk-table.tsx`

- [ ] **Step 1: Implement stat-card.tsx**

```typescript
import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-6', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-full bg-[#e8f5e9] p-2">
          <Icon className="h-4 w-4 text-[#1a6b3c]" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Implement klik-chart.tsx**

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type KlikChartProps = {
  data: Array<{ tanggal: string; klik: number }>
}

export function KlikChart({ data }: KlikChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
  }))

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold">Klik WhatsApp (30 Hari Terakhir)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            interval={6}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value: number) => [value, 'Klik']}
          />
          <Line
            type="monotone"
            dataKey="klik"
            stroke="#1a6b3c"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 3: Implement produk-table.tsx**

```typescript
import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'

type ProdukPerforma = {
  produk_id: string
  nama: string
  slug: string
  klik_bulan_ini: number
  stok_tersedia: boolean
}

export function ProdukTable({ data }: { data: ProdukPerforma[] }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">Performa Produk Bulan Ini</h3>
      </div>
      {data.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">
          Belum ada produk. <Link to="/seller/produk/tambah" className="text-[#1a6b3c] hover:underline">Tambah produk pertama Anda.</Link>
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stok</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Klik WA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.produk_id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    to="/produk/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium hover:text-[#1a6b3c] hover:underline"
                    target="_blank"
                  >
                    {p.nama}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    className={
                      p.stok_tersedia
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {p.stok_tersedia ? 'Ada' : 'Habis'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#1a6b3c]">
                  {p.klik_bulan_ini}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep -E "stat-card|klik-chart|produk-table"
```

---

## Task 15: Create Dashboard Page

**Files:**
- Create: `src/routes/_seller/seller/dashboard.tsx`

- [ ] **Step 1: Buat dashboard.tsx**

```typescript
import { createFileRoute, Link } from '@tanstack/react-router'
import { LayoutDashboard, MessageCircle, Package, TrendingUp } from 'lucide-react'
import { StatCard } from '#/components/dashboard/stat-card'
import { KlikChart } from '#/components/dashboard/klik-chart'
import { ProdukTable } from '#/components/dashboard/produk-table'
import { getSellerDashboardData } from '#/server/analytics'

export const Route = createFileRoute('/_seller/seller/dashboard')({
  loader: async () => {
    return getSellerDashboardData()
  },
  component: DashboardPage,
})

function DashboardPage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan aktivitas toko Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Produk Aktif"
          value={data.totalProduk}
          description="Produk yang sedang ditampilkan"
          icon={Package}
        />
        <StatCard
          title="Klik WA Bulan Ini"
          value={data.totalKlikBulanIni}
          description="Pembeli yang menghubungi via WhatsApp"
          icon={MessageCircle}
        />
        <StatCard
          title="Total Klik WA"
          value={data.totalKlikSemuaWaktu}
          description="Semua waktu"
          icon={TrendingUp}
        />
      </div>

      {/* Chart */}
      <KlikChart data={data.klikPerHari} />

      {/* Table */}
      <ProdukTable data={data.produkPerforma} />

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          to="/seller/produk/tambah"
          className="rounded-md bg-[#1a6b3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#145730]"
        >
          + Tambah Produk
        </Link>
        <Link
          to="/seller/produk"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Kelola Produk
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "dashboard.tsx"
```

---

## Task 16: Implement FotoUpload Component

**Files:**
- Modify: `src/components/produk/foto-upload.tsx`

Komponen ini upload langsung ke Supabase Storage dari browser menggunakan authenticated client.

- [ ] **Step 1: Implement foto-upload.tsx**

```typescript
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, X, Star } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '#/lib/supabase/client'
import { fotoSchema } from '#/lib/schemas'

export type FotoItem = {
  url: string
  urutan: number
  is_utama: boolean
  // untuk tracking file baru yang belum tersimpan
  storagePath?: string
}

type FotoUploadProps = {
  sellerId: string
  value: FotoItem[]
  onChange: (fotos: FotoItem[]) => void
  maxFiles?: number
}

export function FotoUpload({ sellerId, value, onChange, maxFiles = 5 }: FotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const uploadFile = async (file: File): Promise<{ url: string; path: string } | null> => {
    const validation = fotoSchema.safeParse({ size: file.size, type: file.type })
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return null
    }

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${sellerId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from('foto-produk').upload(path, file)
    if (error) {
      toast.error(`Gagal upload: ${error.message}`)
      return null
    }

    const { data: urlData } = supabase.storage.from('foto-produk').getPublicUrl(path)
    return { url: urlData.publicUrl, path }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length
      if (remaining <= 0) {
        toast.error(`Maksimal ${maxFiles} foto`)
        return
      }
      const filesToUpload = acceptedFiles.slice(0, remaining)
      setUploading(true)

      const results = await Promise.all(filesToUpload.map(uploadFile))
      const newFotos: FotoItem[] = results
        .filter((r): r is { url: string; path: string } => r !== null)
        .map((r, i) => ({
          url: r.url,
          storagePath: r.path,
          urutan: value.length + i + 1,
          is_utama: value.length === 0 && i === 0,
        }))

      onChange([...value, ...newFotos])
      setUploading(false)
    },
    [value, onChange, sellerId, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 2 * 1024 * 1024,
    disabled: uploading || value.length >= maxFiles,
  })

  const setUtama = (index: number) => {
    onChange(value.map((f, i) => ({ ...f, is_utama: i === index })))
  }

  const removeFoto = async (index: number) => {
    const foto = value[index]
    // Hapus dari storage jika ada path
    if (foto.storagePath) {
      const supabase = createClient()
      await supabase.storage.from('foto-produk').remove([foto.storagePath])
    }
    const updated = value
      .filter((_, i) => i !== index)
      .map((f, i) => ({
        ...f,
        urutan: i + 1,
        is_utama: i === 0 ? true : f.is_utama && i !== 0,
      }))
    // Pastikan ada 1 foto utama
    if (updated.length > 0 && !updated.some((f) => f.is_utama)) {
      updated[0].is_utama = true
    }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragActive
              ? 'border-[#1a6b3c] bg-[#e8f5e9]'
              : 'border-gray-300 hover:border-[#1a6b3c] hover:bg-gray-50'
          } ${uploading ? 'opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Mengupload...' : 'Klik atau seret foto ke sini'}
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WebP • Maks 2MB • {value.length}/{maxFiles} foto</p>
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((foto, index) => (
            <div key={foto.url} className="group relative aspect-square">
              <img
                src={foto.url}
                alt={`Foto ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setUtama(index)}
                  title="Jadikan foto utama"
                  className="rounded-full bg-white p-1 hover:bg-yellow-100"
                >
                  <Star className={`h-3 w-3 ${foto.is_utama ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFoto(index)}
                  title="Hapus foto"
                  className="rounded-full bg-white p-1 hover:bg-red-100"
                >
                  <X className="h-3 w-3 text-red-500" />
                </button>
              </div>
              {/* Utama badge */}
              {foto.is_utama && (
                <span className="absolute left-1 top-1 rounded bg-[#1a6b3c] px-1 py-0.5 text-[10px] font-semibold text-white">
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "foto-upload"
```

---

## Task 17: Create DeleteProdukDialog

**Files:**
- Create: `src/components/seller/DeleteProdukDialog.tsx`

- [ ] **Step 1: Buat DeleteProdukDialog**

```typescript
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { softDeleteProduk } from '#/server/produk'

type DeleteProdukDialogProps = {
  produkId: string
  namaProduk: string
  onDeleted: () => void
  children: React.ReactNode
}

export function DeleteProdukDialog({ produkId, namaProduk, onDeleted, children }: DeleteProdukDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await softDeleteProduk({ data: { id: produkId } })
      toast.success(`"${namaProduk}" berhasil dihapus`)
      setOpen(false)
      onDeleted()
    } catch {
      toast.error('Gagal menghapus produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus <strong>"{namaProduk}"</strong>? Produk tidak akan tampil di publik, tetapi data klik WhatsApp tetap tersimpan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Task 18: Create Product List Page

**Files:**
- Create: `src/routes/_seller/seller/produk/index.tsx`

- [ ] **Step 1: Buat produk/index.tsx**

```typescript
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { DeleteProdukDialog } from '#/components/seller/DeleteProdukDialog'
import { formatRupiah } from '#/lib/format'
import { getSellerProduk } from '#/server/produk'

export const Route = createFileRoute('/_seller/seller/produk/')({
  loader: async () => getSellerProduk(),
  component: SellerProdukPage,
})

function SellerProdukPage() {
  const produkList = Route.useLoaderData()
  const router = useRouter()

  const handleDeleted = () => router.invalidate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produk Saya</h1>
          <p className="text-sm text-muted-foreground">{produkList.length} produk aktif</p>
        </div>
        <Link to="/seller/produk/tambah">
          <Button className="bg-[#1a6b3c] hover:bg-[#145730]">
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>

      {produkList.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-muted-foreground">Belum ada produk.</p>
          <Link to="/seller/produk/tambah">
            <Button className="mt-4 bg-[#1a6b3c] hover:bg-[#145730]">
              Tambah Produk Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Harga</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stok</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.foto_utama ? (
                        <img
                          src={p.foto_utama}
                          alt={p.nama}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium">{p.nama}</p>
                        {p.kategori && (
                          <p className="text-xs text-muted-foreground">{p.kategori.nama_kategori}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{formatRupiah(p.harga)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        p.stok_tersedia
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {p.stok_tersedia ? 'Ada' : 'Habis'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/produk/$slug" params={{ slug: p.slug }} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/seller/produk/$produkId/edit" params={{ produkId: p.id }}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProdukDialog
                        produkId={p.id}
                        namaProduk={p.nama}
                        onDeleted={handleDeleted}
                      >
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          Hapus
                        </Button>
                      </DeleteProdukDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "produk/index"
```

---

## Task 19: Create Add Product Page

**Files:**
- Create: `src/routes/_seller/seller/produk/tambah.tsx`

- [ ] **Step 1: Buat tambah.tsx**

```typescript
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { FotoUpload, type FotoItem } from '#/components/produk/foto-upload'
import { createProduk } from '#/server/produk'
import { getKategoriList } from '#/server/produk'
import { produkSchema } from '#/lib/schemas'

export const Route = createFileRoute('/_seller/seller/produk/tambah')({
  loader: async ({ context }) => {
    const kategoriList = await getKategoriList()
    return { seller: context.seller, kategoriList }
  },
  component: TambahProdukPage,
})

type FormState = {
  nama: string
  harga: string
  deskripsi: string
  kategori_id: string
  stok_tersedia: boolean
}

function TambahProdukPage() {
  const { seller, kategoriList } = Route.useLoaderData()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fotos, setFotos] = useState<FotoItem[]>([])
  const [form, setForm] = useState<FormState>({
    nama: '',
    harga: '',
    deskripsi: '',
    kategori_id: '',
    stok_tersedia: true,
  })

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = produkSchema.safeParse({
      nama: form.nama,
      harga: Number(form.harga.replace(/\D/g, '')),
      deskripsi: form.deskripsi || undefined,
      kategori_id: form.kategori_id || undefined,
      stok_tersedia: form.stok_tersedia,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const { id } = await createProduk({
        data: {
          ...result.data,
          fotos: fotos.map((f) => ({ url: f.url, urutan: f.urutan, is_utama: f.is_utama })),
        },
      })
      toast.success('Produk berhasil ditambahkan!')
      await router.navigate({ to: '/seller/produk' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">Isi informasi produk yang akan dijual</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
        {/* Foto */}
        <div className="space-y-2">
          <Label>Foto Produk (maks. 5)</Label>
          <FotoUpload sellerId={seller.id} value={fotos} onChange={setFotos} />
        </div>

        {/* Nama */}
        <div className="space-y-1">
          <Label htmlFor="nama">Nama Produk *</Label>
          <Input id="nama" value={form.nama} onChange={set('nama')} placeholder="Nama produk" disabled={loading} />
          {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
        </div>

        {/* Harga */}
        <div className="space-y-1">
          <Label htmlFor="harga">Harga (Rp) *</Label>
          <Input
            id="harga"
            value={form.harga}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '')
              setForm({ ...form, harga: raw ? Number(raw).toLocaleString('id-ID') : '' })
            }}
            placeholder="0"
            disabled={loading}
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
        </div>

        {/* Kategori */}
        <div className="space-y-1">
          <Label>Kategori</Label>
          <Select
            value={form.kategori_id}
            onValueChange={(v) => setForm({ ...form, kategori_id: v })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori (opsional)" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stok */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="stok"
            checked={form.stok_tersedia}
            onChange={(e) => setForm({ ...form, stok_tersedia: e.target.checked })}
            disabled={loading}
            className="h-4 w-4 accent-[#1a6b3c]"
          />
          <Label htmlFor="stok" className="cursor-pointer">Stok tersedia</Label>
        </div>

        {/* Deskripsi */}
        <div className="space-y-1">
          <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
          <Textarea
            id="deskripsi"
            value={form.deskripsi}
            onChange={set('deskripsi')}
            placeholder="Deskripsikan produk Anda..."
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-[#1a6b3c] hover:bg-[#145730]" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.navigate({ to: '/seller/produk' })}
            disabled={loading}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "tambah.tsx"
```

---

## Task 20: Create Edit Product Page

**Files:**
- Create: `src/routes/_seller/seller/produk/$produkId/edit.tsx`

- [ ] **Step 1: Buat $produkId/edit.tsx**

```typescript
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { FotoUpload, type FotoItem } from '#/components/produk/foto-upload'
import { getProdukByIdForSeller, updateProduk, getKategoriList } from '#/server/produk'
import { produkSchema } from '#/lib/schemas'

export const Route = createFileRoute('/_seller/seller/produk/$produkId/edit')({
  loader: async ({ params, context }) => {
    const [produk, kategoriList] = await Promise.all([
      getProdukByIdForSeller({ data: { id: params.produkId } }),
      getKategoriList(),
    ])
    if (!produk) throw notFound()
    return { produk, kategoriList, seller: context.seller }
  },
  notFoundComponent: () => (
    <div className="py-12 text-center text-muted-foreground">
      Produk tidak ditemukan.
    </div>
  ),
  component: EditProdukPage,
})

function EditProdukPage() {
  const { produk, kategoriList, seller } = Route.useLoaderData()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    nama: produk.nama,
    harga: produk.harga.toLocaleString('id-ID'),
    deskripsi: produk.deskripsi ?? '',
    kategori_id: produk.kategori_id ?? '',
    stok_tersedia: produk.stok_tersedia,
  })

  const [fotos, setFotos] = useState<FotoItem[]>(
    produk.foto_produk.map((f) => ({
      url: f.url_foto,
      urutan: f.urutan,
      is_utama: f.is_utama,
    }))
  )

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = produkSchema.safeParse({
      nama: form.nama,
      harga: Number(form.harga.replace(/\D/g, '')),
      deskripsi: form.deskripsi || undefined,
      kategori_id: form.kategori_id || undefined,
      stok_tersedia: form.stok_tersedia,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      await updateProduk({
        data: {
          id: produk.id,
          ...result.data,
          fotos: fotos.map((f) => ({ url: f.url, urutan: f.urutan, is_utama: f.is_utama })),
        },
      })
      toast.success('Produk berhasil diperbarui!')
      await router.navigate({ to: '/seller/produk' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Produk</h1>
        <p className="text-sm text-muted-foreground">{produk.nama}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
        <div className="space-y-2">
          <Label>Foto Produk (maks. 5)</Label>
          <FotoUpload sellerId={seller.id} value={fotos} onChange={setFotos} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="nama">Nama Produk *</Label>
          <Input id="nama" value={form.nama} onChange={set('nama')} disabled={loading} />
          {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="harga">Harga (Rp) *</Label>
          <Input
            id="harga"
            value={form.harga}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '')
              setForm({ ...form, harga: raw ? Number(raw).toLocaleString('id-ID') : '' })
            }}
            disabled={loading}
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
        </div>

        <div className="space-y-1">
          <Label>Kategori</Label>
          <Select
            value={form.kategori_id}
            onValueChange={(v) => setForm({ ...form, kategori_id: v })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori (opsional)" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="stok"
            checked={form.stok_tersedia}
            onChange={(e) => setForm({ ...form, stok_tersedia: e.target.checked })}
            disabled={loading}
            className="h-4 w-4 accent-[#1a6b3c]"
          />
          <Label htmlFor="stok" className="cursor-pointer">Stok tersedia</Label>
        </div>

        <div className="space-y-1">
          <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
          <Textarea
            id="deskripsi"
            value={form.deskripsi}
            onChange={set('deskripsi')}
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-[#1a6b3c] hover:bg-[#145730]" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.navigate({ to: '/seller/produk' })}
            disabled={loading}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "edit.tsx"
```

---

## Task 21: Create Seller Profile Page

**Files:**
- Create: `src/routes/_seller/seller/profil.tsx`

- [ ] **Step 1: Buat profil.tsx**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { updateSellerProfil } from '#/server/auth'
import { profilSchema } from '#/lib/schemas'
import { createClient } from '#/lib/supabase/client'
import { fotoSchema } from '#/lib/schemas'

export const Route = createFileRoute('/_seller/seller/profil')({
  component: ProfilPage,
})

function ProfilPage() {
  const { seller } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nama_toko: seller.nama_toko,
    nomor_wa: seller.nomor_wa,
    deskripsi_toko: seller.deskripsi_toko ?? '',
  })
  const [fotoToko, setFotoToko] = useState(seller.foto_toko_url ?? '')

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value })

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = fotoSchema.safeParse({ size: file.size, type: file.type })
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    setUploadingFoto(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${seller.id}/toko_${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('foto-toko').upload(path, file, { upsert: true })
    if (error) {
      toast.error('Gagal upload foto')
      setUploadingFoto(false)
      return
    }

    const { data: urlData } = supabase.storage.from('foto-toko').getPublicUrl(path)
    setFotoToko(urlData.publicUrl)
    setUploadingFoto(false)
    toast.success('Foto toko berhasil diupload')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = profilSchema.safeParse({
      ...form,
      deskripsi_toko: form.deskripsi_toko || undefined,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      await updateSellerProfil({
        data: {
          ...result.data,
          foto_toko_url: fotoToko || undefined,
        },
      })
      toast.success('Profil berhasil diperbarui!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Toko</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi toko Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6">
        {/* Foto Toko */}
        <div className="space-y-2">
          <Label>Foto Toko</Label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border bg-gray-100">
              {fotoToko ? (
                <img src={fotoToko} alt="Foto toko" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                  No foto
                </div>
              )}
            </div>
            <div>
              <label htmlFor="foto-toko" className="cursor-pointer">
                <span className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                  {uploadingFoto ? 'Mengupload...' : 'Ganti Foto'}
                </span>
                <input
                  id="foto-toko"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoChange}
                  className="hidden"
                  disabled={uploadingFoto}
                />
              </label>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP • Maks 2MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="nama_toko">Nama Toko *</Label>
          <Input id="nama_toko" value={form.nama_toko} onChange={set('nama_toko')} disabled={loading} />
          {errors.nama_toko && <p className="text-xs text-red-500">{errors.nama_toko}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="nomor_wa">Nomor WhatsApp *</Label>
          <Input id="nomor_wa" value={form.nomor_wa} onChange={set('nomor_wa')} placeholder="08xx atau 628xx" disabled={loading} />
          {errors.nomor_wa && <p className="text-xs text-red-500">{errors.nomor_wa}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="deskripsi_toko">Deskripsi Toko (opsional)</Label>
          <Textarea
            id="deskripsi_toko"
            value={form.deskripsi_toko}
            onChange={set('deskripsi_toko')}
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Info toko publik */}
        <div className="rounded-md bg-gray-50 p-3 text-sm">
          <p className="font-medium">Info Toko</p>
          <p className="text-muted-foreground">Email: {seller.email}</p>
          <p className="text-muted-foreground">
            URL Toko: /toko/{seller.slug_toko}
          </p>
        </div>

        <Button type="submit" className="bg-[#1a6b3c] hover:bg-[#145730]" disabled={loading || uploadingFoto}>
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "profil.tsx"
```

---

## Task 22: Update Navbar with Seller State

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar.tsx dengan seller state**

```typescript
import { useState, useEffect } from 'react'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { Menu, X, Store, ChevronDown, LayoutDashboard, Package, UserCircle, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { getCurrentSeller, logoutSeller } from '#/server/auth'
import type { Seller } from '#/lib/supabase/types'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/produk', label: 'Produk' },
  { href: '/tentang', label: 'Tentang' },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [sellerMenuOpen, setSellerMenuOpen] = useState(false)
  const [seller, setSeller] = useState<Seller | null>(null)
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    getCurrentSeller().then(setSeller).catch(() => setSeller(null))
  }, [location.pathname])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  const handleLogout = async () => {
    try {
      await logoutSeller()
      setSeller(null)
      setSellerMenuOpen(false)
      toast.success('Berhasil keluar')
      await router.navigate({ to: '/' })
    } catch {
      toast.error('Gagal keluar')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-[#1a6b3c]">
          SHS
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors ${
                isActive(link.href)
                  ? 'font-medium text-[#1a6b3c]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Seller state */}
          {seller ? (
            <div className="relative">
              <button
                onClick={() => setSellerMenuOpen(!sellerMenuOpen)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#1a6b3c] hover:bg-[#e8f5e9]"
              >
                <Store className="h-4 w-4" />
                {seller.nama_toko}
                <ChevronDown className="h-3 w-3" />
              </button>
              {sellerMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-white shadow-lg">
                  {[
                    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/seller/produk', label: 'Produk Saya', icon: Package },
                    { to: '/seller/profil', label: 'Profil Toko', icon: UserCircle },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setSellerMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {label}
                    </Link>
                  ))}
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/seller/login"
              className="rounded-md bg-[#1a6b3c] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#145730]"
            >
              Masuk Seller
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm ${
                isActive(link.href)
                  ? 'font-medium text-[#1a6b3c]'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          {seller ? (
            <>
              <p className="py-1 text-xs font-semibold text-muted-foreground">{seller.nama_toko}</p>
              {[
                { to: '/seller/dashboard', label: 'Dashboard' },
                { to: '/seller/produk', label: 'Produk Saya' },
                { to: '/seller/profil', label: 'Profil Toko' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground">
                  {label}
                </Link>
              ))}
              <button onClick={handleLogout} className="block py-2 text-sm text-red-600">
                Keluar
              </button>
            </>
          ) : (
            <Link
              to="/seller/login"
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-[#1a6b3c]"
            >
              Masuk Seller
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Verifikasi**

```bash
pnpm typecheck 2>&1 | grep "Navbar.tsx"
```

---

## Task 23: Full Build Verification

- [ ] **Step 1: Jalankan typecheck lengkap**

```bash
pnpm typecheck 2>&1 | grep -E "error TS"
```

Expected: Tidak ada error TS (atau hanya warning yang bisa diabaikan).

- [ ] **Step 2: Jalankan dev server dan cek halaman**

```bash
pnpm dev
```

Cek secara manual:
- `http://localhost:3000/seller/login` → Form login tampil
- `http://localhost:3000/seller/register` → Form register tampil
- `http://localhost:3000/seller/dashboard` → Redirect ke login (belum auth)
- Login dengan seller yang sudah ada (buat user di Supabase Auth jika perlu)
- Setelah login: Dashboard, Produk, Profil bisa diakses

- [ ] **Step 3: Test flow lengkap**

1. Register seller baru → cek Supabase Auth + sellers table
2. Login → redirect ke dashboard
3. Dashboard menampilkan stats (semua 0 jika seller baru)
4. Tambah produk dengan foto → cek foto_produk + storage bucket
5. Edit produk → foto lama terpreserve
6. Hapus produk → soft delete (deleted_at diisi)
7. Update profil → nama toko berubah
8. Logout → redirect ke login

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: seller auth, dashboard analytics, produk CRUD + foto upload (Prompt 2B)"
```

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task |
|---|---|
| Supabase Auth login/register/logout | T5, T10, T11 |
| Protected routes via _seller layout | T13 |
| Seller sidebar navigation | T12 |
| Dashboard analytics (cards, chart, table) | T8, T14, T15 |
| CRUD produk | T6, T18, T19, T20 |
| Upload foto ke Supabase Storage | T1, T16 |
| Edit profil seller | T5, T21 |
| Storage buckets setup | T1 |
| Update Navbar (seller dropdown) | T22 |
| Toast notifications | T9 |
| Supabase Storage buckets | T1 |
| Halaman /seller/login | T10 |
| Halaman /seller/register | T11 |
| Halaman /seller/dashboard | T15 |
| Halaman /seller/produk | T18 |
| Halaman /seller/produk/tambah | T19 |
| Halaman /seller/produk/$id/edit | T20 |
| Halaman /seller/profil | T21 |

Semua requirement tercakup.

### Catatan Penting

1. **Context di _seller/seller/*** routes — File `tambah.tsx` dan `edit.tsx` mengakses `context.seller` di loader. Ini tersedia karena `_seller.tsx` `beforeLoad` return `{ seller }`. Jika ada TypeScript error pada `context.seller`, tambahkan tipe eksplisit: `loader: async ({ context }: { context: { seller: Seller } }) => {...}`.

2. **Import `createClient` di server/supabase.ts** — `createClient` dari `@supabase/ssr` tidak sama dengan `createBrowserClient`. Pastikan import yang benar. Ganti dengan `createClient` dari `@supabase/supabase-js` untuk service client:
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   ```

3. **seller.is_active** — Seller yang baru register punya `is_active = false`. Mereka bisa login tapi halaman mereka di `/toko/$slugToko` tidak tampil (karena query filter `is_active = true`). Ini by design — admin perlu mengaktifkan akun dulu.

4. **routeTree.gen.ts** — TanStack Router auto-generate ini. Setelah menambah route baru di `_seller/`, jalankan `pnpm dev` sekali agar routeTree di-regenerate otomatis.

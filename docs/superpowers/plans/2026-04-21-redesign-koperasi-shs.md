# Redesign Koperasi SHS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign semua 11 halaman Koperasi SHS dengan estetik Soft Modern — Plus Jakarta Sans + DM Sans, Forest Green (#2d6a4f) + Saffron (#d97706), WhatsApp button hijau resmi (#25D366), mobile-responsive.

**Architecture:** Pendekatan B — shared components dulu lalu halaman. Design tokens di `src/styles.css`, font Google di `__root.tsx`, lalu redesign komponen dari yang paling banyak dipakai ke halaman leaf. Tidak ada perubahan logic/server — hanya JSX dan className.

**Tech Stack:** React, TanStack Router, Tailwind CSS v4, shadcn/ui, Lucide React, Recharts

---

## Peta File

| File | Tindakan |
|------|----------|
| `src/styles.css` | Modify — tambah CSS custom properties SHS |
| `src/routes/__root.tsx` | Modify — tambah Google Fonts link |
| `src/components/Navbar.tsx` | Modify — redesign full |
| `src/components/Footer.tsx` | Modify — redesign full |
| `src/components/ProductCard.tsx` | Modify — redesign full |
| `src/components/KategoriFilter.tsx` | Modify — redesign pill style |
| `src/components/SearchBar.tsx` | Modify — redesign input |
| `src/components/Pagination.tsx` | Modify — redesign tombol |
| `src/components/HeroBanner.tsx` | Modify — redesign full |
| `src/components/WhatsAppButton.tsx` | Modify — sudah WA green, polish shadow |
| `src/components/seller/SellerSidebar.tsx` | Modify — dark sidebar |
| `src/components/dashboard/stat-card.tsx` | Modify — redesign card |
| `src/components/dashboard/klik-chart.tsx` | Modify — warna chart |
| `src/components/dashboard/produk-table.tsx` | Modify — redesign table |
| `src/routes/index.tsx` | Modify — layout beranda |
| `src/routes/produk/index.tsx` | Modify — layout produk list |
| `src/routes/produk/$slug.tsx` | Modify — layout detail |
| `src/routes/toko/$slugToko.tsx` | Modify — layout toko |
| `src/routes/tentang.tsx` | Modify — layout tentang |
| `src/routes/seller/login.tsx` | Modify — layout login |
| `src/routes/seller/register.tsx` | Modify — layout register |
| `src/routes/_seller.tsx` | Modify — seller shell layout |
| `src/routes/_seller/seller/dashboard.tsx` | Modify — layout dashboard |
| `src/routes/_seller/seller/produk/index.tsx` | Modify — layout produk list seller |
| `src/routes/_seller/seller/produk/tambah.tsx` | Modify — layout tambah produk |
| `src/routes/_seller/seller/produk/$produkId/edit.tsx` | Modify — layout edit produk |
| `src/routes/_seller/seller/profil.tsx` | Modify — layout profil |

---

## Task 1: Design Tokens + Font Setup

**Files:**
- Modify: `src/styles.css`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Tambah Google Fonts link di `__root.tsx`**

Ganti bagian `head: () => ({` di `src/routes/__root.tsx`:

```tsx
head: () => ({
  meta: [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'Koperasi SHS — Bersama Tumbuh, Bersama Sejahtera' },
    {
      name: 'description',
      content:
        'Koperasi Selaras Harmoni Sejahtera — platform digital koperasi yang menghubungkan anggota dengan pembeli secara langsung.',
    },
  ],
  links: [
    { rel: 'stylesheet', href: appCss },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap',
    },
  ],
}),
```

- [ ] **Step 2: Tambah design tokens di `src/styles.css`**

Ganti seluruh isi `src/styles.css` dengan:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-shs-green-950: #0a2218;
  --color-shs-green-900: #1a4d2e;
  --color-shs-green-700: #2d6a4f;
  --color-shs-green-500: #40916c;
  --color-shs-green-300: #74c69d;
  --color-shs-green-100: #d8f3dc;
  --color-shs-green-50: #eaf7ed;
  --color-shs-saffron-600: #b45309;
  --color-shs-saffron-500: #d97706;
  --color-shs-saffron-100: #fef3c7;
  --color-shs-saffron-50: #fffbeb;
  --color-shs-wa: #25D366;
  --color-shs-wa-dark: #128C7E;
  --font-jakarta: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-dm: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

@theme inline {
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 3: Jalankan dev server dan pastikan tidak ada error**

```bash
npm run dev
```

Expected: Server berjalan tanpa error, font Plus Jakarta Sans terload di browser (cek Network tab).

- [ ] **Step 4: Commit**

```bash
git add src/styles.css src/routes/__root.tsx
git commit -m "feat: add SHS design tokens and Google Fonts"
```

---

## Task 2: Redesign Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Ganti seluruh isi `src/components/Navbar.tsx`**

```tsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { Menu, X, LayoutDashboard, Package, UserCircle, LogOut, ChevronDown } from 'lucide-react'
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
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-[17px] font-extrabold tracking-tight text-[#1a4d2e]">
          Koperasi <span className="text-[#d97706]">SHS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-[DM_Sans] text-[13px] font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#2d6a4f]'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center md:flex">
          {seller ? (
            <div className="relative">
              <button
                onClick={() => setSellerMenuOpen(!sellerMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-[#eaf7ed] px-4 py-2 text-[13px] font-bold text-[#2d6a4f] transition-colors hover:bg-[#d8f3dc]"
              >
                <span className="max-w-[120px] truncate">{seller.nama_toko}</span>
                <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
              </button>
              {sellerMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-lg">
                  {[
                    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/seller/produk', label: 'Produk Saya', icon: Package },
                    { to: '/seller/profil', label: 'Profil Toko', icon: UserCircle },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] transition-colors hover:bg-[#f3f4f6]"
                      onClick={() => setSellerMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-[#9ca3af]" />
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-[#f3f4f6]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 transition-colors hover:bg-red-50"
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
              className="rounded-full bg-[#2d6a4f] px-5 py-2 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(45,106,79,0.3)] transition-all hover:bg-[#1a4d2e] hover:shadow-[0_6px_16px_rgba(45,106,79,0.35)]"
            >
              Masuk Seller
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-[#374151] hover:bg-[#f3f4f6] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#eaf7ed] text-[#2d6a4f]'
                    : 'text-[#4b5563] hover:bg-[#f3f4f6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="my-3 border-t border-[#f3f4f6]" />
          {seller ? (
            <div className="flex flex-col gap-1">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#9ca3af]">
                {seller.nama_toko}
              </p>
              {[
                { to: '/seller/dashboard', label: 'Dashboard' },
                { to: '/seller/produk', label: 'Produk Saya' },
                { to: '/seller/profil', label: 'Profil Toko' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[14px] text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-[14px] text-red-600 hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              to="/seller/login"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-[#2d6a4f] px-4 py-2.5 text-center text-[14px] font-bold text-white"
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

- [ ] **Step 2: Verifikasi di browser**

Jalankan `npm run dev`, buka `http://localhost:3000`. Pastikan:
- Logo "Koperasi **SHS**" dengan SHS berwarna saffron/kuning
- Nav links abu-abu, active hijau
- Tombol "Masuk Seller" hijau dengan shadow
- Mobile: hamburger membuka drawer dengan animasi

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: redesign Navbar — Jakarta Sans, saffron logo, pill CTA"
```

---

## Task 3: Redesign Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Ganti seluruh isi `src/components/Footer.tsx`**

```tsx
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-[#0a2218] px-4 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="text-[17px] font-extrabold tracking-tight">
            Koperasi <span className="text-[#d97706]">SHS</span>
          </p>
          <p className="mt-3 font-[DM_Sans] text-[13px] leading-relaxed text-white/50">
            Bersama Tumbuh, Bersama Sejahtera.<br />
            Platform digital koperasi Indonesia.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[2px] text-white/30">
            Navigasi
          </p>
          <div className="flex flex-col gap-2">
            {[
              { to: '/', label: 'Beranda' },
              { to: '/produk', label: 'Produk' },
              { to: '/tentang', label: 'Tentang Kami' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-[DM_Sans] text-[13px] text-white/50 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[2px] text-white/30">
            Seller
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/seller/login"
              className="font-[DM_Sans] text-[13px] text-white/50 transition-colors hover:text-white"
            >
              Masuk sebagai Seller
            </Link>
            <Link
              to="/seller/register"
              className="font-[DM_Sans] text-[13px] text-white/50 transition-colors hover:text-white"
            >
              Daftar Jadi Seller
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center font-[DM_Sans] text-[11px] text-white/30">
        © 2026 Koperasi Selaras Harmoni Sejahtera. Hak cipta dilindungi.
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: redesign Footer — dark green bg, saffron logo"
```

---

## Task 4: Redesign ProductCard

**Files:**
- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: Ganti seluruh isi `src/components/ProductCard.tsx`**

```tsx
import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { formatRupiah } from '#/lib/format'
import type { ProdukWithDetails } from '#/lib/supabase/types'

export function ProductCard({ produk }: { produk: ProdukWithDetails }) {
  return (
    <Link to="/produk/$slug" params={{ slug: produk.slug }} className="group block">
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#eaf7ed]">
          {produk.foto_utama ? (
            <img
              src={produk.foto_utama}
              alt={produk.nama}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-12 w-12 text-[#74c69d]" />
            </div>
          )}
          {!produk.stok_tersedia && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#374151]">
                Stok Habis
              </span>
            </div>
          )}
          {produk.kategori && (
            <div className="absolute left-2 top-2">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#2d6a4f] backdrop-blur-sm">
                {produk.kategori.nama_kategori}
              </span>
            </div>
          )}
        </div>
        {/* Body */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[#111827]">
            {produk.nama}
          </h3>
          <p className="mt-1.5 text-[15px] font-extrabold tracking-tight text-[#2d6a4f]">
            {formatRupiah(produk.harga)}
          </p>
          {produk.sellers && (
            <p className="mt-1 truncate font-[DM_Sans] text-[11px] text-[#9ca3af]">
              {produk.sellers.nama_toko}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: redesign ProductCard — hover lift, kategori badge, stok overlay"
```

---

## Task 5: Redesign KategoriFilter, SearchBar, Pagination

**Files:**
- Modify: `src/components/KategoriFilter.tsx`
- Modify: `src/components/SearchBar.tsx`
- Modify: `src/components/Pagination.tsx`

- [ ] **Step 1: Ganti `src/components/KategoriFilter.tsx`**

```tsx
import type { Kategori } from '#/lib/supabase/types'

export function KategoriFilter({
  kategori,
  activeSlug,
  onSelect,
}: {
  kategori: Kategori[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-[12px] font-bold transition-all ${
          activeSlug === null
            ? 'border-[#2d6a4f] bg-[#2d6a4f] text-white shadow-[0_2px_8px_rgba(45,106,79,0.25)]'
            : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
        }`}
      >
        Semua
      </button>
      {kategori.map((kat) => (
        <button
          key={kat.id}
          onClick={() => onSelect(kat.slug)}
          className={`flex-shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-[12px] font-bold transition-all ${
            activeSlug === kat.slug
              ? 'border-[#2d6a4f] bg-[#2d6a4f] text-white shadow-[0_2px_8px_rgba(45,106,79,0.25)]'
              : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
          }`}
        >
          {kat.nama_kategori}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Ganti `src/components/SearchBar.tsx`**

```tsx
import { useState, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'

export function SearchBar({
  defaultValue = '',
  onSearch,
}: {
  defaultValue?: string
  onSearch: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onSearch(newValue), 300)
    },
    [onSearch]
  )

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
      <input
        type="text"
        placeholder="Cari produk..."
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white py-2.5 pl-10 pr-4 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] transition-all"
      />
    </div>
  )
}
```

- [ ] **Step 3: Ganti `src/components/Pagination.tsx`**

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-[#e5e7eb] bg-white text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
            page === currentPage
              ? 'bg-[#2d6a4f] text-white shadow-[0_2px_8px_rgba(45,106,79,0.3)]'
              : 'border-[1.5px] border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-[#e5e7eb] bg-white text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/KategoriFilter.tsx src/components/SearchBar.tsx src/components/Pagination.tsx
git commit -m "feat: redesign KategoriFilter, SearchBar, Pagination"
```

---

## Task 6: Redesign HeroBanner + WhatsAppButton

**Files:**
- Modify: `src/components/HeroBanner.tsx`
- Modify: `src/components/WhatsAppButton.tsx`

- [ ] **Step 1: Ganti `src/components/HeroBanner.tsx`**

```tsx
import { Link } from '@tanstack/react-router'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eaf7ed] via-[#f0fdf4] to-[#fffbeb] px-4 py-16 md:py-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#74c69d] opacity-10" />
      <div className="pointer-events-none absolute -bottom-8 right-32 h-48 w-48 rounded-full bg-[#f59e0b] opacity-10" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[3px] text-[#d97706]">
            ✦ Platform Koperasi Digital
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1a4d2e] md:text-5xl">
            Belanja Produk<br />
            <span className="text-[#2d6a4f]">Lokal</span> Terbaik
          </h1>
          <p className="mt-4 font-[DM_Sans] text-[15px] leading-relaxed text-[#4b5563]">
            Dukung anggota koperasi — temukan produk segar &amp;<br className="hidden md:block" />
            berkualitas langsung dari produsennya.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              to="/produk"
              className="rounded-full bg-[#2d6a4f] px-7 py-3 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(45,106,79,0.35)] transition-all hover:bg-[#1a4d2e] hover:shadow-[0_6px_20px_rgba(45,106,79,0.4)]"
            >
              Lihat Produk
            </Link>
            <Link
              to="/tentang"
              className="rounded-full border-2 border-[#2d6a4f] px-7 py-3 text-[14px] font-bold text-[#2d6a4f] transition-all hover:bg-[#eaf7ed]"
            >
              Tentang Kami
            </Link>
          </div>
        </div>

        {/* Decorative grid — hidden on mobile */}
        <div className="hidden flex-shrink-0 md:grid md:grid-cols-2 md:gap-3">
          {[
            'bg-white border-[#d8f3dc]',
            'bg-white border-[#fef3c7] mt-4',
            'bg-white border-[#d8f3dc] -mt-2',
            'bg-white border-[#d8f3dc]',
          ].map((cls, i) => (
            <div
              key={i}
              className={`h-24 w-24 rounded-2xl border-2 shadow-[0_4px_16px_rgba(0,0,0,0.07)] ${cls}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Ganti `src/components/WhatsAppButton.tsx`**

```tsx
import { buildWhatsAppUrl } from '#/lib/whatsapp'
import { trackWaClick } from '#/server/produk'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export function WhatsAppButton({
  nomorWa,
  namaProduk,
  harga,
  produkId,
  disabled = false,
}: {
  nomorWa: string
  namaProduk: string
  harga: number
  produkId: string
  disabled?: boolean
}) {
  const handleClick = () => {
    trackWaClick({ data: { produkId } }).catch(() => {})
    const url = buildWhatsAppUrl(nomorWa, namaProduk, harga)
    window.open(url, '_blank')
  }

  if (disabled) {
    return (
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full bg-[#9ca3af] px-6 py-3.5 text-[14px] font-bold text-white opacity-60"
      >
        {WA_ICON}
        Stok Habis
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:bg-[#128C7E] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)]"
    >
      {WA_ICON}
      Hubungi via WhatsApp
    </button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroBanner.tsx src/components/WhatsAppButton.tsx
git commit -m "feat: redesign HeroBanner with blobs, polish WhatsAppButton"
```

---

## Task 7: Redesign SellerSidebar

**Files:**
- Modify: `src/components/seller/SellerSidebar.tsx`

- [ ] **Step 1: Ganti seluruh isi `src/components/seller/SellerSidebar.tsx`**

```tsx
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, Package, UserCircle, LogOut, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
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

  const initials = seller.nama_toko.slice(0, 2).toUpperCase()

  return (
    <aside className="flex h-full w-60 flex-col bg-[#0a2218] text-white">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-5">
        <Link to="/" className="text-[15px] font-extrabold tracking-tight text-white">
          Koperasi <span className="text-[#d97706]">SHS</span>
        </Link>
        <p className="mt-0.5 font-[DM_Sans] text-[10px] uppercase tracking-[2px] text-white/30">
          Seller Portal
        </p>
      </div>

      {/* Avatar */}
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#40916c] bg-[#2d6a4f] text-[13px] font-extrabold text-white">
            {seller.foto_toko_url ? (
              <img src={seller.foto_toko_url} alt={seller.nama_toko} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-white/90">{seller.nama_toko}</p>
            <p className="truncate font-[DM_Sans] text-[10px] text-white/35">{seller.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[2.5px] text-white/25">
          Menu
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                isActive(to)
                  ? 'bg-[#2d6a4f] text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        <p className="mb-2 mt-6 px-2 text-[9px] font-bold uppercase tracking-[2.5px] text-white/25">
          Lainnya
        </p>
        <Link
          to="/toko/$slugToko"
          params={{ slugToko: seller.slug_toko }}
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          Lihat Toko
        </Link>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-white/40 transition-colors hover:bg-red-900/30 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/seller/SellerSidebar.tsx
git commit -m "feat: redesign SellerSidebar — dark #0a2218, avatar initials, lihat toko link"
```

---

## Task 8: Redesign Dashboard Components

**Files:**
- Modify: `src/components/dashboard/stat-card.tsx`
- Modify: `src/components/dashboard/klik-chart.tsx`
- Modify: `src/components/dashboard/produk-table.tsx`

- [ ] **Step 1: Ganti `src/components/dashboard/stat-card.tsx`**

```tsx
import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  className?: string
  accent?: 'green' | 'wa' | 'saffron'
}

const ACCENT_MAP = {
  green:   { icon: 'bg-[#eaf7ed]', iconColor: 'text-[#2d6a4f]', value: 'text-[#2d6a4f]', desc: 'text-[#40916c]' },
  wa:      { icon: 'bg-[#dcf8c6]', iconColor: 'text-[#128C7E]', value: 'text-[#128C7E]', desc: 'text-[#128C7E]' },
  saffron: { icon: 'bg-[#fef3c7]', iconColor: 'text-[#d97706]', value: 'text-[#d97706]', desc: 'text-[#b45309]' },
}

export function StatCard({ title, value, description, icon: Icon, className, accent = 'green' }: StatCardProps) {
  const colors = ACCENT_MAP[accent]
  return (
    <div className={cn('rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]', className)}>
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon}`}>
        <Icon className={`h-5 w-5 ${colors.iconColor}`} />
      </div>
      <p className="font-[DM_Sans] text-[11px] font-medium uppercase tracking-[1px] text-[#9ca3af]">{title}</p>
      <p className={`mt-1 text-[32px] font-extrabold tracking-tight ${colors.value}`}>{value}</p>
      {description && (
        <p className={`mt-1 font-[DM_Sans] text-[11px] font-medium ${colors.desc}`}>{description}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Ganti `src/components/dashboard/klik-chart.tsx`**

```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

type KlikChartProps = {
  data: Array<{ tanggal: string; klik: number }>
}

export function KlikChart({ data }: KlikChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
  }))

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <h3 className="mb-4 text-[14px] font-bold text-[#111827]">Klik WhatsApp — 30 Hari Terakhir</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} interval={6} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            formatter={((value: unknown) => [value, 'Klik']) as never}
          />
          <Line
            type="monotone"
            dataKey="klik"
            stroke="#2d6a4f"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#2d6a4f', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 3: Baca `src/components/dashboard/produk-table.tsx` dulu untuk memahami tipe data yang dipakai**

```bash
cat src/components/dashboard/produk-table.tsx
```

- [ ] **Step 4: Ganti `src/components/dashboard/produk-table.tsx`**

Sesuaikan tipe data dengan isi asli file, hanya ganti JSX/className:

```tsx
import { formatRupiah } from '#/lib/format'

type ProdukPerforma = {
  id: string
  nama: string
  foto_utama: string | null
  harga: number
  stok_tersedia: boolean
  total_klik: number
}

export function ProdukTable({ data }: { data: ProdukPerforma[] }) {
  if (data.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f3f4f6] px-5 py-4">
        <h3 className="text-[14px] font-bold text-[#111827]">Performa Produk</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#f3f4f6] bg-[#fafafa]">
              <th className="px-5 py-3 text-left font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Produk</th>
              <th className="px-5 py-3 text-right font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Harga</th>
              <th className="px-5 py-3 text-center font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Klik WA</th>
              <th className="px-5 py-3 text-center font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Stok</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#fafafa]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-[#eaf7ed]">
                      {p.foto_utama && (
                        <img src={p.foto_utama} alt={p.nama} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="font-semibold text-[#111827]">{p.nama}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-bold text-[#2d6a4f]">{formatRupiah(p.harga)}</td>
                <td className="px-5 py-3 text-center font-bold text-[#128C7E]">{p.total_klik}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    p.stok_tersedia
                      ? 'bg-[#d8f3dc] text-[#1a4d2e]'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {p.stok_tersedia ? 'Tersedia' : 'Habis'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/stat-card.tsx src/components/dashboard/klik-chart.tsx src/components/dashboard/produk-table.tsx
git commit -m "feat: redesign dashboard components — stat card accents, chart polish, table"
```

---

## Task 9: Redesign Halaman Beranda

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Ganti JSX di `src/routes/index.tsx`**

Hanya ganti fungsi `BerandaPage`, jangan ubah loader:

```tsx
function BerandaPage() {
  const { produkResult, kategoriList } = Route.useLoaderData()

  return (
    <div>
      <HeroBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-extrabold tracking-tight text-[#111827]">
            Produk Terbaru
          </h2>
          <Link
            to="/produk"
            className="font-[DM_Sans] text-[13px] font-semibold text-[#2d6a4f] transition-colors hover:text-[#1a4d2e]"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="mb-5">
          <KategoriFilter
            kategori={kategoriList}
            activeSlug={null}
            onSelect={(slug) => {
              window.location.href = slug ? `/produk?kategori=${slug}` : '/produk'
            }}
          />
        </div>
        <ProductGrid products={produkResult.data.slice(0, 8)} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: redesign Beranda page layout"
```

---

## Task 10: Redesign Halaman Produk List

**Files:**
- Modify: `src/routes/produk/index.tsx`

- [ ] **Step 1: Ganti fungsi `ProdukListPage`**

```tsx
function ProdukListPage() {
  const { produkResult, kategoriList } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/produk/' })

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-[24px] font-extrabold tracking-tight text-[#111827]">
          Semua Produk
        </h1>
        <div className="mb-4">
          <SearchBar
            defaultValue={search.search ?? ''}
            onSearch={(value) =>
              navigate({ search: { ...search, search: value || undefined, page: 1 } })
            }
          />
        </div>
        <div className="mb-6">
          <KategoriFilter
            kategori={kategoriList}
            activeSlug={search.kategori ?? null}
            onSelect={(slug) =>
              navigate({ search: { ...search, kategori: slug ?? undefined, page: 1 } })
            }
          />
        </div>
        {produkResult.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white py-20 text-center">
            <p className="text-[15px] font-bold text-[#374151]">Tidak ada produk ditemukan</p>
            <p className="mt-1 font-[DM_Sans] text-[13px] text-[#9ca3af]">Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          <ProductGrid products={produkResult.data} />
        )}
        <Pagination
          currentPage={produkResult.page}
          totalPages={produkResult.totalPages}
          onPageChange={(page) => navigate({ search: { ...search, page } })}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/produk/index.tsx
git commit -m "feat: redesign Produk List page — gray bg, empty state"
```

---

## Task 11: Redesign Halaman Detail Produk

**Files:**
- Modify: `src/routes/produk/$slug.tsx`

- [ ] **Step 1: Ganti fungsi `ProdukDetailPage` dan `notFoundComponent`**

```tsx
// notFoundComponent:
notFoundComponent: () => (
  <div className="flex flex-col items-center justify-center py-24">
    <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">404</p>
    <h1 className="mt-2 text-[24px] font-extrabold text-[#111827]">Produk Tidak Ditemukan</h1>
    <p className="mt-2 font-[DM_Sans] text-[14px] text-[#9ca3af]">
      Produk yang Anda cari tidak ada atau sudah dihapus.
    </p>
    <Link
      to="/produk"
      className="mt-6 rounded-full bg-[#2d6a4f] px-6 py-2.5 text-[13px] font-bold text-white hover:bg-[#1a4d2e]"
    >
      ← Kembali ke Produk
    </Link>
  </div>
),

// ProdukDetailPage:
function ProdukDetailPage() {
  const produk = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/produk"
          className="mb-6 inline-flex items-center gap-1.5 font-[DM_Sans] text-[13px] font-semibold text-[#2d6a4f] hover:text-[#1a4d2e]"
        >
          ← Kembali ke produk
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Gallery */}
            <div className="border-b border-[#f3f4f6] p-6 md:border-b-0 md:border-r">
              <PhotoGallery fotos={produk.foto_produk} />
            </div>

            {/* Info */}
            <div className="flex flex-col p-6">
              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#111827]">
                {produk.nama}
              </h1>
              <p className="mt-2 text-[26px] font-extrabold tracking-tight text-[#2d6a4f]">
                {formatRupiah(produk.harga)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {produk.kategori && (
                  <span className="rounded-full bg-[#d8f3dc] px-3 py-1 text-[11px] font-bold text-[#1a4d2e]">
                    {produk.kategori.nama_kategori}
                  </span>
                )}
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  produk.stok_tersedia
                    ? 'bg-[#d8f3dc] text-[#1a4d2e]'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {produk.stok_tersedia ? 'Tersedia' : 'Stok Habis'}
                </span>
              </div>

              {produk.deskripsi && (
                <p className="mt-4 font-[DM_Sans] text-[14px] leading-relaxed text-[#4b5563]">
                  {produk.deskripsi}
                </p>
              )}

              <div className="my-5 border-t border-[#f3f4f6]" />

              {produk.sellers && (
                <div className="mb-5">
                  <p className="font-[DM_Sans] text-[11px] uppercase tracking-[1px] text-[#9ca3af]">
                    Dijual oleh
                  </p>
                  <Link
                    to="/toko/$slugToko"
                    params={{ slugToko: produk.sellers.slug_toko }}
                    className="mt-0.5 text-[14px] font-bold text-[#2d6a4f] hover:text-[#1a4d2e] hover:underline"
                  >
                    {produk.sellers.nama_toko} →
                  </Link>
                </div>
              )}

              <div className="mt-auto">
                <WhatsAppButton
                  nomorWa={produk.sellers?.nomor_wa ?? ''}
                  namaProduk={produk.nama}
                  harga={produk.harga}
                  produkId={produk.id}
                  disabled={!produk.stok_tersedia || !produk.sellers}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/produk/'$slug.tsx'
git commit -m "feat: redesign Produk Detail page — card layout, sticky WA button"
```

---

## Task 12: Redesign Halaman Toko + Tentang

**Files:**
- Modify: `src/routes/toko/$slugToko.tsx`
- Modify: `src/routes/tentang.tsx`

- [ ] **Step 1: Ganti `TokoPage` di `src/routes/toko/$slugToko.tsx`**

```tsx
// notFoundComponent:
notFoundComponent: () => (
  <div className="flex flex-col items-center justify-center py-24">
    <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">404</p>
    <h1 className="mt-2 text-[24px] font-extrabold text-[#111827]">Toko Tidak Ditemukan</h1>
    <p className="mt-2 font-[DM_Sans] text-[14px] text-[#9ca3af]">
      Toko yang Anda cari tidak ada atau sudah tidak aktif.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-[#2d6a4f] px-6 py-2.5 text-[13px] font-bold text-white hover:bg-[#1a4d2e]"
    >
      ← Kembali ke Beranda
    </Link>
  </div>
),

// TokoPage:
function TokoPage() {
  const seller = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Store header */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="bg-gradient-to-br from-[#eaf7ed] to-[#f0fdf4] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#2d6a4f] shadow-[0_4px_16px_rgba(45,106,79,0.25)]">
                {seller.foto_toko_url ? (
                  <img src={seller.foto_toko_url} alt={seller.nama_toko} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[22px] font-extrabold text-white">
                    {seller.nama_toko.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-[22px] font-extrabold tracking-tight text-[#1a4d2e]">
                  {seller.nama_toko}
                </h1>
                {seller.deskripsi_toko && (
                  <p className="mt-1 font-[DM_Sans] text-[13px] text-[#4b5563]">
                    {seller.deskripsi_toko}
                  </p>
                )}
                <span className="mt-2 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-[#2d6a4f]">
                  {seller.produk.length} Produk
                </span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-[17px] font-bold text-[#111827]">Produk Toko</h2>
        <ProductGrid products={seller.produk} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Ganti `TentangPage` di `src/routes/tentang.tsx`**

```tsx
function TentangPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[3px] text-[#d97706]">
            Tentang Kami
          </p>
          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#1a4d2e] md:text-[40px]">
            Koperasi <span className="text-[#d97706]">Selaras</span><br />
            Harmoni Sejahtera
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-[DM_Sans] text-[15px] leading-relaxed text-[#4b5563]">
            Platform digital yang menghubungkan anggota koperasi dengan pembeli
            secara langsung. Kami percaya teknologi dapat memajukan ekonomi kerakyatan.
          </p>
        </div>

        {/* Visi Misi */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">Visi</p>
            <h2 className="text-[17px] font-bold text-[#1a4d2e]">Koperasi Digital Terdepan</h2>
            <p className="mt-2 font-[DM_Sans] text-[13px] leading-relaxed text-[#4b5563]">
              Menjadi koperasi digital terdepan yang memberdayakan seluruh anggota
              untuk tumbuh dan sejahtera bersama.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">Misi</p>
            <h2 className="text-[17px] font-bold text-[#1a4d2e]">Tiga Pilar Utama</h2>
            <ul className="mt-2 flex flex-col gap-2 font-[DM_Sans] text-[13px] text-[#4b5563]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#2d6a4f]">✓</span> Menyediakan platform digital bagi anggota</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#2d6a4f]">✓</span> Membangun jaringan ekonomi yang transparan</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#2d6a4f]">✓</span> Meningkatkan kesejahteraan melalui teknologi</li>
            </ul>
          </div>
        </div>

        {/* Nilai */}
        <h2 className="mb-4 text-[18px] font-bold text-[#111827]">Nilai-Nilai Kami</h2>
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {NILAI.map((item, i) => (
            <div
              key={item.title}
              className={`flex items-start gap-4 rounded-2xl border p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ${
                i % 2 === 0
                  ? 'border-[#d8f3dc] bg-[#eaf7ed]'
                  : 'border-[#fde68a] bg-[#fffbeb]'
              }`}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                i % 2 === 0 ? 'bg-[#2d6a4f]' : 'bg-[#d97706]'
              }`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#111827]">{item.title}</p>
                <p className="mt-1 font-[DM_Sans] text-[13px] leading-relaxed text-[#4b5563]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#0a2218] p-8 text-center">
          <h2 className="text-[20px] font-extrabold text-white">
            Tertarik Bergabung sebagai Seller?
          </h2>
          <p className="mt-2 font-[DM_Sans] text-[13px] text-white/60">
            Daftarkan toko Anda dan mulai jual produk ke seluruh anggota.
          </p>
          <Link
            to="/seller/register"
            className="mt-6 inline-block rounded-full bg-[#d97706] px-8 py-3 text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(217,119,6,0.4)] transition-all hover:bg-[#b45309]"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/toko/'$slugToko.tsx' src/routes/tentang.tsx
git commit -m "feat: redesign Toko and Tentang pages"
```

---

## Task 13: Redesign Auth Pages (Login + Register)

**Files:**
- Modify: `src/routes/seller/login.tsx`
- Modify: `src/routes/seller/register.tsx`

- [ ] **Step 1: Ganti fungsi `LoginPage` di `src/routes/seller/login.tsx`**

Hanya ganti JSX — jangan ubah state, validation logic, atau handler:

```tsx
return (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#eaf7ed] via-white to-white px-4 py-12">
    <div className="w-full max-w-md">
      {/* Logo area */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#0a2218] shadow-[0_4px_16px_rgba(45,106,79,0.3)]">
          <span className="text-2xl">🌿</span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">SELLER PORTAL</p>
        <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a4d2e]">Selamat Datang</h1>
        <p className="mt-1 font-[DM_Sans] text-[13px] text-[#9ca3af]">Masuk untuk kelola toko Anda</p>
      </div>

      {/* Form card */}
      <div className="overflow-hidden rounded-2xl border border-[#d8f3dc] bg-white shadow-[0_8px_32px_rgba(45,106,79,0.12)]">
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-[12px] font-bold text-[#374151]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => {
                const newForm = { ...form, email: e.target.value }
                setForm(newForm)
                if (touched.email) validateField('email', newForm)
              }}
              onBlur={() => {
                setTouched(prev => ({ ...prev, email: true }))
                validateField('email', form)
              }}
              disabled={loading}
              className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] disabled:opacity-60 transition-all"
            />
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-[12px] font-bold text-[#374151]">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  const newForm = { ...form, password: e.target.value }
                  setForm(newForm)
                  if (touched.password) validateField('password', newForm)
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, password: true }))
                  validateField('password', form)
                }}
                disabled={loading}
                className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 pr-11 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] disabled:opacity-60 transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[#2d6a4f] py-3 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(45,106,79,0.3)] transition-all hover:bg-[#1a4d2e] disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <div className="border-t border-[#f3f4f6] px-7 py-4 text-center">
          <p className="font-[DM_Sans] text-[12px] text-[#9ca3af]">
            Belum punya akun?{' '}
            <Link to="/seller/register" className="font-bold text-[#2d6a4f] hover:text-[#1a4d2e]">
              Daftar sebagai seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
)
```

- [ ] **Step 2: Ganti success state dan form `RegisterPage` di `src/routes/seller/register.tsx`**

Success state:
```tsx
if (success) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#eaf7ed] via-white to-white px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#d8f3dc] bg-white p-8 text-center shadow-[0_8px_32px_rgba(45,106,79,0.12)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f3dc] text-2xl">✓</div>
        <h2 className="text-[22px] font-extrabold text-[#1a4d2e]">Pendaftaran Berhasil!</h2>
        <p className="mt-2 font-[DM_Sans] text-[13px] text-[#4b5563]">
          Akun Anda telah dibuat. Silakan login untuk mulai berjualan.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/seller/login" className="rounded-full bg-[#2d6a4f] py-3 text-center text-[14px] font-bold text-white hover:bg-[#1a4d2e]">
            Masuk Sekarang
          </Link>
          <Link to="/" className="rounded-full border-2 border-[#e5e7eb] py-3 text-center text-[14px] font-bold text-[#374151] hover:bg-[#f3f4f6]">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
```

Untuk form register, gunakan input/label style yang sama dengan login (class `w-full rounded-xl border-[1.5px] border-[#e5e7eb] ...`). Ganti outer wrapper menjadi:

```tsx
return (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#eaf7ed] via-white to-white px-4 py-12">
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#0a2218] shadow-[0_4px_16px_rgba(45,106,79,0.3)]">
          <span className="text-2xl">🌿</span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#d97706]">BERGABUNG</p>
        <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[#1a4d2e]">Daftar Sebagai Seller</h1>
        <p className="mt-1 font-[DM_Sans] text-[13px] text-[#9ca3af]">Jual produk ke seluruh pembeli koperasi</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#d8f3dc] bg-white shadow-[0_8px_32px_rgba(45,106,79,0.12)]">
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {/* ... semua field dengan class input yang sama seperti login ... */}
          <button type="submit" disabled={loading}
            className="mt-2 w-full rounded-full bg-[#2d6a4f] py-3 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(45,106,79,0.3)] transition-all hover:bg-[#1a4d2e] disabled:opacity-60">
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>
        <div className="border-t border-[#f3f4f6] px-7 py-4 text-center">
          <p className="font-[DM_Sans] text-[12px] text-[#9ca3af]">
            Sudah punya akun?{' '}
            <Link to="/seller/login" className="font-bold text-[#2d6a4f]">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  </div>
)
```

Semua field di dalam form menggunakan input class yang sama seperti login. Pertahankan semua logic onChange/onBlur/error display.

- [ ] **Step 3: Commit**

```bash
git add src/routes/seller/login.tsx src/routes/seller/register.tsx
git commit -m "feat: redesign Login and Register pages — centered card, gradient bg"
```

---

## Task 14: Redesign Seller Layout Shell

**Files:**
- Modify: `src/routes/_seller.tsx`

- [ ] **Step 1: Ganti fungsi `SellerLayout`**

```tsx
function SellerLayout() {
  const { seller } = Route.useRouteContext()
  if (!seller) return null

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <SellerSidebar seller={seller} />
      <main className="flex-1 overflow-y-auto bg-[#f3f4f6] p-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/_seller.tsx
git commit -m "feat: redesign Seller layout — gray bg main area"
```

---

## Task 15: Redesign Dashboard Page

**Files:**
- Modify: `src/routes/_seller/seller/dashboard.tsx`

- [ ] **Step 1: Ganti fungsi `DashboardPage`**

```tsx
function DashboardPage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">Dashboard</h1>
        <p className="mt-0.5 font-[DM_Sans] text-[13px] text-[#9ca3af]">Ringkasan aktivitas toko Anda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Produk Aktif"
          value={data.totalProduk}
          description="Produk yang sedang ditampilkan"
          icon={Package}
          accent="green"
        />
        <StatCard
          title="Klik WA Bulan Ini"
          value={data.totalKlikBulanIni}
          description="Pembeli menghubungi via WhatsApp"
          icon={MessageCircle}
          accent="wa"
        />
        <StatCard
          title="Total Klik WA"
          value={data.totalKlikSemuaWaktu}
          description="Semua waktu"
          icon={TrendingUp}
          accent="saffron"
        />
      </div>

      <KlikChart data={data.klikPerHari} />

      <ProdukTable data={data.produkPerforma} />

      <div className="flex flex-wrap gap-3">
        <Link
          to="/seller/produk/tambah"
          className="rounded-full bg-[#2d6a4f] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_3px_10px_rgba(45,106,79,0.25)] transition-all hover:bg-[#1a4d2e]"
        >
          + Tambah Produk
        </Link>
        <Link
          to="/seller/produk"
          className="rounded-full border-2 border-[#e5e7eb] bg-white px-5 py-2.5 text-[13px] font-bold text-[#374151] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
        >
          Kelola Produk
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/_seller/seller/dashboard.tsx
git commit -m "feat: redesign Dashboard page — stat card accents, updated buttons"
```

---

## Task 16: Redesign Produk Saya (Seller)

**Files:**
- Modify: `src/routes/_seller/seller/produk/index.tsx`

- [ ] **Step 1: Ganti fungsi `SellerProdukPage`**

```tsx
function SellerProdukPage() {
  const produkList = Route.useLoaderData()
  const router = useRouter()
  const handleDeleted = () => router.invalidate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">Produk Saya</h1>
          <p className="mt-0.5 font-[DM_Sans] text-[13px] text-[#9ca3af]">
            {produkList.length} produk aktif
          </p>
        </div>
        <Link to="/seller/produk/tambah">
          <button className="rounded-full bg-[#2d6a4f] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_3px_10px_rgba(45,106,79,0.25)] transition-all hover:bg-[#1a4d2e]">
            + Tambah Produk
          </button>
        </Link>
      </div>

      {produkList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7ed] text-3xl">📦</div>
          <p className="text-[15px] font-bold text-[#374151]">Belum ada produk</p>
          <p className="mt-1 font-[DM_Sans] text-[13px] text-[#9ca3af]">Tambahkan produk pertama Anda</p>
          <Link to="/seller/produk/tambah">
            <button className="mt-5 rounded-full bg-[#2d6a4f] px-6 py-2.5 text-[13px] font-bold text-white hover:bg-[#1a4d2e]">
              Tambah Produk Pertama
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#fafafa]">
                <th className="px-5 py-3 text-left font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Produk</th>
                <th className="px-5 py-3 text-right font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Harga</th>
                <th className="px-5 py-3 text-center font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Stok</th>
                <th className="px-5 py-3 text-right font-[DM_Sans] text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((p) => (
                <tr key={p.id} className="border-b border-[#f3f4f6] last:border-0 transition-colors hover:bg-[#fafafa]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-[#eaf7ed]">
                        {p.foto_utama && (
                          <img src={p.foto_utama} alt={p.nama} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">{p.nama}</p>
                        {p.kategori && (
                          <p className="font-[DM_Sans] text-[11px] text-[#9ca3af]">{p.kategori.nama_kategori}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[#2d6a4f]">{formatRupiah(p.harga)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      p.stok_tersedia ? 'bg-[#d8f3dc] text-[#1a4d2e]' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.stok_tersedia ? 'Ada' : 'Habis'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/produk/$slug" params={{ slug: p.slug }} target="_blank">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#9ca3af] transition-colors hover:bg-[#eaf7ed] hover:text-[#2d6a4f]">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      <Link to="/seller/produk/$produkId/edit" params={{ produkId: p.id }}>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#9ca3af] transition-colors hover:bg-[#eaf7ed] hover:text-[#2d6a4f]">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      <DeleteProdukDialog produkId={p.id} namaProduk={p.nama} onDeleted={handleDeleted}>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#9ca3af] transition-colors hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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

Tambah import `Trash2` dari lucide-react (gantikan import `Button` yang tidak dipakai lagi).

- [ ] **Step 2: Commit**

```bash
git add src/routes/_seller/seller/produk/index.tsx
git commit -m "feat: redesign Produk Saya — rounded table, icon buttons, empty state"
```

---

## Task 17: Redesign Form Produk (Tambah + Edit)

**Files:**
- Modify: `src/routes/_seller/seller/produk/tambah.tsx`
- Modify: `src/routes/_seller/seller/produk/$produkId/edit.tsx`

Kedua file ini memiliki form yang identik. Terapkan perubahan yang sama di keduanya.

- [ ] **Step 1: Ganti outer wrapper dan form wrapper di `tambah.tsx`**

```tsx
// Outer wrapper
<div className="space-y-6">
  <div>
    <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">Tambah Produk</h1>
    <p className="mt-0.5 font-[DM_Sans] text-[13px] text-[#9ca3af]">Isi informasi produk yang akan dijual</p>
  </div>

  <form onSubmit={handleSubmit} className="space-y-5 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
    {/* foto upload tetap sama */}

    {/* Ganti setiap Label + Input dengan: */}
    <div className="space-y-1">
      <label htmlFor="nama" className="block text-[12px] font-bold text-[#374151]">Nama Produk *</label>
      <input
        id="nama"
        value={form.nama}
        onChange={...} onBlur={...} disabled={loading}
        className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] disabled:opacity-60 transition-all"
      />
      {errors.nama && <p className="text-[11px] text-red-500">{errors.nama}</p>}
    </div>

    {/* Harga input — style sama */}

    {/* Select kategori — ganti SelectTrigger style dengan div custom atau pertahankan shadcn dengan override class */}

    {/* Stok toggle — ganti checkbox dengan visual toggle: */}
    <button
      type="button"
      onClick={() => setForm(f => ({ ...f, stok_tersedia: !f.stok_tersedia }))}
      disabled={loading}
      className={`flex items-center gap-3 rounded-xl border-[1.5px] p-4 transition-all ${
        form.stok_tersedia
          ? 'border-[#d8f3dc] bg-[#eaf7ed]'
          : 'border-[#e5e7eb] bg-[#fafafa]'
      }`}
    >
      <div className={`relative h-5 w-9 rounded-full transition-colors ${form.stok_tersedia ? 'bg-[#2d6a4f]' : 'bg-[#d1d5db]'}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${form.stok_tersedia ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <div className="text-left">
        <p className="text-[13px] font-bold text-[#111827]">
          {form.stok_tersedia ? 'Stok tersedia' : 'Stok habis'}
        </p>
        <p className="font-[DM_Sans] text-[11px] text-[#9ca3af]">
          {form.stok_tersedia ? 'Produk akan ditampilkan ke pembeli' : 'Produk tidak akan ditampilkan'}
        </p>
      </div>
    </button>

    {/* Deskripsi textarea — style sama dengan input */}

    {/* Submit buttons */}
    <div className="flex gap-3 pt-2">
      <button type="submit" disabled={loading}
        className="rounded-full bg-[#2d6a4f] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_3px_10px_rgba(45,106,79,0.25)] transition-all hover:bg-[#1a4d2e] disabled:opacity-60">
        {loading ? 'Menyimpan...' : 'Simpan Produk'}
      </button>
      <button type="button" onClick={() => router.navigate({ to: '/seller/produk' })} disabled={loading}
        className="rounded-full border-2 border-[#e5e7eb] bg-white px-6 py-2.5 text-[13px] font-bold text-[#374151] transition-all hover:border-[#9ca3af] disabled:opacity-60">
        Batal
      </button>
    </div>
  </form>
</div>
```

- [ ] **Step 2: Terapkan perubahan yang sama di `edit.tsx`**

Ganti judul "Tambah Produk" → "Edit Produk", tombol simpan → "Simpan Perubahan". Semua style form identik.

- [ ] **Step 3: Commit**

```bash
git add src/routes/_seller/seller/produk/tambah.tsx "src/routes/_seller/seller/produk/\$produkId/edit.tsx"
git commit -m "feat: redesign Tambah/Edit Produk — rounded inputs, visual stock toggle"
```

---

## Task 18: Redesign Profil Toko

**Files:**
- Modify: `src/routes/_seller/seller/profil.tsx`

- [ ] **Step 1: Ganti fungsi `ProfilPage` JSX**

```tsx
return (
  <div className="space-y-6">
    <div>
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">Profil Toko</h1>
      <p className="mt-0.5 font-[DM_Sans] text-[13px] text-[#9ca3af]">Kelola informasi toko Anda</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      {/* Avatar upload */}
      <div className="flex items-center gap-5 rounded-xl border-[1.5px] border-[#d8f3dc] bg-[#eaf7ed] p-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#2d6a4f] shadow-[0_4px_12px_rgba(45,106,79,0.2)]">
          {fotoToko ? (
            <img src={fotoToko} alt="Foto toko" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xl font-extrabold text-white">
              {seller.nama_toko.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#1a4d2e]">Foto Toko</p>
          <p className="font-[DM_Sans] text-[11px] text-[#9ca3af]">JPG, PNG, WebP · Maks 2MB</p>
          <label htmlFor="foto-toko" className="mt-2 inline-block cursor-pointer">
            <span className="rounded-full border-[1.5px] border-[#2d6a4f] bg-white px-4 py-1.5 text-[12px] font-bold text-[#2d6a4f] transition-colors hover:bg-[#eaf7ed]">
              {uploadingFoto ? 'Mengupload...' : 'Ganti Foto'}
            </span>
            <input id="foto-toko" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFotoChange} className="hidden" disabled={uploadingFoto} />
          </label>
        </div>
      </div>

      {/* Fields — gunakan style input yang sama dengan form produk */}
      {[
        { id: 'nama_toko', label: 'Nama Toko *', placeholder: '', value: form.nama_toko, field: 'nama_toko' as const },
        { id: 'nomor_wa', label: 'Nomor WhatsApp *', placeholder: '08xx atau 628xx', value: form.nomor_wa, field: 'nomor_wa' as const },
      ].map(({ id, label, placeholder, value, field }) => (
        <div key={id} className="space-y-1">
          <label htmlFor={id} className="block text-[12px] font-bold text-[#374151]">{label}</label>
          <input
            id={id}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              const newForm = { ...form, [field]: e.target.value }
              setForm(newForm)
              if (touched[field]) validateField(field, newForm)
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, [field]: true }))
              validateField(field, form)
            }}
            disabled={loading}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] disabled:opacity-60 transition-all"
          />
          {errors[field] && <p className="text-[11px] text-red-500">{errors[field]}</p>}
        </div>
      ))}

      <div className="space-y-1">
        <label htmlFor="deskripsi_toko" className="block text-[12px] font-bold text-[#374151]">Deskripsi Toko (opsional)</label>
        <textarea
          id="deskripsi_toko"
          value={form.deskripsi_toko}
          onChange={(e) => {
            const newForm = { ...form, deskripsi_toko: e.target.value }
            setForm(newForm)
            if (touched.deskripsi_toko) validateField('deskripsi_toko', newForm)
          }}
          onBlur={() => {
            setTouched(prev => ({ ...prev, deskripsi_toko: true }))
            validateField('deskripsi_toko', form)
          }}
          rows={3}
          disabled={loading}
          className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2.5 font-[DM_Sans] text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#40916c] focus:shadow-[0_0_0_3px_rgba(64,145,108,0.12)] disabled:opacity-60 transition-all resize-none"
        />
      </div>

      {/* Info box */}
      <div className="rounded-xl border-[1.5px] border-[#e5e7eb] bg-[#fafafa] p-4">
        <p className="text-[12px] font-bold text-[#374151]">Info Toko</p>
        <p className="mt-1 font-[DM_Sans] text-[12px] text-[#9ca3af]">Email: {seller.email}</p>
        <p className="font-[DM_Sans] text-[12px] text-[#9ca3af]">URL Toko: /toko/{seller.slug_toko}</p>
      </div>

      <button
        type="submit"
        disabled={loading || uploadingFoto}
        className="rounded-full bg-[#2d6a4f] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_3px_10px_rgba(45,106,79,0.25)] transition-all hover:bg-[#1a4d2e] disabled:opacity-60"
      >
        {loading ? 'Menyimpan...' : 'Simpan Profil'}
      </button>
    </form>
  </div>
)
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/_seller/seller/profil.tsx
git commit -m "feat: redesign Profil Toko — avatar preview, rounded inputs, info box"
```

---

## Task 19: Verifikasi Final + Cleanup

- [ ] **Step 1: Jalankan dev server dan periksa semua halaman**

```bash
npm run dev
```

Buka dan periksa setiap halaman:
- `http://localhost:3000/` — Beranda
- `http://localhost:3000/produk` — Daftar produk
- `http://localhost:3000/tentang` — Tentang
- `http://localhost:3000/seller/login` — Login
- `http://localhost:3000/seller/register` — Register
- `http://localhost:3000/seller/dashboard` — Dashboard (perlu login)
- `http://localhost:3000/seller/produk` — Produk seller
- `http://localhost:3000/seller/profil` — Profil

- [ ] **Step 2: Cek TypeScript tidak ada error**

```bash
npm run typecheck
```

Expected: 0 error. Jika ada error, perbaiki type mismatch (biasanya terjadi di `ProdukTable` karena perubahan props type).

- [ ] **Step 3: Cek mobile view di DevTools**

Buka Chrome DevTools → Toggle device toolbar → iPhone 14 (390×844). Periksa:
- Navbar hamburger berfungsi
- Filter pill horizontal scroll
- Grid produk 2 kolom
- WA button full-width

- [ ] **Step 4: Tambahkan `.superpowers` ke `.gitignore` jika belum ada**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete redesign Koperasi SHS — Soft Modern aesthetic"
```

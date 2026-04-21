import { useState, useEffect } from 'react'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import {
  Menu,
  X,
  Store,
  ChevronDown,
  LayoutDashboard,
  Package,
  UserCircle,
  LogOut,
} from 'lucide-react'
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
    getCurrentSeller()
      .then(setSeller)
      .catch(() => setSeller(null))
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
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-bold">
          <span className="text-[#1a4d2e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Koperasi{' '}
          </span>
          <span className="text-[#d97706]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            SHS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#2d6a4f]'
                  : 'text-[#4b5563] hover:text-[#2d6a4f]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {seller ? (
            <div className="relative">
              <button
                onClick={() => setSellerMenuOpen(!sellerMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-[#d8f3dc] bg-[#eaf7ed] px-4 py-1.5 text-sm font-medium text-[#2d6a4f] transition-colors hover:bg-[#d8f3dc]"
              >
                <Store className="h-4 w-4" />
                {seller.nama_toko}
                <ChevronDown className="h-3 w-3" />
              </button>
              {sellerMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
                  {[
                    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/seller/produk', label: 'Produk Saya', icon: Package },
                    { to: '/seller/profil', label: 'Profil Toko', icon: UserCircle },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111827] transition-colors hover:bg-[#eaf7ed] hover:text-[#2d6a4f]"
                      onClick={() => setSellerMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-[#40916c]" />
                      {label}
                    </Link>
                  ))}
                  <div className="h-px bg-[#e5e7eb]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
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
              className="rounded-full bg-[#2d6a4f] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c] hover:shadow-[0_4px_16px_rgba(45,106,79,0.30)]"
            >
              Masuk Seller
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4b5563] transition-colors hover:bg-[#f3f4f6] md:hidden"
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
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#eaf7ed] text-[#2d6a4f]'
                    : 'text-[#4b5563] hover:bg-[#f3f4f6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="my-3 h-px bg-[#e5e7eb]" />
          {seller ? (
            <div className="flex flex-col gap-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                {seller.nama_toko}
              </p>
              {[
                { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { to: '/seller/produk', label: 'Produk Saya', icon: Package },
                { to: '/seller/profil', label: 'Profil Toko', icon: UserCircle },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#4b5563] transition-colors hover:bg-[#eaf7ed] hover:text-[#2d6a4f]"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          ) : (
            <Link
              to="/seller/login"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-[#2d6a4f] px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Masuk Seller
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

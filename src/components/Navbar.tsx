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
              <p className="py-1 text-xs font-semibold text-muted-foreground">
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
                  className="block py-2 text-sm text-muted-foreground"
                >
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

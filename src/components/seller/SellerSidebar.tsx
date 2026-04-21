import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, Package, UserCircle, LogOut, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { logoutSeller } from '#/server/auth'
import type { Seller } from '#/lib/supabase/types'

const NAV_ITEMS = [
  { to: '/seller/dashboard', label: 'Dashboard', emoji: '📊' },
  { to: '/seller/produk', label: 'Produk Saya', emoji: '📦' },
  { to: '/seller/profil', label: 'Profil Toko', emoji: '🏪' },
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

  const initials = seller.nama_toko
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <aside className="flex h-full w-60 flex-col" style={{ backgroundColor: '#0a2218' }}>
      {/* Brand */}
      <div className="px-5 py-5">
        <Link to="/" className="flex items-center gap-1 text-base font-bold">
          <span className="text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Koperasi{' '}
          </span>
          <span className="text-[#d97706]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            SHS
          </span>
        </Link>
        <p className="mt-0.5 text-xs text-white/30">Seller Portal</p>
      </div>

      {/* Avatar & toko info */}
      <div className="mx-4 mb-2 rounded-xl bg-white/5 p-3.5">
        <div className="flex items-center gap-3">
          {seller.foto_toko_url ? (
            <img
              src={seller.foto_toko_url}
              alt={seller.nama_toko}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2d6a4f]"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f] text-sm font-bold text-white ring-2 ring-[#40916c]/40">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {seller.nama_toko}
            </p>
            <p className="truncate text-xs text-white/40">{seller.email}</p>
          </div>
        </div>
        {seller.slug_toko && (
          <Link
            to="/toko/$slugToko"
            params={{ slugToko: seller.slug_toko }}
            className="mt-2.5 flex items-center gap-1.5 text-xs text-[#74c69d] transition-colors hover:text-[#d8f3dc]"
            target="_blank"
          >
            <ExternalLink className="h-3 w-3" />
            Lihat Toko
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map(({ to, label, emoji }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              isActive(to)
                ? 'bg-[#2d6a4f] text-white shadow-[0_2px_8px_rgba(45,106,79,0.40)]'
                : 'text-white/50 hover:bg-white/5 hover:text-white/90'
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}

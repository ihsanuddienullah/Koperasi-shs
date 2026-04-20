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

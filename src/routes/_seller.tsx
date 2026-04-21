import { useState } from 'react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!seller) return null

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar: hidden on mobile, always visible on md+ */}
      <div className="hidden md:block">
        <SellerSidebar seller={seller} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <SellerSidebar seller={seller} />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#f3f4f6]">
        {/* Mobile topbar */}
        <div className="flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4b5563] hover:bg-[#f3f4f6]"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span
            className="text-sm font-bold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Koperasi <span className="text-[#d97706]">SHS</span>
          </span>
        </div>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

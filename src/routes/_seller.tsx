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

  if (!seller) return null

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <SellerSidebar seller={seller} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}

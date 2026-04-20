import { createFileRoute, Link } from '@tanstack/react-router'
import { MessageCircle, Package, TrendingUp } from 'lucide-react'
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

      <KlikChart data={data.klikPerHari} />

      <ProdukTable data={data.produkPerforma} />

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

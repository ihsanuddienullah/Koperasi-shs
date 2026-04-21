import { createFileRoute, Link } from '@tanstack/react-router'
import { MessageCircle, Package, TrendingUp, Plus } from 'lucide-react'
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
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#d97706]">
          ✦ Overview
        </p>
        <h1
          className="text-2xl font-extrabold text-[#1a4d2e]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#9ca3af]">Ringkasan aktivitas toko Anda</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Produk Aktif"
          value={data.totalProduk}
          description="Produk yang sedang ditampilkan"
          icon={Package}
          accent="green"
        />
        <StatCard
          title="Klik WA Bulan Ini"
          value={data.totalKlikBulanIni}
          description="Pembeli yang menghubungi via WA"
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

      {/* Chart */}
      <KlikChart data={data.klikPerHari} />

      {/* Table */}
      <ProdukTable data={data.produkPerforma} />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/seller/produk/tambah"
          className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c]"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
        <Link
          to="/seller/produk"
          className="flex items-center gap-2 rounded-full border-[1.5px] border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#4b5563] transition-all hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
        >
          Kelola Produk
        </Link>
      </div>
    </div>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { HeroBanner } from '#/components/HeroBanner'
import { ProductGrid } from '#/components/ProductGrid'
import { KategoriFilter } from '#/components/KategoriFilter'
import { getProdukList, getKategoriList } from '#/server/produk'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      const [produkResult, kategoriList] = await Promise.all([
        getProdukList({ data: { page: 1 } }),
        getKategoriList(),
      ])
      return { produkResult, kategoriList }
    } catch {
      return {
        produkResult: { data: [], total: 0, page: 1, totalPages: 0 },
        kategoriList: [],
      }
    }
  },
  component: BerandaPage,
})

function BerandaPage() {
  const { produkResult, kategoriList } = Route.useLoaderData()

  return (
    <div className="bg-[#f3f4f6]">
      <HeroBanner />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#d97706]">
              ✦ Pilihan Terbaik
            </p>
            <h2
              className="text-2xl font-extrabold text-[#1a4d2e] md:text-3xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}
            >
              Produk Terbaru
            </h2>
          </div>
          <Link
            to="/produk"
            className="flex items-center gap-1 text-sm font-semibold text-[#2d6a4f] transition-colors hover:text-[#40916c]"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <KategoriFilter
            kategori={kategoriList}
            activeSlug={null}
            onSelect={(slug) => {
              window.location.href = slug ? `/produk?kategori=${slug}` : '/produk'
            }}
          />
        </div>

        {/* Grid */}
        <ProductGrid products={produkResult.data.slice(0, 8)} />

        {/* CTA bottom */}
        {produkResult.total > 8 && (
          <div className="mt-10 text-center">
            <Link
              to="/produk"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#2d6a4f] px-7 py-2.5 text-sm font-semibold text-[#2d6a4f] transition-all hover:bg-[#2d6a4f] hover:text-white"
            >
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

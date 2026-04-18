import { createFileRoute, Link } from '@tanstack/react-router'
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
    <div>
      <HeroBanner />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Produk Terbaru</h2>
          <Link
            to="/produk"
            className="text-sm font-medium text-[#1a6b3c] hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="mb-6">
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

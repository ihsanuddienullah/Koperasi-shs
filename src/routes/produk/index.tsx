import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchBar } from '#/components/SearchBar'
import { KategoriFilter } from '#/components/KategoriFilter'
import { ProductGrid } from '#/components/ProductGrid'
import { Pagination } from '#/components/Pagination'
import { getProdukList, getKategoriList } from '#/server/produk'

const produkSearchSchema = z.object({
  kategori: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
})

export const Route = createFileRoute('/produk/')({
  validateSearch: produkSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      const [produkResult, kategoriList] = await Promise.all([
        getProdukList({
          data: {
            kategoriSlug: deps.kategori,
            search: deps.search,
            page: deps.page,
          },
        }),
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
  component: ProdukListPage,
})

function ProdukListPage() {
  const { produkResult, kategoriList } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/produk/' })

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#d97706]">
            ✦ Koleksi Produk
          </p>
          <h1
            className="text-2xl font-extrabold text-[#1a4d2e] md:text-3xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}
          >
            Semua Produk
          </h1>
          {produkResult.total > 0 && (
            <p className="mt-1 text-sm text-[#9ca3af]">
              Menampilkan {produkResult.data.length} dari {produkResult.total} produk
            </p>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            defaultValue={search.search ?? ''}
            onSearch={(value) =>
              navigate({
                search: { ...search, search: value || undefined, page: 1 },
              })
            }
          />
        </div>

        {/* Kategori filter */}
        <div className="mb-8">
          <KategoriFilter
            kategori={kategoriList}
            activeSlug={search.kategori ?? null}
            onSelect={(slug) =>
              navigate({
                search: { ...search, kategori: slug ?? undefined, page: 1 },
              })
            }
          />
        </div>

        {/* Grid */}
        {produkResult.data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-base font-semibold text-[#4b5563]">Produk tidak ditemukan</p>
            <p className="text-sm text-[#9ca3af]">Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          <ProductGrid products={produkResult.data} />
        )}

        <Pagination
          currentPage={produkResult.page}
          totalPages={produkResult.totalPages}
          onPageChange={(page) => navigate({ search: { ...search, page } })}
        />
      </div>
    </div>
  )
}

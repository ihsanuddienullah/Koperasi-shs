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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Semua Produk</h1>

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

      <div className="mb-6">
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

      <ProductGrid products={produkResult.data} />

      <Pagination
        currentPage={produkResult.page}
        totalPages={produkResult.totalPages}
        onPageChange={(page) => navigate({ search: { ...search, page } })}
      />
    </div>
  )
}

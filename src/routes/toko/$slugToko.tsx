import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Store } from 'lucide-react'
import { ProductGrid } from '#/components/ProductGrid'
import { getSellerBySlug } from '#/server/produk'

export const Route = createFileRoute('/toko/$slugToko')({
  loader: async ({ params }) => {
    const seller = await getSellerBySlug({
      data: { slugToko: params.slugToko },
    })
    if (!seller) throw notFound()
    return seller
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nama_toko} — Koperasi SHS` },
          {
            name: 'description',
            content: loaderData.deskripsi_toko?.slice(0, 160) ?? '',
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Toko Tidak Ditemukan</h1>
      <p className="mt-2 text-muted-foreground">
        Toko yang Anda cari tidak ada atau sudah tidak aktif.
      </p>
      <Link to="/" className="mt-4 text-[#1a6b3c] hover:underline">
        ← Kembali ke beranda
      </Link>
    </div>
  ),
  component: TokoPage,
})

function TokoPage() {
  const seller = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        {seller.foto_toko_url ? (
          <img
            src={seller.foto_toko_url}
            alt={seller.nama_toko}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9]">
            <Store className="h-8 w-8 text-[#1a6b3c]" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{seller.nama_toko}</h1>
          {seller.deskripsi_toko && (
            <p className="mt-1 text-sm text-muted-foreground">
              {seller.deskripsi_toko}
            </p>
          )}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">
        Produk ({seller.produk.length})
      </h2>
      <ProductGrid products={seller.produk} />
    </div>
  )
}

import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Store, ArrowLeft, Package } from 'lucide-react'
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
      <h1 className="text-2xl font-bold text-[#1a4d2e]">Toko Tidak Ditemukan</h1>
      <p className="mt-2 text-[#9ca3af]">Toko yang Anda cari tidak ada atau sudah tidak aktif.</p>
      <Link
        to="/"
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#2d6a4f] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke beranda
      </Link>
    </div>
  ),
  component: TokoPage,
})

function TokoPage() {
  const seller = Route.useLoaderData()

  const initials = seller.nama_toko
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Back link */}
        <Link
          to="/produk"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#4b5563] transition-colors hover:text-[#2d6a4f]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke produk
        </Link>

        {/* Store header card */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="h-24 bg-gradient-to-r from-[#eaf7ed] via-[#d8f3dc] to-[#fef3c7]" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex items-end gap-4">
              {seller.foto_toko_url ? (
                <img
                  src={seller.foto_toko_url}
                  alt={seller.nama_toko}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#2d6a4f] text-xl font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
              <div className="mb-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    className="text-xl font-extrabold text-[#1a4d2e]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {seller.nama_toko}
                  </h1>
                  <span className="flex items-center gap-1 rounded-full bg-[#eaf7ed] px-2.5 py-0.5 text-xs font-medium text-[#2d6a4f]">
                    <Package className="h-3 w-3" />
                    {seller.produk.length} produk
                  </span>
                </div>
                {seller.deskripsi_toko && (
                  <p
                    className="mt-1 text-sm text-[#4b5563]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {seller.deskripsi_toko}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h2
            className="text-lg font-bold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Produk dari {seller.nama_toko}
          </h2>
        </div>

        {seller.produk.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="text-5xl">📦</span>
            <p className="text-base font-semibold text-[#4b5563]">Belum ada produk</p>
            <p className="text-sm text-[#9ca3af]">Toko ini belum menambahkan produk.</p>
          </div>
        ) : (
          <ProductGrid products={seller.produk} />
        )}
      </div>
    </div>
  )
}

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, Store } from 'lucide-react'
import { PhotoGallery } from '#/components/PhotoGallery'
import { WhatsAppButton } from '#/components/WhatsAppButton'
import { formatRupiah } from '#/lib/format'
import { getProdukBySlug } from '#/server/produk'

export const Route = createFileRoute('/produk/$slug')({
  loader: async ({ params }) => {
    const produk = await getProdukBySlug({ data: { slug: params.slug } })
    if (!produk) throw notFound()
    return produk
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nama} — Koperasi SHS` },
          {
            name: 'description',
            content: loaderData.deskripsi?.slice(0, 160) ?? '',
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold text-[#1a4d2e]">Produk Tidak Ditemukan</h1>
      <p className="mt-2 text-[#9ca3af]">Produk yang Anda cari tidak ada atau sudah dihapus.</p>
      <Link
        to="/produk"
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#2d6a4f] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar produk
      </Link>
    </div>
  ),
  component: ProdukDetailPage,
})

function ProdukDetailPage() {
  const produk = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Breadcrumb */}
        <Link
          to="/produk"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#4b5563] transition-colors hover:text-[#2d6a4f]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke produk
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <PhotoGallery fotos={produk.foto_produk} />

          {/* Info panel */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:self-start">
            {/* Category + stok badges */}
            <div className="mb-3 flex flex-wrap gap-2">
              {produk.kategori && (
                <span className="rounded-full border border-[#d8f3dc] bg-[#eaf7ed] px-3 py-0.5 text-xs font-medium text-[#2d6a4f]">
                  {produk.kategori.nama_kategori}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                  produk.stok_tersedia
                    ? 'bg-[#d8f3dc] text-[#2d6a4f]'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {produk.stok_tersedia ? 'Stok Tersedia' : 'Stok Habis'}
              </span>
            </div>

            <h1
              className="text-2xl font-extrabold leading-tight text-[#111827] md:text-3xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}
            >
              {produk.nama}
            </h1>

            <p
              className="mt-3 text-2xl font-bold text-[#2d6a4f]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {formatRupiah(produk.harga)}
            </p>

            {produk.deskripsi && (
              <p
                className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#4b5563]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {produk.deskripsi}
              </p>
            )}

            <div className="my-5 h-px bg-[#e5e7eb]" />

            {/* Seller */}
            {produk.sellers && (
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7ed]">
                  <Store className="h-4 w-4 text-[#2d6a4f]" />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af]">Dijual oleh</p>
                  <Link
                    to="/toko/$slugToko"
                    params={{ slugToko: produk.sellers.slug_toko }}
                    className="text-sm font-semibold text-[#2d6a4f] hover:underline"
                  >
                    {produk.sellers.nama_toko}
                  </Link>
                </div>
              </div>
            )}

            {/* WA Button — sticky on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e7eb] bg-white/95 p-4 backdrop-blur-sm md:static md:z-auto md:border-0 md:bg-transparent md:p-0">
              <WhatsAppButton
                nomorWa={produk.sellers?.nomor_wa ?? ''}
                namaProduk={produk.nama}
                harga={produk.harga}
                produkId={produk.id}
                disabled={!produk.stok_tersedia || !produk.sellers}
              />
            </div>
            {/* Spacer for the sticky WA button on mobile */}
            <div className="h-20 md:hidden" />
          </div>
        </div>
      </div>
    </div>
  )
}

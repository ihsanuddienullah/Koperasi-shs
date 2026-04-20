import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { PhotoGallery } from '#/components/PhotoGallery'
import { WhatsAppButton } from '#/components/WhatsAppButton'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
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
      <h1 className="text-2xl font-bold">Produk Tidak Ditemukan</h1>
      <p className="mt-2 text-muted-foreground">
        Produk yang Anda cari tidak ada atau sudah dihapus.
      </p>
      <Link to="/produk" className="mt-4 text-[#1a6b3c] hover:underline">
        ← Kembali ke daftar produk
      </Link>
    </div>
  ),
  component: ProdukDetailPage,
})

function ProdukDetailPage() {
  const produk = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <PhotoGallery fotos={produk.foto_produk} />

        <div>
          <h1 className="text-2xl font-bold">{produk.nama}</h1>
          <p className="mt-2 text-2xl font-bold text-[#1a6b3c]">
            {formatRupiah(produk.harga)}
          </p>

          <div className="mt-3 flex gap-2">
            {produk.kategori && (
              <Badge variant="outline">{produk.kategori.nama_kategori}</Badge>
            )}
            <Badge
              className={
                produk.stok_tersedia
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : 'bg-red-100 text-red-800 hover:bg-red-100'
              }
            >
              {produk.stok_tersedia ? 'Tersedia' : 'Stok Habis'}
            </Badge>
          </div>

          {produk.deskripsi && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
              {produk.deskripsi}
            </p>
          )}

          <Separator className="my-6" />

          {produk.sellers && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Dijual oleh</p>
              <Link
                to="/toko/$slugToko"
                params={{ slugToko: produk.sellers.slug_toko }}
                className="font-medium text-[#1a6b3c] hover:underline"
              >
                {produk.sellers.nama_toko}
              </Link>
            </div>
          )}

          <WhatsAppButton
            nomorWa={produk.sellers?.nomor_wa ?? ''}
            namaProduk={produk.nama}
            harga={produk.harga}
            produkId={produk.id}
            disabled={!produk.stok_tersedia || !produk.sellers}
          />
        </div>
      </div>
    </div>
  )
}

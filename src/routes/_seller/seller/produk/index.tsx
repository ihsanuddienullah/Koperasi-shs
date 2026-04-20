import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { DeleteProdukDialog } from '#/components/seller/DeleteProdukDialog'
import { formatRupiah } from '#/lib/format'
import { getSellerProduk } from '#/server/produk'

export const Route = createFileRoute('/_seller/seller/produk/')({
  loader: async () => getSellerProduk(),
  component: SellerProdukPage,
})

function SellerProdukPage() {
  const produkList = Route.useLoaderData()
  const router = useRouter()

  const handleDeleted = () => router.invalidate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produk Saya</h1>
          <p className="text-sm text-muted-foreground">{produkList.length} produk aktif</p>
        </div>
        <Link to="/seller/produk/tambah">
          <Button className="bg-[#1a6b3c] hover:bg-[#145730]">
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>

      {produkList.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-muted-foreground">Belum ada produk.</p>
          <Link to="/seller/produk/tambah">
            <Button className="mt-4 bg-[#1a6b3c] hover:bg-[#145730]">
              Tambah Produk Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Harga</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stok</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.foto_utama ? (
                        <img
                          src={p.foto_utama}
                          alt={p.nama}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium">{p.nama}</p>
                        {p.kategori && (
                          <p className="text-xs text-muted-foreground">
                            {p.kategori.nama_kategori}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{formatRupiah(p.harga)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        p.stok_tersedia
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {p.stok_tersedia ? 'Ada' : 'Habis'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/produk/$slug" params={{ slug: p.slug }} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        to="/seller/produk/$produkId/edit"
                        params={{ produkId: p.id }}
                      >
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProdukDialog
                        produkId={p.id}
                        namaProduk={p.nama}
                        onDeleted={handleDeleted}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          Hapus
                        </Button>
                      </DeleteProdukDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

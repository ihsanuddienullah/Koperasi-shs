import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
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
  const activeProduk = produkList.filter((p) => p.stok_tersedia).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#d97706]">
            ✦ Inventori
          </p>
          <h1
            className="text-2xl font-extrabold text-[#1a4d2e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Produk Saya
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-[#eaf7ed] px-2.5 py-0.5 text-xs font-medium text-[#2d6a4f]">
              {activeProduk} tersedia
            </span>
            <span className="text-xs text-[#9ca3af]">dari {produkList.length} total produk</span>
          </div>
        </div>
        <Link
          to="/seller/produk/tambah"
          className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c]"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      {produkList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white py-20 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <span className="text-5xl">📦</span>
          <p className="font-semibold text-[#4b5563]">Belum ada produk</p>
          <p className="text-sm text-[#9ca3af]">Mulai dengan menambahkan produk pertama Anda.</p>
          <Link
            to="/seller/produk/tambah"
            className="mt-2 flex items-center gap-2 rounded-full bg-[#2d6a4f] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(45,106,79,0.25)] transition-all hover:bg-[#40916c]"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Produk
                </th>
                <th className="hidden px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#9ca3af] sm:table-cell">
                  Harga
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Stok
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb]"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.foto_utama ? (
                        <img
                          src={p.foto_utama}
                          alt={p.nama}
                          className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-[#f3f4f6]" />
                      )}
                      <div>
                        <p
                          className="font-semibold text-[#111827]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {p.nama}
                        </p>
                        {p.kategori && (
                          <p className="text-xs text-[#9ca3af]">{p.kategori.nama_kategori}</p>
                        )}
                        <p className="text-xs font-medium text-[#2d6a4f] sm:hidden">
                          {formatRupiah(p.harga)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-6 py-3.5 text-right font-medium text-[#111827] sm:table-cell">
                    {formatRupiah(p.harga)}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.stok_tersedia
                          ? 'bg-[#d8f3dc] text-[#2d6a4f]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.stok_tersedia ? 'Tersedia' : 'Habis'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/produk/$slug"
                        params={{ slug: p.slug }}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#4b5563]"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/seller/produk/$produkId/edit"
                        params={{ produkId: p.id }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-[#eaf7ed] hover:text-[#2d6a4f]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProdukDialog
                        produkId={p.id}
                        namaProduk={p.nama}
                        onDeleted={handleDeleted}
                      >
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-red-50 hover:text-red-500">
                          <span className="text-sm">🗑</span>
                        </button>
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

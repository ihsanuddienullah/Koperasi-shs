import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'

type ProdukPerforma = {
  produk_id: string
  nama: string
  slug: string
  klik_bulan_ini: number
  stok_tersedia: boolean
}

export function ProdukTable({ data }: { data: ProdukPerforma[] }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold">Performa Produk Bulan Ini</h3>
      </div>
      {data.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">
          Belum ada produk.{' '}
          <Link to="/seller/produk/tambah" className="text-[#1a6b3c] hover:underline">
            Tambah produk pertama Anda.
          </Link>
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stok</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Klik WA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.produk_id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    to="/produk/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium hover:text-[#1a6b3c] hover:underline"
                    target="_blank"
                  >
                    {p.nama}
                  </Link>
                </td>
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
                <td className="px-4 py-3 text-right font-semibold text-[#1a6b3c]">
                  {p.klik_bulan_ini}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { Link } from '@tanstack/react-router'

type ProdukPerforma = {
  produk_id: string
  nama: string
  slug: string
  klik_bulan_ini: number
  stok_tersedia: boolean
}

export function ProdukTable({ data }: { data: ProdukPerforma[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="border-b border-[#e5e7eb] px-6 py-4">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Performa
        </p>
        <h3
          className="text-sm font-semibold text-[#111827]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Produk Bulan Ini
        </h3>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="text-4xl">📦</span>
          <p className="text-sm text-[#9ca3af]">Belum ada produk.</p>
          <Link
            to="/seller/produk/tambah"
            className="mt-1 text-sm font-medium text-[#2d6a4f] hover:underline"
          >
            Tambah produk pertama Anda.
          </Link>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Produk
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Stok
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Klik WA
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr
                key={p.produk_id}
                className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb]"
              >
                <td className="px-6 py-3.5">
                  <Link
                    to="/produk/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium text-[#111827] hover:text-[#2d6a4f] hover:underline"
                    target="_blank"
                  >
                    {p.nama}
                  </Link>
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
                <td className="px-6 py-3.5 text-right">
                  <span className="font-bold text-[#128C7E]">{p.klik_bulan_ini}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

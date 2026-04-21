import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { formatRupiah } from '#/lib/format'
import type { ProdukWithDetails } from '#/lib/supabase/types'

export function ProductCard({ produk }: { produk: ProdukWithDetails }) {
  return (
    <Link to="/produk/$slug" params={{ slug: produk.slug }} className="group block">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {produk.foto_utama ? (
            <img
              src={produk.foto_utama}
              alt={produk.nama}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#eaf7ed]">
              <Package className="h-12 w-12 text-[#2d6a4f]/30" />
            </div>
          )}

          {/* Kategori badge */}
          {produk.kategori && (
            <div className="absolute left-2 top-2">
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-[#2d6a4f] shadow-sm backdrop-blur-sm">
                {produk.kategori}
              </span>
            </div>
          )}

          {/* Stok habis overlay */}
          {!produk.stok_tersedia && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {produk.nama}
          </h3>
          <p className="mt-1.5 text-base font-bold text-[#2d6a4f]">
            {formatRupiah(produk.harga)}
          </p>
          {produk.sellers && (
            <p className="mt-1 truncate text-xs text-[#9ca3af]">
              {produk.sellers.nama_toko}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

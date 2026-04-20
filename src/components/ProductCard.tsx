import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { formatRupiah } from '#/lib/format'
import type { ProdukWithDetails } from '#/lib/supabase/types'

export function ProductCard({ produk }: { produk: ProdukWithDetails }) {
  return (
    <Link to="/produk/$slug" params={{ slug: produk.slug }} className="block">
      <Card className="overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
        <div className="relative aspect-square overflow-hidden">
          {produk.foto_utama ? (
            <img
              src={produk.foto_utama}
              alt={produk.nama}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e8f5e9]">
              <Package className="h-12 w-12 text-[#1a6b3c]/40" />
            </div>
          )}
          {!produk.stok_tersedia && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500">
              Stok Habis
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium">{produk.nama}</h3>
          <p className="mt-1 text-base font-bold text-[#1a6b3c]">
            {formatRupiah(produk.harga)}
          </p>
          {produk.sellers && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {produk.sellers.nama_toko}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

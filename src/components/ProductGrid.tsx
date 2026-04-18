import { PackageX } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { ProdukWithDetails } from '#/lib/supabase/types'

export function ProductGrid({ products }: { products: ProdukWithDetails[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <PackageX className="mb-3 h-12 w-12" />
        <p>Belum ada produk yang tersedia</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((produk) => (
        <ProductCard key={produk.id} produk={produk} />
      ))}
    </div>
  )
}

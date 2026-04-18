import { useState } from 'react'
import { Package } from 'lucide-react'
import type { FotoProduk } from '#/lib/supabase/types'

export function PhotoGallery({ fotos }: { fotos: FotoProduk[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-[#e8f5e9]">
        <Package className="h-16 w-16 text-[#1a6b3c]/40" />
      </div>
    )
  }

  const selected = fotos[selectedIndex]

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg">
        <img
          src={selected?.url_foto}
          alt={`Foto ${selectedIndex + 1}`}
          className="aspect-[4/3] w-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
      {fotos.length > 1 && (
        <div className="flex gap-2">
          {fotos.map((foto, i) => (
            <button
              key={foto.id}
              onClick={() => setSelectedIndex(i)}
              className={`h-16 w-16 overflow-hidden rounded border-2 ${
                i === selectedIndex
                  ? 'border-[#1a6b3c]'
                  : 'border-transparent'
              }`}
            >
              <img
                src={foto.url_foto}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

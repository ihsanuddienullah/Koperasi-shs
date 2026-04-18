import { Badge } from '#/components/ui/badge'
import type { Kategori } from '#/lib/supabase/types'

export function KategoriFilter({
  kategori,
  activeSlug,
  onSelect,
}: {
  kategori: Kategori[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button onClick={() => onSelect(null)}>
        <Badge
          variant={activeSlug === null ? 'default' : 'outline'}
          className={
            activeSlug === null
              ? 'bg-[#1a6b3c] text-white hover:bg-[#1a6b3c]/90'
              : 'cursor-pointer'
          }
        >
          Semua
        </Badge>
      </button>
      {kategori.map((kat) => (
        <button key={kat.id} onClick={() => onSelect(kat.slug)}>
          <Badge
            variant={activeSlug === kat.slug ? 'default' : 'outline'}
            className={
              activeSlug === kat.slug
                ? 'bg-[#1a6b3c] text-white hover:bg-[#1a6b3c]/90'
                : 'cursor-pointer'
            }
          >
            {kat.nama_kategori}
          </Badge>
        </button>
      ))}
    </div>
  )
}

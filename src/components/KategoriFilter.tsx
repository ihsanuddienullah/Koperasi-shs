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
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-medium transition-all ${
          activeSlug === null
            ? 'border-[#2d6a4f] bg-[#2d6a4f] text-white shadow-sm'
            : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#74c69d] hover:text-[#2d6a4f]'
        }`}
      >
        Semua
      </button>
      {kategori.map((kat) => (
        <button
          key={kat.id}
          onClick={() => onSelect(kat.slug)}
          className={`shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-medium transition-all ${
            activeSlug === kat.slug
              ? 'border-[#2d6a4f] bg-[#2d6a4f] text-white shadow-sm'
              : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#74c69d] hover:text-[#2d6a4f]'
          }`}
        >
          {kat.nama_kategori}
        </button>
      ))}
    </div>
  )
}

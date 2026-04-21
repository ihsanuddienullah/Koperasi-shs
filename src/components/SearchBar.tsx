import { useState, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'

export function SearchBar({
  defaultValue = '',
  onSearch,
}: {
  defaultValue?: string
  onSearch: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onSearch(newValue)
      }, 300)
    },
    [onSearch]
  )

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
      <input
        type="text"
        placeholder="Cari produk..."
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10"
      />
    </div>
  )
}

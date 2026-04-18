import { useState, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '#/components/ui/input'

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
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari produk..."
        value={value}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  )
}

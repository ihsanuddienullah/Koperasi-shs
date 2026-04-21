import type { LucideIcon } from 'lucide-react'

type StatCardAccent = 'green' | 'wa' | 'saffron'

type StatCardProps = {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  accent?: StatCardAccent
}

const accentStyles: Record<StatCardAccent, { iconBg: string; iconColor: string; valueColor: string }> = {
  green: {
    iconBg: '#eaf7ed',
    iconColor: '#2d6a4f',
    valueColor: '#2d6a4f',
  },
  wa: {
    iconBg: '#d4f5e9',
    iconColor: '#128C7E',
    valueColor: '#128C7E',
  },
  saffron: {
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    valueColor: '#d97706',
  },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = 'green',
}: StatCardProps) {
  const styles = accentStyles[accent]
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: styles.iconBg }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: styles.iconColor }} />
        </div>
      </div>
      <p
        className="mt-3 text-3xl font-extrabold"
        style={{ color: styles.valueColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-[#9ca3af]">{description}</p>
      )}
    </div>
  )
}

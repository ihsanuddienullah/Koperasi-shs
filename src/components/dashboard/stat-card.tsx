import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-6', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-full bg-[#e8f5e9] p-2">
          <Icon className="h-4 w-4 text-[#1a6b3c]" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

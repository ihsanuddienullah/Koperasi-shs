import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type KlikChartProps = {
  data: Array<{ tanggal: string; klik: number }>
}

export function KlikChart({ data }: KlikChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
  }))

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
        Aktivitas
      </p>
      <h3
        className="mb-5 text-sm font-semibold text-[#111827]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Klik WhatsApp — 30 Hari Terakhir
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: unknown) => [value, 'Klik WA']) as any}
          />
          <Line
            type="monotone"
            dataKey="klik"
            stroke="#2d6a4f"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#2d6a4f', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

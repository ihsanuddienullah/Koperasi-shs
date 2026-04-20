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
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold">Klik WhatsApp (30 Hari Terakhir)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            interval={6}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: unknown) => [value, 'Klik']) as any}
          />
          <Line
            type="monotone"
            dataKey="klik"
            stroke="#1a6b3c"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

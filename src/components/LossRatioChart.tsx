import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { YearMetrics } from '../types'

interface LossRatioChartProps {
  data: YearMetrics[]
}

export default function LossRatioChart({ data }: LossRatioChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    'S/P (%)': parseFloat((d.spRatio * 100).toFixed(1)),
    'Premium (€k)': Math.round(d.premium / 1000),
    'Incurred (€k)': Math.round(d.incurred / 1000),
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-white font-semibold mb-4">S/P Ratio by Year</h2>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis
            yAxisId="sp"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="eur"
            orientation="left"
            tickFormatter={(v) => `€${v}k`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => {
              if (name === 'S/P (%)') return [`${value}%`, name]
              return [`€${Number(value).toLocaleString('fr-FR')}k`, name]
            }}
          />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Bar yAxisId="eur" dataKey="Premium (€k)" fill="#3b82f6" opacity={0.7} radius={[4, 4, 0, 0]} />
          <Bar yAxisId="eur" dataKey="Incurred (€k)" fill="#f59e0b" opacity={0.7} radius={[4, 4, 0, 0]} />
          <ReferenceLine
            yAxisId="sp"
            y={100}
            stroke="#ef4444"
            strokeDasharray="6 3"
            label={{ value: '100%', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-slate-500 text-xs mt-2">
        Bars: premium vs incurred (left axis) · Red line: S/P = 100% breakeven
      </p>
    </div>
  )
}

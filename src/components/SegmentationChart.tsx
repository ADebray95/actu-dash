import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SegmentDimension, SegmentMetrics } from '../types'

const DIMENSION_LABELS: Record<SegmentDimension, string> = {
  province: 'Province',
  gender: 'Gender',
  car_type: 'Car Type',
  fuel_type: 'Fuel Type',
  use_type: 'Use Type',
}

interface SegmentationChartProps {
  data: SegmentMetrics[]
  dimension: SegmentDimension
}

export default function SegmentationChart({ data, dimension }: SegmentationChartProps) {
  const chartData = data.map((d) => ({
    label: d.label,
    'Premium (€k)': Math.round(d.premium / 1000),
    'Incurred (€k)': Math.round(d.incurred / 1000),
    'S/P (%)': parseFloat((d.spRatio * 100).toFixed(1)),
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-white font-semibold mb-1">
        Segmentation by {DIMENSION_LABELS[dimension]}
      </h2>
      <p className="text-slate-500 text-xs mb-4">Top 10 by premium volume</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            yAxisId="eur"
            orientation="left"
            tickFormatter={(v) => `€${v}k`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            yAxisId="sp"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[0, 'auto']}
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
          <Line
            yAxisId="sp"
            type="monotone"
            dataKey="S/P (%)"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={{ fill: '#a78bfa', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

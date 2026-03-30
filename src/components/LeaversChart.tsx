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
import type { LeaverMetrics } from '../types'

interface LeaversChartProps {
  data: LeaverMetrics[]
}

export default function LeaversChart({ data }: LeaversChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    Leavers: d.leaverCount,
    Stayers: d.stayerCount,
    'Leavers S/P (%)': parseFloat((d.leaverSpRatio * 100).toFixed(1)),
    'Stayers S/P (%)': parseFloat((d.stayerSpRatio * 100).toFixed(1)),
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-white font-semibold mb-1">
        Portfolio Leavers Analysis
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Leavers = insured present in year N but absent in year N+1
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            yAxisId="count"
            orientation="left"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{
              value: 'Count',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 12,
            }}
          />
          <YAxis
            yAxisId="sp"
            orientation="right"
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#e2e8f0' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => {
              if (String(name).includes('S/P')) return [`${value}%`, name]
              return [Number(value).toLocaleString('fr-FR'), name]
            }}
          />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
          />
          <Bar
            yAxisId="count"
            dataKey="Leavers"
            fill="#ef4444"
            opacity={0.7}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="count"
            dataKey="Stayers"
            fill="#3b82f6"
            opacity={0.4}
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="sp"
            dataKey="Leavers S/P (%)"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4, fill: '#ef4444' }}
          />
          <Line
            yAxisId="sp"
            dataKey="Stayers S/P (%)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-slate-500 text-xs mt-2">
        Bars: leaver vs stayer count (left axis) · Lines: S/P ratio
        comparison (right axis)
      </p>
    </div>
  )
}

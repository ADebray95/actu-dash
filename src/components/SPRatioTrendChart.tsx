import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { YearMetrics } from '../types'

interface Props {
  data: YearMetrics[]
}

export default function SPRatioTrendChart({ data }: Props) {
  const chartData = data.map((d) => ({
    year: d.year,
    'S/P (%)': parseFloat((d.spRatio * 100).toFixed(1)),
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-white font-semibold mb-1">S/P Ratio Trend</h2>
      <p className="text-slate-400 text-xs mb-4">Year-over-year loss ratio evolution</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value) => [`${value}%`, 'S/P ratio']}
          />
          <ReferenceLine
            y={100}
            stroke="#ef4444"
            strokeDasharray="6 3"
            label={{ value: '100% breakeven', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }}
          />
          <Area
            type="monotone"
            dataKey="S/P (%)"
            stroke="#a78bfa"
            strokeWidth={2}
            fill="url(#spGradient)"
            dot={{ fill: '#a78bfa', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

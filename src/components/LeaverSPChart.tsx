import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LeaverYearMetrics } from '../types'

interface LeaverSPChartProps {
  data: LeaverYearMetrics[]
}

export default function LeaverSPChart({ data }: LeaverSPChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    'Leavers S/P (%)': d.leaverSP !== null ? parseFloat((d.leaverSP * 100).toFixed(1)) : null,
    'Stayers S/P (%)': d.stayerSP !== null ? parseFloat((d.stayerSP * 100).toFixed(1)) : null,
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h2 className="text-white font-semibold mb-1">S/P Ratio — Leavers vs Stayers</h2>
      <p className="text-slate-400 text-xs mb-4">
        Leavers: policyholders who did not renew the following year · Stayers: policyholders who renewed
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
            formatter={(value) =>
              value != null ? [`${value}%`] : ['N/A']
            }
          />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <ReferenceLine
            y={100}
            stroke="#ef4444"
            strokeDasharray="6 3"
            label={{ value: '100%', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }}
          />
          <Line
            type="monotone"
            dataKey="Leavers S/P (%)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4, fill: '#f59e0b' }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="Stayers S/P (%)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-slate-500 text-xs mt-2">
        Last year excluded — leaver/stayer status requires a subsequent year to be known
      </p>
    </div>
  )
}

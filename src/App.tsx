import { useState } from 'react'
import ClaimsTable from './components/ClaimsTable'
import FeedbackModal from './components/FeedbackModal'
import FileUpload from './components/FileUpload'
import Filters from './components/Filters'
import KpiCards from './components/KpiCards'
import LossRatioChart from './components/LossRatioChart'
import SPRatioTrendChart from './components/SPRatioTrendChart'
import SegmentationChart from './components/SegmentationChart'
import type { DashboardData, SegmentDimension } from './types'
import { parseXlsx } from './utils/parseXlsx'
import {
  availableYears,
  computeKPIs,
  computeSPByYear,
  groupByDimension,
} from './utils/metrics'

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [yearFilter, setYearFilter] = useState<number[]>([])
  const [dimension, setDimension] = useState<SegmentDimension>('province')
  const [showFeedback, setShowFeedback] = useState(false)

  function handleLoad(buffer: ArrayBuffer) {
    try {
      const parsed = parseXlsx(buffer)
      setData(parsed)
      setLoadError(null)
      setYearFilter([])
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    }
  }

  if (!data) {
    return <FileUpload onLoad={handleLoad} error={loadError} />
  }

  const years = availableYears(data)
  const kpis = computeKPIs(data, yearFilter)
  const spByYear = computeSPByYear(data, yearFilter)
  const segmentData = groupByDimension(data, dimension, yearFilter)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">📊 Actuary Dashboard</h1>
          <p className="text-slate-400 text-sm">Motor insurance portfolio — fabricated data</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
            onClick={() => setShowFeedback(true)}
          >
            + Report / Request
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
            onClick={() => { setData(null); setLoadError(null) }}
          >
            ↩ Load new file
          </button>
        </div>
      </header>
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <main className="max-w-7xl mx-auto px-6 py-6">
        <KpiCards kpis={kpis} />

        <Filters
          allYears={years}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          dimension={dimension}
          setDimension={setDimension}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LossRatioChart data={spByYear} />
          <SegmentationChart data={segmentData} dimension={dimension} />
        </div>

        <div className="mb-6">
          <SPRatioTrendChart data={spByYear} />
        </div>

        <ClaimsTable data={data} yearFilter={yearFilter} />
      </main>
    </div>
  )
}

import type { SegmentDimension } from '../types'

const DIMENSIONS: { value: SegmentDimension; label: string }[] = [
  { value: 'province', label: 'Province' },
  { value: 'gender', label: 'Gender' },
  { value: 'car_type', label: 'Car Type' },
  { value: 'fuel_type', label: 'Fuel Type' },
  { value: 'use_type', label: 'Use Type' },
]

interface FiltersProps {
  allYears: number[]
  yearFilter: number[]
  setYearFilter: (years: number[]) => void
  dimension: SegmentDimension
  setDimension: (dim: SegmentDimension) => void
}

export default function Filters({
  allYears,
  yearFilter,
  setYearFilter,
  dimension,
  setDimension,
}: FiltersProps) {
  function toggleYear(year: number) {
    if (yearFilter.includes(year)) {
      setYearFilter(yearFilter.filter((y) => y !== year))
    } else {
      setYearFilter([...yearFilter, year].sort())
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Year</p>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              yearFilter.length === 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setYearFilter([])}
          >
            All
          </button>
          {allYears.map((year) => (
            <button
              key={year}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                yearFilter.includes(year)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => toggleYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
          Segment by
        </p>
        <div className="flex flex-wrap gap-2">
          {DIMENSIONS.map((d) => (
            <button
              key={d.value}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dimension === d.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => setDimension(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

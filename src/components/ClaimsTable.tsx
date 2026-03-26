import { useState } from 'react'
import type { Claim, DashboardData } from '../types'

const PAGE_SIZE = 20

type SortKey = keyof Claim
type SortDir = 'asc' | 'desc'

function fmtDate(s: string): string {
  return s ? s.slice(0, 10) : '—'
}

function fmtEur(n: number): string {
  return `€${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}`
}

interface ClaimsTableProps {
  data: DashboardData
  yearFilter: number[]
}

export default function ClaimsTable({ data, yearFilter }: ClaimsTableProps) {
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>('accident_date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered =
    yearFilter.length === 0
      ? data.claims
      : data.claims.filter((c) => {
          const year = parseInt(c.accident_date.slice(0, 4), 10)
          return yearFilter.includes(year)
        })

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const rows = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <span className="text-slate-600 ml-1">↕</span>
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const cols: { key: SortKey; label: string; render: (c: Claim) => string }[] = [
    { key: 'claim_id', label: 'Claim ID', render: (c) => c.claim_id },
    { key: 'insured_id', label: 'Insured ID', render: (c) => c.insured_id },
    { key: 'accident_date', label: 'Accident Date', render: (c) => fmtDate(c.accident_date) },
    {
      key: 'is_closed',
      label: 'Status',
      render: (c) => (c.is_closed ? '✓ Closed' : '⏳ Open'),
    },
    { key: 'total_paid', label: 'Paid', render: (c) => fmtEur(c.total_paid) },
    { key: 'reserve', label: 'Reserve', render: (c) => fmtEur(c.reserve) },
    { key: 'total_incurred', label: 'Incurred', render: (c) => fmtEur(c.total_incurred) },
  ]

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-5 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-white font-semibold">
          Claims{' '}
          <span className="text-slate-400 text-sm font-normal">({filtered.length.toLocaleString('fr-FR')})</span>
        </h2>
        <span className="text-slate-500 text-sm">
          Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-slate-400 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((claim, i) => (
              <tr
                key={claim.claim_id}
                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                  i % 2 === 0 ? '' : 'bg-slate-800/50'
                }`}
              >
                {cols.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                    {col.render(claim)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={cols.length} className="px-4 py-8 text-center text-slate-500">
                  No claims match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 flex items-center justify-center gap-2">
          <button
            className="px-3 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ← Prev
          </button>
          <span className="text-slate-400 text-sm px-2">
            {page + 1} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

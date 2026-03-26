import type { KPIs } from '../types'

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtEur(n: number): string {
  return `€${fmt(n)}`
}

function fmtPct(n: number): string {
  return `${fmt(n * 100, 1)} %`
}

interface CardProps {
  label: string
  value: string
  sub?: string
  highlight?: 'ok' | 'warn' | 'danger' | 'neutral'
}

function Card({ label, value, sub, highlight = 'neutral' }: CardProps) {
  const colors: Record<string, string> = {
    ok: 'text-green-400',
    warn: 'text-amber-400',
    danger: 'text-red-400',
    neutral: 'text-white',
  }
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[highlight]}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

interface KpiCardsProps {
  kpis: KPIs
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const spHighlight =
    kpis.spRatio > 1 ? 'danger' : kpis.spRatio > 0.85 ? 'warn' : 'ok'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card
        label="Total Premiums"
        value={fmtEur(kpis.totalPremium)}
        sub="sum premium_paid"
      />
      <Card
        label="Total Incurred"
        value={fmtEur(kpis.totalIncurred)}
        sub="sum total_incurred"
      />
      <Card
        label="S/P Ratio"
        value={fmtPct(kpis.spRatio)}
        sub="incurred / premium"
        highlight={spHighlight}
      />
      <Card
        label="Avg Claim Cost"
        value={fmtEur(kpis.avgClaimCost)}
        sub={`over ${fmt(kpis.claimCount)} claims`}
      />
    </div>
  )
}

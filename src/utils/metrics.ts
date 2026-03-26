import type {
  Claim,
  DashboardData,
  InsuredYear,
  KPIs,
  SegmentDimension,
  SegmentMetrics,
  YearMetrics,
} from '../types'

function claimYear(claim: Claim): number {
  return parseInt(claim.accident_date.slice(0, 4), 10)
}

/** Premium totals for the filtered insured_year rows (one row per policy-year). */
function filteredInsured(data: DashboardData, yearFilter: number[]): InsuredYear[] {
  if (yearFilter.length === 0) return data.insuredYears
  return data.insuredYears.filter((r) => yearFilter.includes(r.year))
}

export function computeKPIs(data: DashboardData, yearFilter: number[]): KPIs {
  const insured = filteredInsured(data, yearFilter)
  const totalPremium = insured.reduce((s, r) => s + r.premium_paid, 0)

  const claims = yearFilter.length === 0
    ? data.claims
    : data.claims.filter((c) => yearFilter.includes(claimYear(c)))

  const totalIncurred = claims.reduce((s, c) => s + c.total_incurred, 0)
  const claimCount = claims.length
  const spRatio = totalPremium > 0 ? totalIncurred / totalPremium : 0
  const avgClaimCost = claimCount > 0 ? totalIncurred / claimCount : 0

  return { totalPremium, totalIncurred, spRatio, avgClaimCost, claimCount }
}

export function computeSPByYear(data: DashboardData, yearFilter: number[]): YearMetrics[] {
  const years = [...new Set(data.insuredYears.map((r) => r.year))].sort()
  const filtered = yearFilter.length > 0 ? years.filter((y) => yearFilter.includes(y)) : years

  return filtered.map((year) => {
    const insured = data.insuredYears.filter((r) => r.year === year)
    const claims = data.claims.filter((c) => claimYear(c) === year)
    const premium = insured.reduce((s, r) => s + r.premium_paid, 0)
    const incurred = claims.reduce((s, c) => s + c.total_incurred, 0)
    return { year, premium, incurred, spRatio: premium > 0 ? incurred / premium : 0 }
  })
}

export function groupByDimension(
  data: DashboardData,
  dim: SegmentDimension,
  yearFilter: number[],
): SegmentMetrics[] {
  const insured = filteredInsured(data, yearFilter)

  const premiumByLabel = new Map<string, number>()
  for (const row of insured) {
    const label = String(row[dim] ?? 'Unknown')
    premiumByLabel.set(label, (premiumByLabel.get(label) ?? 0) + row.premium_paid)
  }

  const claims = yearFilter.length === 0
    ? data.claims
    : data.claims.filter((c) => yearFilter.includes(claimYear(c)))

  const insuredByKey = new Map<string, InsuredYear>()
  for (const row of insured) {
    insuredByKey.set(`${row.insured_id}__${row.year}`, row)
  }

  const incurredByLabel = new Map<string, number>()
  for (const claim of claims) {
    const key = `${claim.insured_id}__${claimYear(claim)}`
    const row = insuredByKey.get(key)
    if (!row) continue
    const label = String(row[dim] ?? 'Unknown')
    incurredByLabel.set(label, (incurredByLabel.get(label) ?? 0) + claim.total_incurred)
  }

  return [...premiumByLabel.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, premium]) => {
      const incurred = incurredByLabel.get(label) ?? 0
      return { label, premium, incurred, spRatio: premium > 0 ? incurred / premium : 0 }
    })
}

export function availableYears(data: DashboardData): number[] {
  return [...new Set(data.insuredYears.map((r) => r.year))].sort()
}

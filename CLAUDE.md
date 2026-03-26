# Actuary Dashboard — Claude Code Guide

This is a React + Vite + TypeScript dashboard for motor insurance portfolio analysis.
It runs fully in the browser (no backend). Data comes from a user-uploaded XLSX file.

## Quick start

```bash
pnpm dev        # dev server at http://localhost:5173
pnpm build      # production build (must pass before pushing)
pnpm preview    # preview the production build locally
```

Push to `main` → GitHub Actions builds → deploys to GitHub Pages in ~60s.

## Data schema

Two XLSX sheets joined on `insured_id` + `year`.

**`insured_year`** — one row per policy per year:

| Column | Type | Notes |
|--------|------|-------|
| insured_id | string | primary key |
| year | number | calendar year |
| gender | string | e.g. M, F |
| family_situation | string | |
| province | string | Belgian province |
| city | string | |
| car_type | string | e.g. berline, SUV |
| car_power_kw | number | |
| fuel_type | string | e.g. diesel, essence |
| use_type | string | e.g. private, professional |
| parking_type | string | |
| nb_vehicles_household | number | |
| age | number | insured age |
| car_age_years | number | |
| driving_experience_years | number | |
| annual_mileage_km | number | |
| bonus_malus_coeff | number | |
| prior_claims_3y | number | |
| has_young_driver | boolean | |
| premium_paid | number | EUR |

**`claims`** — one row per claim:

| Column | Type | Notes |
|--------|------|-------|
| claim_id | string | primary key |
| insured_id | string | FK to insured_year |
| accident_date | string | ISO date, year used for join |
| reported_date | string | |
| closed_date | string | |
| is_closed | boolean | |
| total_paid | number | EUR, paid so far |
| reserve | number | EUR, estimated remaining |
| total_incurred | number | total_paid + reserve |

**Key metric:** S/P ratio = `sum(total_incurred) / sum(premium_paid)`

## Component inventory

| File | Responsibility |
|------|----------------|
| `src/App.tsx` | Global state (data, yearFilter, dimension), layout |
| `src/types.ts` | All TypeScript interfaces |
| `src/utils/parseXlsx.ts` | SheetJS XLSX → typed arrays |
| `src/utils/metrics.ts` | KPI calculations, S/P by year, groupByDimension |
| `src/components/FileUpload.tsx` | Drop zone, shown before data is loaded |
| `src/components/KpiCards.tsx` | 4 top-level KPI cards |
| `src/components/Filters.tsx` | Year toggle buttons + segmentation dimension picker |
| `src/components/LossRatioChart.tsx` | S/P ratio + premium/incurred bars by year (recharts) |
| `src/components/SegmentationChart.tsx` | Premium/incurred/S/P by selected dimension (recharts) |
| `src/components/ClaimsTable.tsx` | Paginated sortable claims table |

## How to add a new chart

1. Create `src/components/MyNewChart.tsx` — use `recharts` (`ComposedChart`, `BarChart`, `LineChart`, etc.)
2. Import it in `src/App.tsx` and drop it in `<main>` where it fits
3. If it needs filtered data, pass `data`, `yearFilter`, or pre-computed arrays from `metrics.ts`
4. Run `pnpm build` to verify no TypeScript errors before pushing

## Styling

Tailwind v4 utility classes. Dark theme: `bg-slate-900` page, `bg-slate-800` cards, `border-slate-700` borders.
Consistent color palette:
- Blue `#3b82f6` — premium
- Amber `#f59e0b` — incurred / claims
- Violet `#a78bfa` — S/P ratio line
- Green `text-green-400` — healthy S/P
- Red `text-red-400` / `#ef4444` — S/P > 100%

## Pushing changes

```bash
git add src/
git commit -m "feat: <description>"
git push origin main
# GitHub Actions deploys automatically — live in ~60s
```

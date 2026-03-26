import * as XLSX from 'xlsx'
import type { Claim, DashboardData, InsuredYear } from '../types'

function assertColumns(sheet: XLSX.WorkSheet, required: string[], sheetName: string): void {
  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1:A1')
  const headers: string[] = []
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })]
    if (cell?.v) headers.push(String(cell.v))
  }
  const missing = required.filter((h) => !headers.includes(h))
  if (missing.length > 0) {
    throw new Error(
      `Sheet "${sheetName}" is missing columns: ${missing.join(', ')}.\nFound: ${headers.join(', ')}`,
    )
  }
}

export function parseXlsx(buffer: ArrayBuffer): DashboardData {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })

  const insuredSheetName = workbook.SheetNames.find((n) =>
    n.toLowerCase().includes('insured'),
  )
  const claimsSheetName = workbook.SheetNames.find((n) =>
    n.toLowerCase().includes('claim'),
  )

  if (!insuredSheetName) {
    throw new Error(
      `No sheet with "insured" in its name. Found: ${workbook.SheetNames.join(', ')}`,
    )
  }
  if (!claimsSheetName) {
    throw new Error(
      `No sheet with "claim" in its name. Found: ${workbook.SheetNames.join(', ')}`,
    )
  }

  const insuredSheet = workbook.Sheets[insuredSheetName]
  const claimsSheet = workbook.Sheets[claimsSheetName]

  assertColumns(
    insuredSheet,
    ['insured_id', 'year', 'gender', 'province', 'car_type', 'fuel_type', 'use_type', 'premium_paid'],
    insuredSheetName,
  )
  assertColumns(
    claimsSheet,
    ['claim_id', 'insured_id', 'accident_date', 'is_closed', 'total_paid', 'reserve', 'total_incurred'],
    claimsSheetName,
  )

  const rawInsured = XLSX.utils.sheet_to_json<Record<string, unknown>>(insuredSheet)
  const rawClaims = XLSX.utils.sheet_to_json<Record<string, unknown>>(claimsSheet)

  const insuredYears: InsuredYear[] = rawInsured.map((row) => ({
    insured_id: String(row['insured_id'] ?? ''),
    year: Number(row['year']),
    gender: String(row['gender'] ?? ''),
    family_situation: String(row['family_situation'] ?? ''),
    province: String(row['province'] ?? ''),
    city: String(row['city'] ?? ''),
    car_type: String(row['car_type'] ?? ''),
    car_power_kw: Number(row['car_power_kw'] ?? 0),
    fuel_type: String(row['fuel_type'] ?? ''),
    use_type: String(row['use_type'] ?? ''),
    parking_type: String(row['parking_type'] ?? ''),
    nb_vehicles_household: Number(row['nb_vehicles_household'] ?? 0),
    age: Number(row['age'] ?? 0),
    car_age_years: Number(row['car_age_years'] ?? 0),
    driving_experience_years: Number(row['driving_experience_years'] ?? 0),
    annual_mileage_km: Number(row['annual_mileage_km'] ?? 0),
    bonus_malus_coeff: Number(row['bonus_malus_coeff'] ?? 1),
    prior_claims_3y: Number(row['prior_claims_3y'] ?? 0),
    has_young_driver: Boolean(row['has_young_driver']),
    premium_paid: Number(row['premium_paid'] ?? 0),
  }))

  const claims: Claim[] = rawClaims.map((row) => {
    const accidentDate = row['accident_date']
    const accidentDateStr =
      accidentDate instanceof Date
        ? accidentDate.toISOString().slice(0, 10)
        : String(accidentDate ?? '')

    return {
      claim_id: String(row['claim_id'] ?? ''),
      insured_id: String(row['insured_id'] ?? ''),
      accident_date: accidentDateStr,
      reported_date: String(row['reported_date'] ?? ''),
      closed_date: String(row['closed_date'] ?? ''),
      is_closed: Boolean(row['is_closed']),
      total_paid: Number(row['total_paid'] ?? 0),
      reserve: Number(row['reserve'] ?? 0),
      total_incurred: Number(row['total_incurred'] ?? 0),
    }
  })

  return { insuredYears, claims }
}

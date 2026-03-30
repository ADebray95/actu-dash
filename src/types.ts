export interface InsuredYear {
  insured_id: string
  year: number
  gender: string
  family_situation: string
  province: string
  city: string
  car_type: string
  car_power_kw: number
  fuel_type: string
  use_type: string
  parking_type: string
  nb_vehicles_household: number
  age: number
  car_age_years: number
  driving_experience_years: number
  annual_mileage_km: number
  bonus_malus_coeff: number
  prior_claims_3y: number
  has_young_driver: boolean
  premium_paid: number
}

export interface Claim {
  claim_id: string
  insured_id: string
  accident_date: string
  reported_date: string
  closed_date: string
  is_closed: boolean
  total_paid: number
  reserve: number
  total_incurred: number
}

export interface DashboardData {
  insuredYears: InsuredYear[]
  claims: Claim[]
}

export interface KPIs {
  totalPremium: number
  totalIncurred: number
  spRatio: number
  avgClaimCost: number
  claimCount: number
}

export interface YearMetrics {
  year: number
  premium: number
  incurred: number
  spRatio: number
}

export interface SegmentMetrics {
  label: string
  premium: number
  incurred: number
  spRatio: number
}

export interface LeaverMetrics {
  year: number
  leaverCount: number
  stayerCount: number
  leaverSpRatio: number
  stayerSpRatio: number
}

export type SegmentDimension =
  | 'province'
  | 'gender'
  | 'car_type'
  | 'fuel_type'
  | 'use_type'

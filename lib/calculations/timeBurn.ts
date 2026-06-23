export interface SpendRate {
  label: string
  amountPerDay: number
}

export interface TimeBurnResult {
  spendRate: SpendRate
  netWorth: number
  days: number
  years: number
  formattedDuration: string
}

export const SPEND_RATES: SpendRate[] = [
  { label: '$1/second',    amountPerDay: 86_400 },
  { label: '$1,000/day',   amountPerDay: 1_000 },
  { label: '$100,000/day', amountPerDay: 100_000 },
  { label: '$1M/day',      amountPerDay: 1_000_000 },
  { label: '$1B/day',      amountPerDay: 1_000_000_000 },
]

export function calculateTimeBurn(netWorth: number, spendRate: SpendRate): TimeBurnResult {
  const days = netWorth / spendRate.amountPerDay
  const years = days / 365.25
  return {
    spendRate,
    netWorth,
    days,
    years,
    formattedDuration: formatDuration(years),
  }
}

function formatDuration(years: number): string {
  if (years >= 1_000_000) return `${(years / 1_000_000).toFixed(1)} million years`
  if (years >= 1_000) return `${Math.round(years / 1_000).toLocaleString()} thousand years`
  if (years >= 100) return `${Math.round(years).toLocaleString()} years`
  if (years >= 1) return `${years.toFixed(1)} years`
  const days = years * 365.25
  if (days >= 1) return `${Math.round(days)} days`
  return `${Math.round(days * 24)} hours`
}

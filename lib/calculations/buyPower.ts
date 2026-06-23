import type { ComparisonUnit } from '../database.types'

export interface BuyPowerResult {
  unit: ComparisonUnit
  quantity: number
  formattedQuantity: string
  netWorth: number
}

export function calculateBuyPower(netWorth: number, unit: ComparisonUnit): BuyPowerResult {
  const quantity = Math.floor(netWorth / unit.value)
  return {
    unit,
    quantity,
    formattedQuantity: formatQuantity(quantity),
    netWorth,
  }
}

export function formatQuantity(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

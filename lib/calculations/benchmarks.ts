import type { ComparisonUnit } from '../database.types'

export interface BenchmarkResult {
  unit: ComparisonUnit
  netWorth: number
  ratio: number
  formattedRatio: string
  isGreaterThan: boolean
}

export function calculateBenchmark(netWorth: number, unit: ComparisonUnit): BenchmarkResult {
  const ratio = netWorth / unit.value
  const isGreaterThan = ratio >= 1

  return {
    unit,
    netWorth,
    ratio,
    formattedRatio: formatRatio(ratio),
    isGreaterThan,
  }
}

function formatRatio(ratio: number): string {
  if (ratio >= 1_000) return `${(ratio / 1_000).toFixed(1)}× thousand`
  if (ratio >= 1) return `${ratio.toFixed(1)}×`
  if (ratio >= 0.01) return `${(ratio * 100).toFixed(1)}% of`
  return `${(ratio * 100).toFixed(3)}% of`
}

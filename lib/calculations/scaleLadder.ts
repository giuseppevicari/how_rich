import type { ComparisonUnit } from '../database.types'

export interface ScaleRung {
  quantity: number
  label: string
  description: string
  layer: 'object' | 'cluster' | 'macro' | 'abstract'
}

export interface ScaleLadderResult {
  unit: ComparisonUnit
  netWorth: number
  totalQuantity: number
  rungs: ScaleRung[]
}

const RUNG_CONFIGS = [
  { max: 10,          layer: 'object'   as const, descriptionFn: (n: number, u: string) => `${n} ${u}` },
  { max: 100,         layer: 'object'   as const, descriptionFn: (n: number, u: string) => `${n} ${u} — a small collection` },
  { max: 1_000,       layer: 'cluster'  as const, descriptionFn: (n: number, u: string) => `${n.toLocaleString()} ${u} — a dealer showroom` },
  { max: 10_000,      layer: 'cluster'  as const, descriptionFn: (n: number, u: string) => `${n.toLocaleString()} ${u} — fills a stadium parking lot` },
  { max: 100_000,     layer: 'macro'    as const, descriptionFn: (n: number, u: string) => `${n.toLocaleString()} ${u} — covers a city neighborhood` },
  { max: 1_000_000,   layer: 'macro'    as const, descriptionFn: (n: number, u: string) => `${(n/1000).toFixed(0)}K ${u} — city-scale saturation` },
  { max: 1_000_000_000, layer: 'abstract' as const, descriptionFn: (n: number, u: string) => `${(n/1_000_000).toFixed(1)}M ${u} — country-scale abstraction` },
  { max: Infinity,    layer: 'abstract' as const, descriptionFn: (n: number, u: string) => `${(n/1_000_000_000).toFixed(2)}B ${u} — planetary scale` },
]

export function calculateScaleLadder(netWorth: number, unit: ComparisonUnit): ScaleLadderResult {
  const totalQuantity = Math.floor(netWorth / unit.value)
  const rungs: ScaleRung[] = []

  let magnitude = 1
  while (magnitude <= totalQuantity) {
    const config = RUNG_CONFIGS.find(c => magnitude <= c.max) ?? RUNG_CONFIGS[RUNG_CONFIGS.length - 1]
    rungs.push({
      quantity: magnitude,
      label: formatRuneLabel(magnitude),
      description: config.descriptionFn(magnitude, unit.name),
      layer: config.layer,
    })
    magnitude = nextMagnitude(magnitude)
  }

  const lastConfig = RUNG_CONFIGS.find(c => totalQuantity <= c.max) ?? RUNG_CONFIGS[RUNG_CONFIGS.length - 1]
  if (rungs.length === 0 || rungs[rungs.length - 1].quantity !== totalQuantity) {
    rungs.push({
      quantity: totalQuantity,
      label: formatRuneLabel(totalQuantity),
      description: lastConfig.descriptionFn(totalQuantity, unit.name),
      layer: lastConfig.layer,
    })
  }

  return { unit, netWorth, totalQuantity, rungs }
}

function nextMagnitude(n: number): number {
  const digits = Math.floor(Math.log10(n))
  const base = Math.pow(10, digits)
  return n >= base * 5 ? base * 10 : base * 5
}

function formatRuneLabel(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

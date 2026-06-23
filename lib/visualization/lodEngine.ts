export type LODLevel = 'object' | 'cluster' | 'macro' | 'abstract'

export interface LODConfig {
  level: LODLevel
  maxVisible: number
  gridColumns: number
  unitSize: number
}

const LOD_THRESHOLDS: { max: number; config: LODConfig }[] = [
  {
    max: 500,
    config: { level: 'object', maxVisible: 500, gridColumns: 20, unitSize: 24 },
  },
  {
    max: 10_000,
    config: { level: 'cluster', maxVisible: 200, gridColumns: 20, unitSize: 16 },
  },
  {
    max: 1_000_000,
    config: { level: 'macro', maxVisible: 100, gridColumns: 10, unitSize: 12 },
  },
  {
    max: Infinity,
    config: { level: 'abstract', maxVisible: 50, gridColumns: 10, unitSize: 8 },
  },
]

export function getLODConfig(quantity: number): LODConfig {
  const entry = LOD_THRESHOLDS.find(t => quantity <= t.max)
  return entry ? entry.config : LOD_THRESHOLDS[LOD_THRESHOLDS.length - 1].config
}

export function getAggregationFactor(quantity: number, config: LODConfig): number {
  return Math.ceil(quantity / config.maxVisible)
}

import { calculateScaleLadder } from '@/lib/calculations/scaleLadder'
import type { ComparisonUnit } from '@/lib/database.types'

const lamborghini: ComparisonUnit = {
  id: '1', name: 'Lamborghini Revuelto', slug: 'lamborghini-revuelto', category: 'consumer',
  value: 517770, icon_url: null, description: null, source_url: null,
  active: true, created_at: '2024-01-01',
}

describe('calculateScaleLadder', () => {
  it('generates rungs in ascending order', () => {
    const result = calculateScaleLadder(221_000_000_000, lamborghini)
    for (let i = 1; i < result.rungs.length; i++) {
      expect(result.rungs[i].quantity).toBeGreaterThan(result.rungs[i - 1].quantity)
    }
  })

  it('final rung equals totalQuantity', () => {
    const result = calculateScaleLadder(221_000_000_000, lamborghini)
    const last = result.rungs[result.rungs.length - 1]
    expect(last.quantity).toBe(result.totalQuantity)
  })

  it('totalQuantity is correct', () => {
    const result = calculateScaleLadder(221_000_000_000, lamborghini)
    expect(result.totalQuantity).toBe(Math.floor(221_000_000_000 / 517770))
  })

  it('returns a single rung for very small net worth', () => {
    const result = calculateScaleLadder(lamborghini.value, lamborghini)
    expect(result.totalQuantity).toBe(1)
    expect(result.rungs.length).toBeGreaterThanOrEqual(1)
  })

  it('returns empty rungs when net worth cannot buy any unit', () => {
    const result = calculateScaleLadder(100, lamborghini)
    expect(result.totalQuantity).toBe(0)
  })
})

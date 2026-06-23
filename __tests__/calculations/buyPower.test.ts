import { calculateBuyPower, formatQuantity } from '@/lib/calculations/buyPower'
import type { ComparisonUnit } from '@/lib/database.types'

const bigMac: ComparisonUnit = {
  id: '1', name: 'Big Mac', slug: 'big-mac', category: 'consumer',
  value: 5.69, icon_url: null, description: null, source_url: null,
  active: true, created_at: '2024-01-01',
}

const lamborghini: ComparisonUnit = {
  id: '2', name: 'Lamborghini Revuelto', slug: 'lamborghini-revuelto', category: 'consumer',
  value: 517770, icon_url: null, description: null, source_url: null,
  active: true, created_at: '2024-01-01',
}

describe('calculateBuyPower', () => {
  it('calculates Big Mac count for Elon Musk net worth', () => {
    const result = calculateBuyPower(221_000_000_000, bigMac)
    expect(result.quantity).toBe(Math.floor(221_000_000_000 / 5.69))
    expect(result.quantity).toBeGreaterThan(38_000_000_000)
  })

  it('calculates Lamborghini count correctly', () => {
    const result = calculateBuyPower(221_000_000_000, lamborghini)
    expect(result.quantity).toBe(Math.floor(221_000_000_000 / 517770))
    expect(result.quantity).toBeGreaterThan(420_000)
  })

  it('returns zero quantity when net worth is less than unit value', () => {
    const result = calculateBuyPower(100, lamborghini)
    expect(result.quantity).toBe(0)
  })

  it('always returns integer quantity (floors)', () => {
    const result = calculateBuyPower(10, bigMac)
    expect(Number.isInteger(result.quantity)).toBe(true)
    expect(result.quantity).toBe(1)
  })
})

describe('formatQuantity', () => {
  it('formats billions', () => expect(formatQuantity(1_500_000_000)).toBe('1.5B'))
  it('formats millions', () => expect(formatQuantity(2_300_000)).toBe('2.3M'))
  it('formats thousands', () => expect(formatQuantity(4_200)).toBe('4.2K'))
  it('formats small numbers', () => expect(formatQuantity(42)).toBe('42'))
})

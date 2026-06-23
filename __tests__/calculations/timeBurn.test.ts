import { calculateTimeBurn, SPEND_RATES } from '@/lib/calculations/timeBurn'

const NET_WORTH = 221_000_000_000

describe('calculateTimeBurn', () => {
  it('spending $1/sec depletes over thousands of years', () => {
    const rate = SPEND_RATES.find(r => r.label === '$1/second')!
    const result = calculateTimeBurn(NET_WORTH, rate)
    expect(result.years).toBeGreaterThan(5_000)
    expect(result.formattedDuration).toMatch(/thousand years/)
  })

  it('spending $1M/day depletes over hundreds of years', () => {
    const rate = SPEND_RATES.find(r => r.label === '$1M/day')!
    const result = calculateTimeBurn(NET_WORTH, rate)
    expect(result.years).toBeGreaterThan(100)
    expect(result.years).toBeLessThan(10_000)
  })

  it('spending $1B/day depletes in less than a year', () => {
    const rate = SPEND_RATES.find(r => r.label === '$1B/day')!
    const result = calculateTimeBurn(1_000_000_000, rate)
    expect(result.days).toBeCloseTo(1)
  })

  it('days is consistent with years', () => {
    const rate = SPEND_RATES[0]
    const result = calculateTimeBurn(NET_WORTH, rate)
    expect(result.days / 365.25).toBeCloseTo(result.years, 5)
  })
})

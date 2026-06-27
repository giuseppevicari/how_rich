import { createServiceClient } from '../supabase'

// Troy ounces in one metric tonne
const TROY_OZ_PER_TONNE = 32_150.75

export async function updateGoldPrice(): Promise<{ pricePerOz: number; tonneValue: number }> {
  const res = await fetch('https://api.coinbase.com/v2/prices/XAU-USD/spot', {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Coinbase gold price API responded with ${res.status}`)

  const json = await res.json() as { data: { amount: string } }
  const pricePerOz = parseFloat(json.data.amount)
  if (!isFinite(pricePerOz) || pricePerOz <= 0) {
    throw new Error(`Invalid gold price: ${json.data.amount}`)
  }

  const tonneValue = Math.round(pricePerOz * TROY_OZ_PER_TONNE)

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('comparison_units')
    .update({ value: tonneValue })
    .eq('slug', 'tonne-of-gold')

  if (error) throw new Error(`Failed to update gold price in DB: ${error.message}`)

  return { pricePerOz, tonneValue }
}

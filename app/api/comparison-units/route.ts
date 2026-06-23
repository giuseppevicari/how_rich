import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { ComparisonUnit, ComparisonCategory } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: raw, error } = await supabase
      .from('comparison_units')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('name')

    if (error) throw error

    const units = (raw ?? []) as ComparisonUnit[]

    const grouped = units.reduce(
      (acc, unit) => {
        const cat = unit.category as ComparisonCategory
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(unit)
        return acc
      },
      {} as Record<ComparisonCategory, ComparisonUnit[]>
    )

    return NextResponse.json({ units, grouped })
  } catch (err) {
    console.error('[GET /api/comparison-units]', err)
    return NextResponse.json({ error: 'Failed to fetch comparison units' }, { status: 500 })
  }
}

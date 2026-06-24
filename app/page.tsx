import { Suspense } from 'react'
import { HomeClient } from './HomeClient'
import type { BillionaireWithSnapshot, ComparisonUnit, WealthSnapshot } from '@/lib/database.types'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const supabase = createServiceClient()

    const [latestDateRes, unitsRes] = await Promise.all([
      supabase
        .from('wealth_snapshots')
        .select('date')
        .order('date', { ascending: false })
        .limit(1)
        .single(),
      supabase.from('comparison_units').select('*').eq('active', true).order('category').order('name'),
    ])

    const units = (unitsRes.data ?? []) as ComparisonUnit[]
    const latestDate = (latestDateRes.data as { date: string } | null)?.date

    if (!latestDate) return { billionaires: [], units }

    // Only include snapshots from the most recent refresh date — excludes stale seed data
    const { data: snapshotsRaw } = await supabase
      .from('wealth_snapshots')
      .select('*')
      .eq('date', latestDate)
      .order('rank', { ascending: true })
      .limit(10)

    const snapshots = (snapshotsRaw ?? []) as WealthSnapshot[]
    if (!snapshots.length) return { billionaires: [], units }

    const { data: billionairesRaw } = await supabase
      .from('billionaires')
      .select('*')
      .in('id', snapshots.map(s => s.billionaire_id))

    const billionairesById = new Map(
      ((billionairesRaw ?? []) as BillionaireWithSnapshot[]).map(b => [b.id, b])
    )

    const billionaires = snapshots
      .map(s => {
        const b = billionairesById.get(s.billionaire_id)
        if (!b) return null
        b.latestSnapshot = s
        return b
      })
      .filter((b): b is BillionaireWithSnapshot => b !== null)

    return { billionaires, units }
  } catch {
    return { billionaires: [], units: [] }
  }
}

export default async function HomePage() {
  const { billionaires, units } = await getData()

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-3">
            How <span className="text-amber-400">Rich?</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Translate billionaire wealth into things you can actually imagine.
          </p>
        </header>

        <Suspense fallback={<div className="text-zinc-500 text-center py-12">Loading…</div>}>
          <HomeClient billionaires={billionaires} units={units} />
        </Suspense>
      </div>
    </main>
  )
}

import { Suspense } from 'react'
import { HomeClient } from './HomeClient'
import type { BillionaireWithSnapshot, ComparisonUnit, WealthSnapshot } from '@/lib/database.types'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const supabase = createServiceClient()

    const [billionairesRes, unitsRes] = await Promise.all([
      supabase.from('billionaires').select('*'),
      supabase.from('comparison_units').select('*').eq('active', true).order('category').order('name'),
    ])

    const billionaires = (billionairesRes.data ?? []) as BillionaireWithSnapshot[]
    const units = (unitsRes.data ?? []) as ComparisonUnit[]

    if (billionaires.length > 0) {
      const { data: snapshotsRaw } = await supabase
        .from('wealth_snapshots')
        .select('*')
        .in('billionaire_id', billionaires.map(b => b.id))
        .order('date', { ascending: false })

      const snapshots = (snapshotsRaw ?? []) as WealthSnapshot[]
      const latestMap = new Map<string, WealthSnapshot>()
      for (const s of snapshots) {
        if (!latestMap.has(s.billionaire_id)) latestMap.set(s.billionaire_id, s)
      }

      for (const b of billionaires) {
        b.latestSnapshot = latestMap.get(b.id) ?? null
      }
    }

    return {
      billionaires: billionaires
        .filter(b => b.latestSnapshot)
        .sort((a, b) => a.latestSnapshot!.rank - b.latestSnapshot!.rank),
      units,
    }
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

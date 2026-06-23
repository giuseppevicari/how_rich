import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { Billionaire, WealthSnapshot } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: billionairesRaw, error: billError } = await supabase
      .from('billionaires')
      .select('*')

    if (billError) throw billError

    const billionaires = (billionairesRaw ?? []) as Billionaire[]

    const { data: snapshotsRaw, error: snapError } = await supabase
      .from('wealth_snapshots')
      .select('*')
      .in('billionaire_id', billionaires.map(b => b.id))
      .order('date', { ascending: false })

    if (snapError) throw snapError

    const snapshots = (snapshotsRaw ?? []) as WealthSnapshot[]

    const latestSnapshots = new Map<string, WealthSnapshot>()
    for (const snap of snapshots) {
      if (!latestSnapshots.has(snap.billionaire_id)) {
        latestSnapshots.set(snap.billionaire_id, snap)
      }
    }

    const result = billionaires
      .map(b => ({ ...b, latestSnapshot: latestSnapshots.get(b.id) ?? null }))
      .filter(b => b.latestSnapshot !== null)
      .sort((a, b) => a.latestSnapshot!.rank - b.latestSnapshot!.rank)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/billionaires]', err)
    return NextResponse.json({ error: 'Failed to fetch billionaires' }, { status: 500 })
  }
}

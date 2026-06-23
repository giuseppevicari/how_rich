import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { HomeClient } from '@/app/HomeClient'
import type { BillionaireWithSnapshot, ComparisonUnit, WealthSnapshot } from '@/lib/database.types'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getBillionaireBySlug(slug: string): Promise<BillionaireWithSnapshot | null> {
  try {
    const supabase = createServiceClient()

    const { data: raw } = await supabase
      .from('billionaires')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!raw) return null
    const b = raw as BillionaireWithSnapshot

    const { data: snapshotsRaw } = await supabase
      .from('wealth_snapshots')
      .select('*')
      .eq('billionaire_id', b.id)
      .order('date', { ascending: false })
      .limit(1)

    const snapshots = (snapshotsRaw ?? []) as WealthSnapshot[]
    b.latestSnapshot = snapshots[0] ?? null
    return b
  } catch {
    return null
  }
}

async function getAllData() {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const b = await getBillionaireBySlug(slug)
  if (!b) return { title: 'Not Found' }

  const netWorthB = b.latestSnapshot
    ? `$${(b.latestSnapshot.net_worth / 1_000_000_000).toFixed(0)}B`
    : ''

  return {
    title: `How Rich is ${b.name}? ${netWorthB} — How Rich?`,
    description: `${b.name} has a net worth of ${netWorthB}. See what that buys in real life — Big Macs, Lamborghinis, NASA budgets, and more.`,
    openGraph: {
      title: `How Rich is ${b.name}?`,
      description: `${b.name} has ${netWorthB}. Translate it into real-world scale.`,
      type: 'website',
      ...(b.image_url ? { images: [{ url: b.image_url, width: 440, height: 440 }] } : {}),
    },
  }
}

export default async function BillionairePage({ params }: Props) {
  const { slug } = await params
  const b = await getBillionaireBySlug(slug)
  if (!b) notFound()

  const { billionaires, units } = await getAllData()

  const preselected = billionaires.find(bl => bl.slug === slug) ?? b
  if (!billionaires.find(bl => bl.slug === slug) && b) {
    billionaires.unshift(b)
  }

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

        <HomeClient
          billionaires={billionaires}
          units={units}
          preselectedSlug={preselected.slug}
        />
      </div>
    </main>
  )
}

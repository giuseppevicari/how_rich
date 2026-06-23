import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { Billionaire } from '@/lib/database.types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const supabase = createServiceClient()

    const { data: billionaireData, error: billError } = await supabase
      .from('billionaires')
      .select('*')
      .eq('slug', slug)
      .single()

    if (billError || !billionaireData) {
      return NextResponse.json({ error: 'Billionaire not found' }, { status: 404 })
    }

    const billionaire = billionaireData as Billionaire

    const { data: snapshots, error: snapError } = await supabase
      .from('wealth_snapshots')
      .select('*')
      .eq('billionaire_id', billionaire.id)
      .order('date', { ascending: false })
      .limit(365)

    if (snapError) throw snapError

    return NextResponse.json({ ...billionaire, snapshots: snapshots ?? [] })
  } catch (err) {
    console.error(`[GET /api/billionaires/${slug}]`, err)
    return NextResponse.json({ error: 'Failed to fetch billionaire' }, { status: 500 })
  }
}

import { createServiceClient } from '../supabase'
import { fetchForbesBillionaires } from './forbes'
import type { ForbesBillionaire } from './forbes'

export interface IngestResult {
  success: boolean
  billionairesProcessed: number
  snapshotsInserted: number
  error?: string
}

export async function ingestForbesData(): Promise<IngestResult> {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: logRaw } = await supabase
    .from('refresh_logs')
    .insert({ started_at: new Date().toISOString(), status: 'partial' })
    .select()
    .single()
  const log = logRaw as { id: string } | null

  let billionaires: ForbesBillionaire[] = []
  try {
    billionaires = await fetchForbesBillionaires()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await supabase
      .from('refresh_logs')
      .update({ completed_at: new Date().toISOString(), status: 'failure', message })
      .eq('id', log?.id ?? '')
    return { success: false, billionairesProcessed: 0, snapshotsInserted: 0, error: message }
  }

  let snapshotsInserted = 0

  for (const person of billionaires) {
    const slug = person.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const { data: existingRaw } = await supabase
      .from('billionaires')
      .select('id')
      .eq('slug', slug)
      .single()

    const existing = existingRaw as { id: string } | null
    let billionaireId: string

    if (existing) {
      billionaireId = existing.id
      if (person.imageUrl) {
        await supabase
          .from('billionaires')
          .update({ image_url: person.imageUrl })
          .eq('id', billionaireId)
      }
    } else {
      const { data: createdRaw, error: createErr } = await supabase
        .from('billionaires')
        .insert({ name: person.name, slug, image_url: person.imageUrl })
        .select()
        .single()

      if (createErr || !createdRaw) continue
      const created = createdRaw as { id: string }
      billionaireId = created.id
    }

    const { error: snapErr } = await supabase
      .from('wealth_snapshots')
      .upsert(
        {
          billionaire_id: billionaireId,
          date: today,
          net_worth: person.netWorth,
          rank: person.rank,
          source: 'forbes',
        },
        { onConflict: 'billionaire_id,date' }
      )

    if (!snapErr) snapshotsInserted++
  }

  await supabase
    .from('refresh_logs')
    .update({
      completed_at: new Date().toISOString(),
      status: 'success',
      message: `Processed ${billionaires.length} billionaires, inserted ${snapshotsInserted} snapshots`,
    })
    .eq('id', log?.id ?? '')

  return {
    success: true,
    billionairesProcessed: billionaires.length,
    snapshotsInserted,
  }
}

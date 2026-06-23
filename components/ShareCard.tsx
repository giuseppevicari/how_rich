'use client'

import { useState } from 'react'
import { nativeShareCard } from '@/lib/share/generateCard'
import type { BillionaireWithSnapshot } from '@/lib/database.types'
import type { BuyPowerResult } from '@/lib/calculations/buyPower'

interface Props {
  billionaire: BillionaireWithSnapshot
  result: BuyPowerResult | null
}

const CARD_ID = 'share-card-target'

export function ShareCard({ billionaire, result }: Props) {
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    if (!result) return
    setSharing(true)
    try {
      await nativeShareCard(CARD_ID, {
        billionaireName: billionaire.name,
        unitName: result.unit.name,
        quantity: result.formattedQuantity,
        netWorth: result.netWorth,
      })
    } finally {
      setSharing(false)
    }
  }

  if (!result) return null

  return (
    <div className="space-y-3">
      <div
        id={CARD_ID}
        className="w-full p-6 bg-zinc-900 rounded-2xl border border-zinc-700"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">How Rich Is</div>
        <div className="text-2xl font-bold text-white mb-1">{billionaire.name}</div>
        <div className="text-4xl font-black font-mono text-amber-400 mb-1">
          {result.formattedQuantity}
        </div>
        <div className="text-lg text-zinc-300 mb-4">{result.unit.name}s</div>
        <div className="text-xs text-zinc-600">howrich.app</div>
      </div>

      <button
        onClick={handleShare}
        disabled={sharing}
        className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-sm transition-opacity disabled:opacity-60 hover:bg-amber-300"
      >
        {sharing ? 'Generating…' : 'Share Card'}
      </button>
    </div>
  )
}

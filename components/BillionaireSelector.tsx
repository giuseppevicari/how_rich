'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { BillionaireWithSnapshot } from '@/lib/database.types'

interface Props {
  billionaires: BillionaireWithSnapshot[]
  selectedId: string | null
  onSelect: (b: BillionaireWithSnapshot) => void
}

export function BillionaireSelector({ billionaires, selectedId, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
        Select a Billionaire
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {billionaires.map((b, i) => (
          <motion.button
            key={b.id}
            onClick={() => onSelect(b)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`
              relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-left
              ${selectedId === b.id
                ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10'
                : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800'
              }
            `}
          >
            <span className="absolute top-2 left-2 text-xs font-mono text-zinc-500">
              #{b.latestSnapshot?.rank}
            </span>
            <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 mt-3">
              {b.image_url ? (
                <Image
                  src={b.image_url}
                  alt={b.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-zinc-400">
                  {b.name[0]}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white leading-tight">{b.name}</p>
              <p className="text-xs text-amber-400 font-mono">
                ${formatBillions(b.latestSnapshot?.net_worth ?? 0)}B
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

function formatBillions(n: number): string {
  return (n / 1_000_000_000).toFixed(0)
}

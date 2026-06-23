'use client'

import { motion } from 'framer-motion'
import { calculateScaleLadder } from '@/lib/calculations/scaleLadder'
import type { ComparisonUnit } from '@/lib/database.types'

interface Props {
  netWorth: number
  unit: ComparisonUnit | null
}

const LAYER_COLORS = {
  object:   'border-green-500/40 bg-green-500/5',
  cluster:  'border-yellow-500/40 bg-yellow-500/5',
  macro:    'border-orange-500/40 bg-orange-500/5',
  abstract: 'border-red-500/40 bg-red-500/5',
}

const LAYER_LABELS = {
  object:   'Individual',
  cluster:  'Cluster',
  macro:    'Macro',
  abstract: 'Abstract',
}

export function ScaleLadder({ netWorth, unit }: Props) {
  if (!unit) {
    return (
      <p className="text-zinc-500 text-sm text-center py-8">
        Select a single comparison item above to see the scale ladder.
      </p>
    )
  }

  const result = calculateScaleLadder(netWorth, unit)

  if (result.totalQuantity === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-8">
        Net worth is less than the cost of one {unit.name}.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-500 mb-4">
        Total: <span className="text-amber-400 font-mono font-bold">
          {result.totalQuantity.toLocaleString()}
        </span> {unit.name}s
      </p>

      {result.rungs.map((rung, i) => (
        <motion.div
          key={rung.quantity}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`p-3 rounded-lg border ${LAYER_COLORS[rung.layer]}`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-white text-sm w-16 flex-shrink-0">
              {rung.label}
            </span>
            <span className="text-zinc-300 text-sm flex-1">{rung.description}</span>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600 flex-shrink-0">
              {LAYER_LABELS[rung.layer]}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

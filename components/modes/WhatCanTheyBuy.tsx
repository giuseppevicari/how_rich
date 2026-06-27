'use client'

import { motion } from 'framer-motion'
import { calculateBuyPower } from '@/lib/calculations/buyPower'
import type { ComparisonUnit } from '@/lib/database.types'

interface Props {
  netWorth: number
  unit: ComparisonUnit | null
}

export function WhatCanTheyBuy({ netWorth, unit }: Props) {
  if (!unit) {
    return (
      <p className="text-zinc-500 text-sm text-center py-8">
        Select a comparison item above.
      </p>
    )
  }

  const result = calculateBuyPower(netWorth, unit)

  return (
    <motion.div
      key={unit.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-6 bg-zinc-800/60 rounded-xl border border-zinc-700"
    >
      <div>
        <p className="text-lg font-semibold text-white">{unit.name}</p>
        <p className="text-sm text-zinc-500 mt-0.5">@ ${unit.value.toLocaleString()} each</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-black font-mono text-amber-400">
          {result.formattedQuantity}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{unit.category}</p>
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { calculateBuyPower } from '@/lib/calculations/buyPower'
import type { ComparisonUnit } from '@/lib/database.types'

interface Props {
  netWorth: number
  units: ComparisonUnit[]
}

export function WhatCanTheyBuy({ netWorth, units }: Props) {
  if (units.length === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-8">
        Select one or more comparison items above.
      </p>
    )
  }

  const results = units.map(u => calculateBuyPower(netWorth, u))

  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <motion.div
          key={r.unit.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center justify-between p-4 bg-zinc-800/60 rounded-xl border border-zinc-700"
        >
          <div>
            <p className="font-medium text-white">{r.unit.name}</p>
            <p className="text-xs text-zinc-500">@ ${r.unit.value.toLocaleString()} each</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-amber-400">
              {r.formattedQuantity}
            </p>
            <p className="text-xs text-zinc-500">{r.unit.category}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

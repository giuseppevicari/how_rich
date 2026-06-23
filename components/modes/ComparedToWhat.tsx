'use client'

import { motion } from 'framer-motion'
import { calculateBenchmark } from '@/lib/calculations/benchmarks'
import type { ComparisonUnit } from '@/lib/database.types'

interface Props {
  netWorth: number
  units: ComparisonUnit[]
}

export function ComparedToWhat({ netWorth, units }: Props) {
  if (units.length === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-8">
        Select benchmark items above.
      </p>
    )
  }

  const results = units.map(u => calculateBenchmark(netWorth, u))

  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <motion.div
          key={r.unit.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="p-4 bg-zinc-800/60 rounded-xl border border-zinc-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium text-white">{r.unit.name}</p>
              {r.unit.description && (
                <p className="text-xs text-zinc-500 mt-0.5">{r.unit.description}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-xl font-bold font-mono ${r.isGreaterThan ? 'text-amber-400' : 'text-blue-400'}`}>
                {r.formattedRatio}
              </p>
              <p className="text-xs text-zinc-500">
                {r.isGreaterThan ? 'larger' : 'smaller'}
              </p>
            </div>
          </div>

          <div className="mt-3 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(r.ratio * 100, 100)}%` }}
              transition={{ delay: i * 0.06 + 0.2, duration: 0.6 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

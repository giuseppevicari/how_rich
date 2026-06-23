'use client'

import { motion } from 'framer-motion'
import { calculateTimeBurn, SPEND_RATES } from '@/lib/calculations/timeBurn'

interface Props {
  netWorth: number
}

export function HowLongWouldItLast({ netWorth }: Props) {
  const results = SPEND_RATES.map(rate => calculateTimeBurn(netWorth, rate))

  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <motion.div
          key={r.spendRate.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center justify-between p-4 bg-zinc-800/60 rounded-xl border border-zinc-700"
        >
          <div>
            <p className="font-medium text-white">Spending {r.spendRate.label}</p>
            <p className="text-xs text-zinc-500">
              ${(r.spendRate.amountPerDay).toLocaleString()} / day
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold font-mono text-amber-400">
              {r.formattedDuration}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

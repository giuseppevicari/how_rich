'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ComparisonUnit, ComparisonCategory } from '@/lib/database.types'

interface Props {
  units: ComparisonUnit[]
  selectedId: string | null
  onSelect: (unit: ComparisonUnit) => void
}

const CATEGORY_LABELS: Record<ComparisonCategory, string> = {
  consumer: 'Consumer Goods',
  asset: 'Assets',
  benchmark: 'Benchmarks',
}

export function ComparisonUnitGrid({ units, selectedId, onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory | 'all'>('all')

  const categories = Array.from(new Set(units.map(u => u.category))) as ComparisonCategory[]

  const filtered = activeCategory === 'all'
    ? units
    : units.filter(u => u.category === activeCategory)

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
        Compare To
      </h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', ...categories] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-amber-400 text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map((unit, i) => {
          const isSelected = unit.id === selectedId
          return (
            <motion.button
              key={unit.id}
              onClick={() => onSelect(unit)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`
                p-3 rounded-lg border text-left transition-all
                ${isSelected
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-500'
                }
              `}
            >
              <p className="text-xs font-medium text-white truncate">{unit.name}</p>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {formatUSD(unit.value)}
              </p>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide">
                {unit.category}
              </span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(2)}`
}

'use client'

import type { ComparisonMode } from '@/lib/calculations'

interface Props {
  activeMode: ComparisonMode
  onChange: (mode: ComparisonMode) => void
}

const MODES: { id: ComparisonMode; label: string; description: string }[] = [
  { id: 'time', label: 'How Long Would It Last?', description: 'Time to deplete at daily spend rates' },
  { id: 'buy',  label: 'What Can They Buy?',      description: 'Purchasing power in real goods' },
]

export function ModeSelector({ activeMode, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-800/60 rounded-xl border border-zinc-700 flex-wrap">
      {MODES.map(m => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          title={m.description}
          className={`
            flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeMode === m.id
              ? 'bg-amber-400 text-black shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
            }
          `}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

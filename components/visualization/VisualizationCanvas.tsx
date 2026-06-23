'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComparisonUnit } from '@/lib/database.types'
import { getLODConfig, getAggregationFactor } from '@/lib/visualization/lodEngine'

interface Props {
  unit: ComparisonUnit | null
  quantity: number
}

const UNIT_EMOJI: Record<string, string> = {
  'big-mac':                '🍔',
  'iphone-16-pro':          '📱',
  'lamborghini-revuelto':   '🏎️',
  'starbucks-latte':        '☕',
  'netflix-subscription':   '🎦',
  'average-us-home':        '🏠',
  'private-jet-gulfstream': '✈️',
  'superyacht-90m':         '🚥',
  'boeing-737-max':         '✈️',
  'aircraft-carrier':       '⚓',
  'nasa-budget':            '🚀',
  'pentagon-budget':        '🏙️',
  'gdp-monaco':             '🇲🇨',
  'gdp-new-zealand':        '🇳🇿',
  'harvard-endowment':      '🎓',
  'rockefeller-fortune':    '💰',
}

export function VisualizationCanvas({ unit, quantity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lodLabel, setLodLabel] = useState<string>('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !unit || quantity === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const config = getLODConfig(quantity)
    const aggregation = getAggregationFactor(quantity, config)
    const visibleCount = Math.min(quantity, config.maxVisible)
    const emoji = UNIT_EMOJI[unit.slug] ?? '●'

    setLodLabel(config.level)

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)
    ctx.font = `${config.unitSize}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const cols = config.gridColumns
    const rows = Math.ceil(visibleCount / cols)
    const cellW = w / cols
    const cellH = Math.min(h / rows, cellW)

    const offsetY = (h - rows * cellH) / 2

    for (let i = 0; i < visibleCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = col * cellW + cellW / 2
      const y = offsetY + row * cellH + cellH / 2

      ctx.globalAlpha = aggregation > 1 ? 0.7 : 1
      ctx.fillText(emoji, x, y)

      if (aggregation > 1 && config.unitSize >= 12) {
        ctx.font = `${Math.max(8, config.unitSize * 0.5)}px monospace`
        ctx.globalAlpha = 0.5
        ctx.fillStyle = '#f59e0b'
        ctx.fillText(`×${aggregation.toLocaleString()}`, x, y + config.unitSize * 0.7)
        ctx.fillStyle = 'white'
        ctx.font = `${config.unitSize}px serif`
      }
    }
  }, [unit, quantity])

  if (!unit || quantity === 0) return null

  return (
    <div className="relative w-full bg-zinc-900/80 rounded-xl border border-zinc-700 overflow-hidden">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
          {lodLabel} view
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '280px' }}
      />
    </div>
  )
}

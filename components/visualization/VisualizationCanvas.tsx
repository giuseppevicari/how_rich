'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComparisonUnit } from '@/lib/database.types'

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
  'superyacht-90m':         '🛥️',
  'boeing-737-max':         '✈️',
  'aircraft-carrier':       '⚓',
  'nasa-budget':            '🚀',
  'pentagon-budget':        '🏙️',
  'gdp-monaco':             '🇲🇨',
  'gdp-new-zealand':        '🇳🇿',
  'harvard-endowment':      '🎓',
  'rockefeller-fortune':    '💰',
  'tonne-of-gold':          '🥇',
}

const MAX_CELL_PX = 48  // largest icon size
const MIN_CELL_PX = 3   // smallest visible dot (1px dot + gaps)
// if natural grid fits within this height, render every item individually
const MAX_NATURAL_H = 1200
// canvas height when switching to representational (1 dot = N items) mode
const REPR_H = 480

interface Layout {
  cols: number
  cellPx: number
  canvasH: number
  dotsToRender: number
  itemsPerDot: number
}

function computeLayout(W: number, quantity: number): Layout {
  // Natural near-square grid
  let cols = Math.max(1, Math.round(Math.sqrt(quantity)))
  let cellPx = W / cols

  // Clamp cell size to [MIN_CELL_PX, MAX_CELL_PX]
  if (cellPx > MAX_CELL_PX) {
    cols = Math.ceil(W / MAX_CELL_PX)
    cellPx = W / cols
  } else if (cellPx < MIN_CELL_PX) {
    cellPx = MIN_CELL_PX
    cols = Math.floor(W / cellPx)
    if (cols < 1) cols = 1
  }

  const rows = Math.ceil(quantity / cols)
  const neededH = rows * cellPx

  if (neededH <= MAX_NATURAL_H) {
    // Show every item individually
    return { cols, cellPx, canvasH: neededH, dotsToRender: quantity, itemsPerDot: 1 }
  }

  // Representational: fill REPR_H with dots, each dot = N items
  const reprRows = Math.floor(REPR_H / cellPx)
  const dotsToRender = Math.max(1, reprRows * cols)
  const itemsPerDot = Math.ceil(quantity / dotsToRender)
  return { cols, cellPx, canvasH: reprRows * cellPx, dotsToRender, itemsPerDot }
}

export function VisualizationCanvas({ unit, quantity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(800)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerW(Math.max(el.offsetWidth, 200))
    const ro = new ResizeObserver(entries => {
      setContainerW(Math.max(Math.round(entries[0].contentRect.width), 200))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = quantity > 0 && containerW > 0
    ? computeLayout(containerW, quantity)
    : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !unit || !layout || layout.dotsToRender === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { cols, cellPx, canvasH, dotsToRender } = layout
    const dpr = window.devicePixelRatio || 1
    const W = containerW

    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(canvasH * dpr)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W, canvasH)

    const emoji = UNIT_EMOJI[unit.slug] ?? '🔸'

    if (cellPx >= 14) {
      // Emoji icons
      const fontSize = Math.floor(cellPx * 0.72)
      ctx.font = `${fontSize}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = 0; i < dotsToRender; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.fillText(emoji, col * cellPx + cellPx / 2, row * cellPx + cellPx / 2)
      }
    } else {
      // Amber dot (circle) — always individual, never flood-fill
      const r = Math.max(0.8, cellPx * 0.38)
      ctx.fillStyle = '#f59e0b'
      for (let i = 0; i < dotsToRender; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.beginPath()
        ctx.arc(col * cellPx + cellPx / 2, row * cellPx + cellPx / 2, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [unit, quantity, layout, containerW])

  if (!unit || quantity === 0) return null

  const itemsPerDot = layout?.itemsPerDot ?? 1

  return (
    <div className="relative w-full bg-zinc-900/80 rounded-xl border border-zinc-700 overflow-hidden">
      {itemsPerDot > 1 && (
        <div className="absolute top-2 right-2 z-10 text-xs text-amber-400/80 bg-zinc-900/80 px-2 py-0.5 rounded">
          1 dot ≈ {itemsPerDot.toLocaleString()} {unit.name.toLowerCase()}
        </div>
      )}
      <div ref={containerRef} className="w-full">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ height: layout ? `${Math.round(layout.canvasH)}px` : '280px' }}
        />
      </div>
    </div>
  )
}

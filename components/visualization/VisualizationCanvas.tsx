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
}

const MAX_CELL_PX = 48
const MAX_CANVAS_H = 1200

interface Layout {
  cols: number
  cellPx: number
  canvasH: number
  visibleCount: number
  overflowCount: number
}

function computeLayout(W: number, quantity: number): Layout {
  let cols = Math.round(Math.sqrt(quantity))
  if (cols < 1) cols = 1
  let cellPx = W / cols

  if (cellPx > MAX_CELL_PX) {
    cols = Math.ceil(W / MAX_CELL_PX)
    cellPx = W / cols
  }

  if (cellPx < 1) {
    cols = Math.floor(W)
    cellPx = 1
  }

  const rows = Math.ceil(quantity / cols)
  const neededH = rows * cellPx
  const canvasH = Math.min(neededH, MAX_CANVAS_H)

  const visibleRows = Math.floor(canvasH / cellPx)
  const visibleCount = Math.min(quantity, visibleRows * cols)
  const overflowCount = quantity - visibleCount

  return { cols, cellPx, canvasH, visibleCount, overflowCount }
}

export function VisualizationCanvas({ unit, quantity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(800)
  const [overflowCount, setOverflowCount] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerW(el.offsetWidth || 800)
    const ro = new ResizeObserver(entries => {
      setContainerW(entries[0].contentRect.width || 800)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = quantity > 0 && containerW > 0
    ? computeLayout(containerW, quantity)
    : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !unit || !layout || quantity === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = containerW
    const { cols, cellPx, canvasH, visibleCount } = layout

    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(canvasH * dpr)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W, canvasH)

    setOverflowCount(layout.overflowCount)

    if (cellPx >= 14) {
      // Emoji rendering
      const fontSize = Math.floor(cellPx * 0.72)
      const emoji = UNIT_EMOJI[unit.slug] ?? '●'
      ctx.font = `${fontSize}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = 0; i < visibleCount; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.fillText(emoji, col * cellPx + cellPx / 2, row * cellPx + cellPx / 2)
      }
    } else if (cellPx >= 2) {
      // Amber dot rendering
      const r = Math.max(0.5, cellPx * 0.38)
      ctx.fillStyle = '#f59e0b'
      for (let i = 0; i < visibleCount; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.beginPath()
        ctx.arc(col * cellPx + cellPx / 2, row * cellPx + cellPx / 2, r, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      // 1-px fill — just flood the entire visible area
      const visibleRows = Math.floor(canvasH / cellPx)
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(0, 0, cols, visibleRows)
    }

    // Dim stripe for overflow rows
    if (layout.overflowCount > 0) {
      const visibleRows = Math.floor(canvasH / cellPx)
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)'
      ctx.fillRect(0, visibleRows * cellPx, W, canvasH - visibleRows * cellPx)
    }
  }, [unit, quantity, layout, containerW])

  if (!unit || quantity === 0) return null

  return (
    <div className="relative w-full bg-zinc-900/80 rounded-xl border border-zinc-700 overflow-hidden">
      {overflowCount > 0 && (
        <div className="absolute bottom-2 right-2 z-10 text-xs text-amber-400/80 bg-zinc-900/80 px-2 py-0.5 rounded">
          +{overflowCount.toLocaleString()} more
        </div>
      )}
      <div ref={containerRef} className="w-full">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ height: layout ? `${layout.canvasH}px` : '280px' }}
        />
      </div>
    </div>
  )
}

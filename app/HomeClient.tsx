'use client'

import { useState, useEffect } from 'react'
import { BillionaireSelector } from '@/components/BillionaireSelector'
import { ComparisonUnitGrid } from '@/components/ComparisonUnitGrid'
import { ModeSelector } from '@/components/ModeSelector'
import { WhatCanTheyBuy } from '@/components/modes/WhatCanTheyBuy'
import { HowLongWouldItLast } from '@/components/modes/HowLongWouldItLast'
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas'
import { ShareCard } from '@/components/ShareCard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { BillionaireSelectorSkeleton } from '@/components/Skeleton'
import { calculateBuyPower } from '@/lib/calculations/buyPower'
import type { BillionaireWithSnapshot, ComparisonUnit } from '@/lib/database.types'
import type { ComparisonMode } from '@/lib/calculations'

interface Props {
  billionaires: BillionaireWithSnapshot[]
  units: ComparisonUnit[]
  preselectedSlug?: string
}

export function HomeClient({ billionaires, units, preselectedSlug }: Props) {
  const [selectedBillionaire, setSelectedBillionaire] = useState<BillionaireWithSnapshot | null>(
    preselectedSlug
      ? (billionaires.find(b => b.slug === preselectedSlug) ?? billionaires[0] ?? null)
      : (billionaires[0] ?? null)
  )
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>(() => {
    const bigMac = units.find(u => u.slug === 'big-mac')
    return bigMac ? [bigMac.id] : []
  })
  const [mode, setMode] = useState<ComparisonMode>('time')

  // Auto-select Big Mac when switching to a billionaire with no units chosen
  useEffect(() => {
    if (selectedBillionaire && selectedUnitIds.length === 0) {
      const bigMac = units.find(u => u.slug === 'big-mac')
      if (bigMac) setSelectedUnitIds([bigMac.id])
    }
  }, [selectedBillionaire])

  const netWorth = selectedBillionaire?.latestSnapshot?.net_worth ?? 0
  const selectedUnits = units.filter(u => selectedUnitIds.includes(u.id))
  const primaryUnit = selectedUnits[0] ?? null

  const primaryBuyResult = primaryUnit && netWorth > 0
    ? calculateBuyPower(netWorth, primaryUnit)
    : null

  function toggleUnit(unit: ComparisonUnit) {
    setSelectedUnitIds(prev =>
      prev.includes(unit.id)
        ? prev.filter(id => id !== unit.id)
        : [...prev, unit.id]
    )
  }

  if (billionaires.length === 0) {
    return <BillionaireSelectorSkeleton />
  }

  return (
    <div className="space-y-10">
      <ErrorBoundary>
        <BillionaireSelector
          billionaires={billionaires}
          selectedId={selectedBillionaire?.id ?? null}
          onSelect={setSelectedBillionaire}
        />
      </ErrorBoundary>

      {selectedBillionaire && (
        <>
          <ModeSelector activeMode={mode} onChange={setMode} />

          <ErrorBoundary>
            <div className="space-y-6">
              {mode === 'time' && (
                <HowLongWouldItLast netWorth={netWorth} />
              )}
              {mode === 'buy' && (
                <>
                  <ErrorBoundary>
                    <ComparisonUnitGrid
                      units={units}
                      selectedIds={selectedUnitIds}
                      onToggle={toggleUnit}
                    />
                  </ErrorBoundary>
                  <WhatCanTheyBuy netWorth={netWorth} units={selectedUnits} />
                </>
              )}
            </div>
          </ErrorBoundary>

          {mode === 'buy' && primaryUnit && primaryBuyResult && (
            <ErrorBoundary>
              <VisualizationCanvas
                unit={primaryUnit}
                quantity={primaryBuyResult.quantity}
              />
            </ErrorBoundary>
          )}

          {mode === 'buy' && primaryBuyResult && (
            <ErrorBoundary>
              <ShareCard
                billionaire={selectedBillionaire}
                result={primaryBuyResult}
              />
            </ErrorBoundary>
          )}
        </>
      )}
    </div>
  )
}

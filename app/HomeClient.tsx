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
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(() => {
    const bigMac = units.find(u => u.slug === 'big-mac')
    return bigMac?.id ?? null
  })
  const [mode, setMode] = useState<ComparisonMode>('time')

  useEffect(() => {
    if (selectedBillionaire && !selectedUnitId) {
      const bigMac = units.find(u => u.slug === 'big-mac')
      if (bigMac) setSelectedUnitId(bigMac.id)
    }
  }, [selectedBillionaire])

  const netWorth = selectedBillionaire?.latestSnapshot?.net_worth ?? 0
  const selectedUnit = units.find(u => u.id === selectedUnitId) ?? null

  const primaryBuyResult = selectedUnit && netWorth > 0
    ? calculateBuyPower(netWorth, selectedUnit)
    : null

  function selectUnit(unit: ComparisonUnit) {
    setSelectedUnitId(prev => prev === unit.id ? null : unit.id)
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
                      selectedId={selectedUnitId}
                      onSelect={selectUnit}
                    />
                  </ErrorBoundary>
                  <WhatCanTheyBuy netWorth={netWorth} unit={selectedUnit} />
                </>
              )}
            </div>
          </ErrorBoundary>

          {mode === 'buy' && selectedUnit && primaryBuyResult && (
            <ErrorBoundary>
              <VisualizationCanvas
                unit={selectedUnit}
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

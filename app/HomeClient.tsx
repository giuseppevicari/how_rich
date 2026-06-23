'use client'

import { useState } from 'react'
import { BillionaireSelector } from '@/components/BillionaireSelector'
import { ComparisonUnitGrid } from '@/components/ComparisonUnitGrid'
import { ModeSelector } from '@/components/ModeSelector'
import { WhatCanTheyBuy } from '@/components/modes/WhatCanTheyBuy'
import { HowLongWouldItLast } from '@/components/modes/HowLongWouldItLast'
import { ComparedToWhat } from '@/components/modes/ComparedToWhat'
import { ScaleLadder } from '@/components/modes/ScaleLadder'
import { VisualizationCanvas } from '@/components/visualization/VisualizationCanvas'
import { ShareCard } from '@/components/ShareCard'
import { calculateBuyPower } from '@/lib/calculations/buyPower'
import type { BillionaireWithSnapshot, ComparisonUnit } from '@/lib/database.types'
import type { ComparisonMode } from '@/lib/calculations'

interface Props {
  billionaires: BillionaireWithSnapshot[]
  units: ComparisonUnit[]
}

export function HomeClient({ billionaires, units }: Props) {
  const [selectedBillionaire, setSelectedBillionaire] = useState<BillionaireWithSnapshot | null>(null)
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([])
  const [mode, setMode] = useState<ComparisonMode>('buy')

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

  return (
    <div className="space-y-10">
      <BillionaireSelector
        billionaires={billionaires}
        selectedId={selectedBillionaire?.id ?? null}
        onSelect={setSelectedBillionaire}
      />

      {selectedBillionaire && (
        <>
          <ComparisonUnitGrid
            units={units}
            selectedIds={selectedUnitIds}
            onToggle={toggleUnit}
          />

          <ModeSelector activeMode={mode} onChange={setMode} />

          <div className="space-y-6">
            {mode === 'buy' && (
              <WhatCanTheyBuy netWorth={netWorth} units={selectedUnits} />
            )}
            {mode === 'time' && (
              <HowLongWouldItLast netWorth={netWorth} />
            )}
            {mode === 'benchmark' && (
              <ComparedToWhat netWorth={netWorth} units={selectedUnits} />
            )}
            {mode === 'ladder' && (
              <ScaleLadder netWorth={netWorth} unit={primaryUnit} />
            )}
          </div>

          {primaryUnit && primaryBuyResult && (
            <VisualizationCanvas
              unit={primaryUnit}
              quantity={primaryBuyResult.quantity}
            />
          )}

          {primaryBuyResult && (
            <ShareCard
              billionaire={selectedBillionaire}
              result={primaryBuyResult}
            />
          )}
        </>
      )}
    </div>
  )
}

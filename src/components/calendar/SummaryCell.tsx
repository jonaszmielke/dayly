'use client'

import { useState } from 'react'
import { GridCell } from '@/lib/dates'
import { pickHeat, pickFg, HEAT_PALETTE } from '@/lib/heat'
import { HoverTip } from './HoverTip'
import { cn } from '@/lib/utils'

interface Person {
    id: number
    name: string
    availSet: Set<string>
}

interface SummaryCellProps {
    cell: GridCell
    inRange: boolean
    people: Person[]
    selectedPersonId: number | null
}

function isWeekend(iso: string): boolean {
    const d = new Date(iso + 'T00:00:00')
    const dow = d.getDay()
    return dow === 0 || dow === 6
}

export function SummaryCell({ cell, inRange, people, selectedPersonId }: SummaryCellProps) {
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)

    if (!inRange || !cell.inMonth) {
        return (
            <div
                className={cn(
                    'relative flex items-start justify-start p-1',
                    'bg-hatch opacity-40',
                )}
                style={{ height: '100%' }}
            >
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )
    }

    const freeCount = people.filter((p) => p.availSet.has(cell.date)).length
    const total = people.length
    const ratio = total > 0 ? freeCount / total : 0
    const prominent = ratio >= 0.8 && freeCount > 0
    const weekend = isWeekend(cell.date)

    const selectedAvail =
        selectedPersonId !== null
            ? people.find((p) => p.id === selectedPersonId)?.availSet.has(cell.date) ?? false
            : null

    const heat =
        selectedPersonId !== null
            ? selectedAvail
                ? HEAT_PALETTE[4]
                : HEAT_PALETTE[0]
            : pickHeat(freeCount, total)
    const fg = pickFg(heat)

    const tipPeople = people.map((p) => ({
        name: p.name,
        available: p.availSet.has(cell.date),
    }))

    return (
        <>
            <div
                className="relative flex flex-col justify-between p-1.5 cursor-default transition-all"
                style={{
                    height: '100%',
                    backgroundColor: heat,
                    color: fg,
                    boxShadow: hoverPos ? `inset 0 0 0 3px #161514` : undefined,
                }}
                onMouseEnter={(e) => setHoverPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHoverPos(null)}
            >
                {/* Weekend diagonal hatch overlay */}
                {weekend && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg,#161514,#161514 1px,transparent 1px,transparent 6px)',
                        }}
                    />
                )}

                {/* Day of month */}
                <span className="font-mono text-[12px] opacity-85 relative z-10">
                    {cell.dom}
                </span>

                {/* Count / person mark */}
                <div className="flex justify-end relative z-10">
                    {selectedPersonId !== null ? (
                        selectedAvail ? (
                            <span className="font-sans text-[28px] font-extrabold leading-none">
                                ✓
                            </span>
                        ) : null
                    ) : freeCount > 0 ? (
                        prominent ? (
                            <div className="flex items-baseline gap-0.5">
                                <span
                                    className="font-sans font-extrabold leading-none tracking-[-0.04em]"
                                    style={{ fontSize: '26px' }}
                                >
                                    {freeCount}
                                </span>
                                <span className="font-mono text-[11px] opacity-60">
                                    /{total}
                                </span>
                            </div>
                        ) : (
                            <span className="font-mono text-[11px] opacity-50">
                                {freeCount}/{total}
                            </span>
                        )
                    ) : null}
                </div>
            </div>

            {hoverPos && (
                <HoverTip
                    iso={cell.date}
                    people={tipPeople}
                    freeCount={freeCount}
                    totalCount={total}
                    anchorEl={null}
                    initialMouseX={hoverPos.x}
                    initialMouseY={hoverPos.y}
                />
            )}
        </>
    )
}

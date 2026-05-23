'use client'

import { HoverTip } from './HoverTip'
import { GridCell } from '@/lib/dates'
import { HEAT_PALETTE, pickFg, pickHeat } from '@/lib/heat'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type Person = {
    id: number
    name: string
    availSet: Set<string>
}

type SummaryCellProps = {
    cell: GridCell
    inRange: boolean
    people: Person[]
    selectedPersonId: number | null
    isHovered: boolean
    isSelected?: boolean
    hideTotal?: boolean
    isTouch: boolean
    onMouseEnter: (iso: string) => void
    onMouseLeave: () => void
    onTap?: (iso: string) => void
}

export const SummaryCell = ({
    cell,
    inRange,
    people,
    selectedPersonId,
    isHovered,
    isSelected,
    hideTotal,
    isTouch,
    onMouseEnter,
    onMouseLeave,
    onTap,
}: SummaryCellProps) => {
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)

    if (!inRange) {
        return (
            <div
                className={cn('relative flex items-start justify-start p-1', 'bg-hatch opacity-40')}
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

    const selectedAvail =
        selectedPersonId !== null
            ? (people.find((p) => p.id === selectedPersonId)?.availSet.has(cell.date) ?? false)
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
                className="relative flex flex-col justify-between p-1.5 cursor-pointer transition-all"
                style={{
                    height: '100%',
                    backgroundColor: heat,
                    color: fg,
                    boxShadow: isSelected
                        ? 'inset 0 0 0 2.5px #161514'
                        : isHovered
                          ? 'inset 0 0 0 3px #161514'
                          : undefined,
                }}
                onPointerEnter={(e) => {
                    if (!isTouch && e.pointerType === 'mouse') {
                        setHoverPos({ x: e.clientX, y: e.clientY })
                        onMouseEnter(cell.date)
                    }
                }}
                onPointerLeave={(e) => {
                    if (!isTouch && e.pointerType === 'mouse') {
                        setHoverPos(null)
                        onMouseLeave()
                    }
                }}
                onClick={() => {
                    if (isTouch) onTap?.(cell.date)
                }}
            >
                {/* Day of month */}
                <span className="font-mono text-[12px] opacity-85 relative z-10">{cell.dom}</span>

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
                                {!hideTotal && (
                                    <span className="font-mono text-[11px] opacity-60">
                                        /{total}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="font-mono text-[11px] opacity-50">
                                {hideTotal ? freeCount : `${freeCount}/${total}`}
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

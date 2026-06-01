'use client'

import { HoverTip } from './HoverTip'
import { formatDateMedium, formatHour, slotKey } from '@/lib/dates'
import { HEAT_PALETTE, pickFg, pickHeat } from '@/lib/heat'
import { useState } from 'react'

type Person = {
    id: number
    name: string
    availSet: Set<string>
}

type SummaryHourCellProps = {
    date: string
    hour: number
    inRange: boolean
    people: Person[]
    selectedPersonId: number | null
    isHovered: boolean
    isSelected?: boolean
    hideTotal?: boolean
    isTouch: boolean
    onMouseEnter: (key: string) => void
    onMouseLeave: () => void
    onTap?: (key: string) => void
}

export const SummaryHourCell = ({
    date,
    hour,
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
}: SummaryHourCellProps) => {
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)

    if (!inRange) {
        return <div className="bg-hatch opacity-40 w-full h-full" />
    }

    const key = slotKey(date, hour)
    const freeCount = people.filter((p) => p.availSet.has(key)).length
    const total = people.length
    const ratio = total > 0 ? freeCount / total : 0
    const prominent = ratio >= 0.8 && freeCount > 0

    const selectedAvail =
        selectedPersonId !== null
            ? (people.find((p) => p.id === selectedPersonId)?.availSet.has(key) ?? false)
            : null

    const heat =
        selectedPersonId !== null
            ? selectedAvail
                ? HEAT_PALETTE[4]
                : HEAT_PALETTE[0]
            : pickHeat(freeCount, total)
    const fg = pickFg(heat)

    const tipPeople = people.map((p) => ({ name: p.name, available: p.availSet.has(key) }))
    const heading = `${formatDateMedium(date)} · ${formatHour(hour)}`

    return (
        <>
            <div
                className="relative flex items-center justify-center w-full h-full cursor-pointer transition-all"
                style={{
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
                        onMouseEnter(key)
                    }
                }}
                onPointerLeave={(e) => {
                    if (!isTouch && e.pointerType === 'mouse') {
                        setHoverPos(null)
                        onMouseLeave()
                    }
                }}
                onClick={() => {
                    if (isTouch) onTap?.(key)
                }}
            >
                {selectedPersonId !== null ? (
                    selectedAvail ? (
                        <span className="font-sans text-[18px] font-extrabold leading-none">✓</span>
                    ) : null
                ) : freeCount > 0 ? (
                    prominent ? (
                        <div className="flex items-baseline gap-0.5">
                            <span className="font-sans font-extrabold leading-none tracking-[-0.04em] text-[18px]">
                                {freeCount}
                            </span>
                            {!hideTotal && (
                                <span className="font-mono text-[10px] opacity-60">/{total}</span>
                            )}
                        </div>
                    ) : (
                        <span className="font-mono text-[11px] opacity-60">
                            {hideTotal ? freeCount : `${freeCount}/${total}`}
                        </span>
                    )
                ) : null}
            </div>

            {hoverPos && (
                <HoverTip
                    iso={key}
                    heading={heading}
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

'use client'

import { HoverTip } from './HoverTip'
import { SummaryCellCount } from './SummaryCellCount'
import {
    getOutlineShadow,
    getSlotAriaLabel,
    getSlotStats,
    getTipPeople,
    type SummaryPerson,
} from './summarySlot'
import { useSummaryCellInteraction } from './useSummaryCellInteraction'
import { formatDateMedium } from '@/lib/dates'
import { formatHour, slotKey } from '@/lib/slots'

type SummaryHourCellProps = {
    date: string
    hour: number
    inRange: boolean
    people: SummaryPerson[]
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
    isSelected = false,
    hideTotal,
    isTouch,
    onMouseEnter,
    onMouseLeave,
    onTap,
}: SummaryHourCellProps) => {
    const key = slotKey(date, hour)
    const { hoverPos, onPointerEnter, onPointerLeave, onClick } = useSummaryCellInteraction({
        key,
        isTouch,
        onMouseEnter,
        onMouseLeave,
        onTap,
    })

    if (!inRange) {
        return <div className="bg-hatch opacity-40 w-full h-full" />
    }

    const stats = getSlotStats(people, key, selectedPersonId)
    const heading = `${formatDateMedium(date)} · ${formatHour(hour)}`

    return (
        <>
            <button
                type="button"
                aria-label={getSlotAriaLabel(heading, stats)}
                aria-pressed={isSelected}
                className="relative flex items-center justify-center w-full h-full cursor-pointer transition-[background-color,color,box-shadow]"
                style={{
                    backgroundColor: stats.heat,
                    color: stats.fg,
                    boxShadow: getOutlineShadow(isSelected, isHovered),
                }}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onClick={onClick}
            >
                <SummaryCellCount size="hour" stats={stats} hideTotal={hideTotal} />
            </button>

            <HoverTip
                iso={key}
                heading={heading}
                people={getTipPeople(people, key)}
                freeCount={stats.freeCount}
                totalCount={stats.total}
                hoverPos={hoverPos}
            />
        </>
    )
}

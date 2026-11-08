'use client'

import { HoverTip } from '../HoverTip'
import { SummaryCellCount } from './SummaryCellCount'
import {
    getOutlineShadow,
    getSlotAriaLabel,
    getSlotStats,
    getTipPeople,
    type SummaryPerson,
} from './summarySlot'
import { useSummaryCellInteraction } from './useSummaryCellInteraction'
import { formatDateLong, type GridCell } from '@/lib/dates'

type SummaryCellProps = {
    cell: GridCell
    inRange: boolean
    people: SummaryPerson[]
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
    isSelected = false,
    hideTotal,
    isTouch,
    onMouseEnter,
    onMouseLeave,
    onTap,
}: SummaryCellProps) => {
    const { hoverPos, onPointerEnter, onPointerLeave, onClick } = useSummaryCellInteraction({
        key: cell.date,
        isTouch,
        onMouseEnter,
        onMouseLeave,
        onTap,
    })

    if (!inRange) {
        return (
            <div className="relative flex items-start justify-start p-1 h-full bg-hatch opacity-40">
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )
    }

    const stats = getSlotStats(people, cell.date, selectedPersonId)

    return (
        <>
            <button
                type="button"
                aria-label={getSlotAriaLabel(formatDateLong(cell.date), stats)}
                aria-pressed={isSelected}
                className="relative flex flex-col justify-between p-1.5 w-full h-full text-left cursor-pointer transition-all"
                style={{
                    backgroundColor: stats.heat,
                    color: stats.fg,
                    boxShadow: getOutlineShadow(isSelected, isHovered),
                }}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onClick={onClick}
            >
                {/* Day of month */}
                <span className="font-mono text-[12px] opacity-85 relative z-10">{cell.dom}</span>

                {/* Count / person mark */}
                <div className="flex justify-end relative z-10">
                    <SummaryCellCount size="day" stats={stats} hideTotal={hideTotal} />
                </div>
            </button>

            <HoverTip
                iso={cell.date}
                people={getTipPeople(people, cell.date)}
                freeCount={stats.freeCount}
                totalCount={stats.total}
                hoverPos={hoverPos}
            />
        </>
    )
}

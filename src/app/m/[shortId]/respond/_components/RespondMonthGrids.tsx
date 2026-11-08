import { MonthGrid } from '@/components/calendar/MonthGrid'
import { RespondCell } from '@/components/calendar/RespondCell'
import type { ComponentProps } from 'react'

type RespondMonthGridsProps = {
    displayMonths: { year: number; month: number }[]
    rangeStart: string
    rangeEnd: string
    selected: Set<string>
    hoveredDate: string | null
} & Pick<ComponentProps<typeof RespondCell>, 'onPointerDown' | 'onPointerEnter' | 'onPointerLeave'>

export const RespondMonthGrids = ({
    displayMonths,
    rangeStart,
    rangeEnd,
    selected,
    hoveredDate,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
}: RespondMonthGridsProps) =>
    displayMonths.map(({ year, month }) => (
        <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            cellAspectClassName="aspect-square lg:aspect-[140/100]"
            cellRenderer={({ cell, inRange }) => (
                <RespondCell
                    cell={cell}
                    inRange={inRange}
                    selected={selected.has(cell.date)}
                    isHovered={hoveredDate === cell.date}
                    onPointerDown={onPointerDown}
                    onPointerEnter={onPointerEnter}
                    onPointerLeave={onPointerLeave}
                />
            )}
        />
    ))

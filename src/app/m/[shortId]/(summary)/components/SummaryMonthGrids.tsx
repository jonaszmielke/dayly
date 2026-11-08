import { SummaryCell } from './cells/SummaryCell'
import { type SummaryCellsState } from './summaryCells'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { calcDaysInRange } from '@/lib/calendar'

type SummaryMonthGridsProps = {
    displayMonths: { year: number; month: number }[]
    rangeStart: string
    rangeEnd: string
    /** Mobile layout: square cells, counts without the total. */
    compact: boolean
    cells: SummaryCellsState
}

export const SummaryMonthGrids = ({
    displayMonths,
    rangeStart,
    rangeEnd,
    compact,
    cells,
}: SummaryMonthGridsProps) =>
    displayMonths.map(({ year, month }) => (
        <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            daysInRange={calcDaysInRange(year, month, rangeStart, rangeEnd)}
            cellAspectClassName={compact ? 'aspect-square' : 'aspect-[140/100]'}
            cellRenderer={({ cell, inRange }) => (
                <SummaryCell
                    cell={cell}
                    inRange={inRange}
                    people={cells.people}
                    selectedPersonId={cells.selectedPersonId}
                    isHovered={cells.hoveredKey === cell.date}
                    isSelected={cells.selectedKey === cell.date}
                    hideTotal={compact}
                    isTouch={cells.isTouch}
                    onMouseEnter={cells.onCellEnter}
                    onMouseLeave={cells.onCellLeave}
                    onTap={cells.onCellTap}
                />
            )}
        />
    ))

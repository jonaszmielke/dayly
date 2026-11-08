import { type SummaryCellsState } from './summaryCells'
import { SummaryHourGrids } from './SummaryHourGrids'
import { SummaryMonthGrids } from './SummaryMonthGrids'
import { HourGridSkeleton } from '@/components/calendar/HourGridSkeleton'
import { MonthGridSkeleton } from '@/components/calendar/MonthGridSkeleton'
import { type WeekCell } from '@/lib/calendar'

type SummaryCalendarProps = {
    isHours: boolean
    isLoading: boolean
    /** Mobile layout: square cells, no hover outline, counts without the total. */
    compact: boolean
    rangeStart: string
    rangeEnd: string
    displayMonths: { year: number; month: number }[]
    weeks: WeekCell[][]
    hours: number[]
    cells: SummaryCellsState
}

/** The heatmap: month grids (day mode) or week grids (hour mode), or their skeletons while loading. */
export const SummaryCalendar = ({
    isHours,
    isLoading,
    compact,
    rangeStart,
    rangeEnd,
    displayMonths,
    weeks,
    hours,
    cells,
}: SummaryCalendarProps) => {
    if (isLoading && isHours)
        return weeks.map((week) => (
            <HourGridSkeleton key={week[0].date} week={week} hours={hours} />
        ))

    if (isLoading)
        return displayMonths.map(({ year, month }) => (
            <MonthGridSkeleton
                key={`${year}-${month}`}
                year={year}
                month={month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                cellAspectClassName="aspect-square lg:aspect-[140/100]"
            />
        ))

    // Touch-sized cells on mobile don't get the hover outline.
    const cellsForLayout = compact ? { ...cells, hoveredKey: null } : cells

    if (isHours)
        return (
            <SummaryHourGrids
                weeks={weeks}
                hours={hours}
                compact={compact}
                cells={cellsForLayout}
            />
        )

    return (
        <SummaryMonthGrids
            displayMonths={displayMonths}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            compact={compact}
            cells={cellsForLayout}
        />
    )
}

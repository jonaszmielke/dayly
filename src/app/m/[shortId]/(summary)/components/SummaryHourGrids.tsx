import { SummaryHourCell } from './cells/SummaryHourCell'
import { type SummaryCellsState } from './summaryCells'
import { HourGrid } from '@/components/calendar/HourGrid'
import { type WeekCell } from '@/lib/calendar'
import { slotKey } from '@/lib/slots'

type SummaryHourGridsProps = {
    weeks: WeekCell[][]
    hours: number[]
    /** Mobile layout: counts without the total. */
    compact: boolean
    cells: SummaryCellsState
}

export const SummaryHourGrids = ({ weeks, hours, compact, cells }: SummaryHourGridsProps) =>
    weeks.map((week) => (
        <HourGrid
            key={week[0].date}
            week={week}
            hours={hours}
            cellRenderer={({ date, hour, inRange }) => (
                <SummaryHourCell
                    date={date}
                    hour={hour}
                    inRange={inRange}
                    people={cells.people}
                    selectedPersonId={cells.selectedPersonId}
                    isHovered={cells.hoveredKey === slotKey(date, hour)}
                    isSelected={cells.selectedKey === slotKey(date, hour)}
                    hideTotal={compact}
                    isTouch={cells.isTouch}
                    onMouseEnter={cells.onCellEnter}
                    onMouseLeave={cells.onCellLeave}
                    onTap={cells.onCellTap}
                />
            )}
        />
    ))

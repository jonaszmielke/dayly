import { cn } from '@/lib/utils'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const COLUMNS = WEEKDAYS.length
const ROWS = 5
const CELL_IDS = Array.from({ length: COLUMNS * ROWS }, (_, i) => i)

const isLastColumn = (index: number) => index % COLUMNS === COLUMNS - 1
const isLastRow = (index: number) => index >= COLUMNS * (ROWS - 1)

export const MockCalendarGrid = () => (
    <>
        <MockWeekdays />
        <MockDayCells />
    </>
)

const MockWeekdays = () => (
    <div className="grid grid-cols-7 bg-paper border-b-2 border-ink">
        {WEEKDAYS.map((day, index) => (
            <div
                key={day}
                className={cn(
                    'px-1 lg:px-[10px] py-[7px] font-sans text-[9px] lg:text-[10.5px] font-semibold uppercase tracking-[0.08em] lg:tracking-[0.14em] text-ink/55',
                    !isLastColumn(index) && 'border-r-[1.5px] border-ink'
                )}
            >
                {day.slice(0, 1)}
                <span className="hidden lg:inline">{day.slice(1)}</span>
            </div>
        ))}
    </div>
)

const MockDayCells = () => (
    <div className="grid grid-cols-7 relative">
        {CELL_IDS.map((cellId) => (
            <div
                key={cellId}
                className={cn(
                    'bg-hatch h-[44px] lg:h-[74px] px-[6px] lg:px-[9px] py-[5px] lg:py-[7px] relative',
                    !isLastColumn(cellId) && 'border-r-[1.5px] border-ink',
                    !isLastRow(cellId) && 'border-b-[1.5px] border-ink'
                )}
            >
                <span className="font-mono text-[9px] lg:text-[11px] font-medium text-ink/30">
                    ·
                </span>
            </div>
        ))}
    </div>
)

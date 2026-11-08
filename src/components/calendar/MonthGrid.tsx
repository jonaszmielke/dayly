import { type GridCell, monthGrid } from '@/lib/calendar'
import { DOW_ABBREVIATIONS, monthName } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

const DEFAULT_CELL_ASPECT = 'aspect-[140/100]'

export type MonthGridDay = {
    cell: GridCell
    inRange: boolean
}

type MonthGridProps = {
    year: number
    month: number
    rangeStart: string
    rangeEnd: string
    cellRenderer: (day: MonthGridDay) => ReactNode
    daysInRange?: number
    className?: string
    cellAspectClassName?: string
    /** Hide from screen readers, e.g. for loading skeletons. */
    ariaHidden?: boolean
}

export const MonthGrid = ({
    year,
    month,
    rangeStart,
    rangeEnd,
    cellRenderer,
    daysInRange,
    className,
    cellAspectClassName,
    ariaHidden,
}: MonthGridProps) => (
    <MonthGridFrame
        className={className}
        ariaHidden={ariaHidden}
        header={
            <>
                <MonthTitle month={month} year={year} />
                <DaysInRangeLabel daysInRange={daysInRange} />
            </>
        }
    >
        {monthGrid(year, month).map((cell) => (
            <MonthGridCell key={cell.date} cellAspectClassName={cellAspectClassName}>
                {cellRenderer({ cell, inRange: cell.date >= rangeStart && cell.date <= rangeEnd })}
            </MonthGridCell>
        ))}
    </MonthGridFrame>
)

type MonthGridFrameProps = {
    header: ReactNode
    children: ReactNode
    className?: string
    ariaHidden?: boolean
}

/** Card, header bar and weekday row of a month grid; `children` are the day cells. */
export const MonthGridFrame = ({
    header,
    children,
    className,
    ariaHidden,
}: MonthGridFrameProps) => (
    <div className={cn('bg-white border-brutal shadow-brutal', className)} aria-hidden={ariaHidden}>
        <div className="flex items-baseline justify-between px-3 py-3 lg:px-5 lg:py-4 border-b-2 border-ink">
            {header}
        </div>

        <div className="grid grid-cols-7 bg-paper border-b-[1.5px] border-ink">
            {DOW_ABBREVIATIONS.map((day, i) => (
                <div
                    key={day}
                    className={cn(
                        'py-1.5 lg:py-2 text-center font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.04em] lg:tracking-[0.08em] text-ink/55 border-r-[1.5px] border-ink last:border-r-0',
                        i >= 5 && 'bg-paper-shade'
                    )}
                >
                    {day.slice(0, 1)}
                    <span className="hidden lg:inline">{day.slice(1)}</span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7">{children}</div>
    </div>
)

type MonthGridCellProps = {
    cellAspectClassName?: string
    children: ReactNode
}

/** Bordered slot for one day; the last column and row drop their outer borders. */
export const MonthGridCell = ({
    cellAspectClassName = DEFAULT_CELL_ASPECT,
    children,
}: MonthGridCellProps) => (
    <div
        className={cn(
            'border-r-[1.5px] border-b-[1.5px] border-ink nth-[7n]:border-r-0 nth-last-[-n+7]:border-b-0',
            cellAspectClassName
        )}
    >
        {children}
    </div>
)

const MonthTitle = ({ month, year }: { month: number; year: number }) => (
    <div className="flex items-baseline gap-2">
        <span className="font-sans text-[26px] lg:text-[36px] font-extrabold leading-none tracking-[-0.03em]">
            {monthName(month)}
        </span>
        <span className="font-mono text-[14px] lg:text-[18px] text-ink/55 leading-none">
            {year}
        </span>
    </div>
)

const DaysInRangeLabel = ({ daysInRange }: { daysInRange?: number }) => {
    if (daysInRange === undefined) return null

    return (
        <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-widest text-ink/55">
            {daysInRange} DAYS
        </span>
    )
}

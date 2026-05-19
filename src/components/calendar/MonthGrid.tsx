import { ReactNode } from 'react'
import { GridCell, monthGrid, monthName, DOW_ABBR } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface MonthGridProps {
    year: number
    month: number
    rangeStart: string
    rangeEnd: string
    cellRenderer: (cell: GridCell, inRange: boolean) => ReactNode
    daysInRange?: number
    className?: string
}

export function MonthGrid({
    year,
    month,
    rangeStart,
    rangeEnd,
    cellRenderer,
    daysInRange,
    className,
}: MonthGridProps) {
    const cells = monthGrid(year, month)

    return (
        <div className={cn('bg-white border-brutal shadow-brutal', className)}>
            {/* Month head */}
            <div className="flex items-baseline justify-between px-5 py-4 border-b-2 border-ink">
                <div className="flex items-baseline gap-2">
                    <span className="font-sans text-[36px] font-extrabold leading-none tracking-[-0.03em]">
                        {monthName(month)}
                    </span>
                    <span className="font-mono text-[18px] text-ink/55 leading-none">
                        {year}
                    </span>
                </div>
                {daysInRange !== undefined && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/55">
                        {daysInRange} DAYS IN RANGE
                    </span>
                )}
            </div>

            {/* DOW header */}
            <div className="grid grid-cols-7 bg-paper">
                {DOW_ABBR.map((d, i) => (
                    <div
                        key={d}
                        className={cn(
                            'py-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55',
                            i >= 5 && 'bg-paper-shade',
                        )}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Cell grid */}
            <div className="grid grid-cols-7">
                {cells.map((cell) => {
                    const inRange = cell.date >= rangeStart && cell.date <= rangeEnd
                    return (
                        <div key={cell.date} className="border-r border-b border-ink/10 last:border-r-0">
                            {cellRenderer(cell, inRange)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

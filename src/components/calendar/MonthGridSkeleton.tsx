import { calcDaysInRange, DOW_ABBREVIATIONS, monthGrid, monthName } from '@/lib/dates'
import { cn } from '@/lib/utils'

type MonthGridSkeletonProps = {
    year: number
    month: number
    rangeStart: string
    rangeEnd: string
    className?: string
    cellAspectClassName?: string
}

export const MonthGridSkeleton = ({
    year,
    month,
    rangeStart,
    rangeEnd,
    className,
    cellAspectClassName = 'aspect-[140/100]',
}: MonthGridSkeletonProps) => {
    const cells = monthGrid(year, month)
    const daysInRange = calcDaysInRange(year, month, rangeStart, rangeEnd)

    return (
        <div
            className={cn('bg-white border-brutal shadow-brutal', className)}
            aria-hidden="true"
        >
            {/* Month head */}
            <div className="flex items-baseline justify-between px-3 py-3 lg:px-5 lg:py-4 border-b-2 border-ink">
                <div className="flex items-baseline gap-2">
                    <span className="font-sans text-[26px] lg:text-[36px] font-extrabold leading-none tracking-[-0.03em]">
                        {monthName(month)}
                    </span>
                    <span className="font-mono text-[14px] lg:text-[18px] text-ink/55 leading-none">
                        {year}
                    </span>
                </div>
                <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-widest text-ink/55">
                    {daysInRange} DAYS
                </span>
            </div>

            {/* DOW header */}
            <div className="grid grid-cols-7 bg-paper border-b-[1.5px] border-ink">
                {DOW_ABBREVIATIONS.map((d, i) => (
                    <div
                        key={d}
                        className={cn(
                            'py-1.5 lg:py-2 text-center font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.04em] lg:tracking-[0.08em] text-ink/55 border-r-[1.5px] border-ink last:border-r-0',
                            i >= 5 && 'bg-paper-shade'
                        )}
                    >
                        {d.slice(0, 1)}
                        <span className="hidden lg:inline">{d.slice(1)}</span>
                    </div>
                ))}
            </div>

            {/* Cell grid */}
            <div className="grid grid-cols-7">
                {cells.map((cell) => {
                    const inRange = cell.date >= rangeStart && cell.date <= rangeEnd
                    return (
                        <div
                            key={cell.date}
                            className={cn(
                                'border-r-[1.5px] border-b-[1.5px] border-ink nth-[7n]:border-r-0 nth-last-[-n+7]:border-b-0',
                                cellAspectClassName
                            )}
                        >
                            {inRange ? (
                                <div className="flex h-full flex-col justify-between p-1.5">
                                    <span className="font-mono text-[12px] text-ink/30">
                                        {cell.dom}
                                    </span>
                                    <div className="h-3 w-6 self-end bg-mocha-light animate-pulse" />
                                </div>
                            ) : (
                                <div className="relative h-full bg-hatch opacity-40 p-1">
                                    <span className="font-mono text-[12px] text-ink/35">
                                        {cell.dom}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

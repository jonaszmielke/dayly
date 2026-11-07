import { calcDaysInRange, DOW_ABBREVIATIONS, GridCell, monthGrid, monthName } from '@/lib/dates'
import { cn } from '@/lib/utils'

// Every month fits in at most 6 week rows, so without a date the skeleton renders the full 6×7.
const UNDATED_CELL_COUNT = 6 * 7

type MonthGridSkeletonProps = {
    year?: number
    month?: number
    rangeStart?: string
    rangeEnd?: string
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
    const cells = year !== undefined && month !== undefined ? monthGrid(year, month) : undefined
    const daysInRange =
        year !== undefined &&
        month !== undefined &&
        rangeStart !== undefined &&
        rangeEnd !== undefined
            ? calcDaysInRange(year, month, rangeStart, rangeEnd)
            : undefined

    return (
        <div className={cn('bg-white border-brutal shadow-brutal', className)} aria-hidden="true">
            {/* Month head */}
            <div className="flex items-baseline justify-between px-3 py-3 lg:px-5 lg:py-4 border-b-2 border-ink">
                <div className="flex items-baseline gap-2">
                    <MonthLabel month={month} />
                    <YearLabel year={year} />
                </div>
                <DaysLabel daysInRange={daysInRange} />
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
                <Cells
                    cells={cells}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    cellAspectClassName={cellAspectClassName}
                />
            </div>
        </div>
    )
}

const Bone = ({ className }: { className?: string }) => (
    <div className={cn('bg-ink/10 animate-pulse', className)} />
)

const MonthLabel = ({ month }: { month?: number }) => {
    if (month === undefined) return <Bone className="h-6.5 lg:h-9 w-36 lg:w-52" />

    return (
        <span className="font-sans text-[26px] lg:text-[36px] font-extrabold leading-none tracking-[-0.03em]">
            {monthName(month)}
        </span>
    )
}

const YearLabel = ({ year }: { year?: number }) => {
    if (year === undefined) return <Bone className="h-3,5 lg:h-4.5 w-10 lg:w-12" />

    return (
        <span className="font-mono text-[14px] lg:text-[18px] text-ink/55 leading-none">
            {year}
        </span>
    )
}

const DaysLabel = ({ daysInRange }: { daysInRange?: number }) => {
    if (daysInRange === undefined) return <Bone className="h-2.5 lg:h-2.75 w-14" />

    return (
        <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-widest text-ink/55">
            {daysInRange} DAYS
        </span>
    )
}

type CellsProps = {
    cells?: GridCell[]
    rangeStart?: string
    rangeEnd?: string
    cellAspectClassName?: string
}

const Cells = ({ cells, rangeStart, rangeEnd, cellAspectClassName }: CellsProps) => {
    if (cells === undefined)
        return Array.from({ length: UNDATED_CELL_COUNT }, (_, i) => (
            <CellFrame key={i} cellAspectClassName={cellAspectClassName}>
                <div className="flex h-full flex-col justify-between p-1.5">
                    <Bone className="h-3 w-4" />
                    <Bone className="h-3 w-6 self-end" />
                </div>
            </CellFrame>
        ))

    return cells.map((cell) => (
        <CellFrame key={cell.date} cellAspectClassName={cellAspectClassName}>
            <CellContent cell={cell} inRange={isInRange(cell, rangeStart, rangeEnd)} />
        </CellFrame>
    ))
}

// Without a range, the whole month counts as in range.
const isInRange = (cell: GridCell, rangeStart?: string, rangeEnd?: string) => {
    if (rangeStart === undefined || rangeEnd === undefined) return cell.inMonth
    return cell.date >= rangeStart && cell.date <= rangeEnd
}

type CellFrameProps = {
    cellAspectClassName?: string
    children: React.ReactNode
}

const CellFrame = ({ cellAspectClassName, children }: CellFrameProps) => (
    <div
        className={cn(
            'border-r-[1.5px] border-b-[1.5px] border-ink nth-[7n]:border-r-0 nth-last-[-n+7]:border-b-0',
            cellAspectClassName
        )}
    >
        {children}
    </div>
)

type CellContentProps = {
    cell: GridCell
    inRange: boolean
}

const CellContent = ({ cell, inRange }: CellContentProps) => {
    if (inRange)
        return (
            <div className="flex h-full flex-col justify-between p-1.5">
                <span className="font-mono text-[12px] text-ink/30">{cell.dom}</span>
                <Bone className="h-3 w-6 self-end" />
            </div>
        )

    return (
        <div className="relative h-full bg-hatch opacity-40 p-1">
            <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
        </div>
    )
}

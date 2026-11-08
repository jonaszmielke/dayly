import { MonthGrid, MonthGridCell, type MonthGridDay, MonthGridFrame } from './MonthGrid'
import { calcDaysInRange } from '@/lib/dates'
import { cn } from '@/lib/utils'

// Every month fits in at most 6 week rows, so without a date the skeleton renders the full 6×7.
const UNDATED_CELL_COUNT = 6 * 7

type MonthGridSkeletonProps = {
    className?: string
    cellAspectClassName?: string
} & (
    | { year: number; month: number; rangeStart: string; rangeEnd: string }
    /** Month not known yet (e.g. before hydration): bones instead of the title and day numbers. */
    | { year?: undefined; month?: undefined; rangeStart?: undefined; rangeEnd?: undefined }
)

/** Loading state for `MonthGrid`: the real grid with placeholder cells. */
export const MonthGridSkeleton = ({
    year,
    month,
    rangeStart,
    rangeEnd,
    className,
    cellAspectClassName,
}: MonthGridSkeletonProps) => {
    if (year === undefined)
        return <UndatedSkeleton className={className} cellAspectClassName={cellAspectClassName} />

    return (
        <MonthGrid
            ariaHidden
            year={year}
            month={month}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            daysInRange={calcDaysInRange(year, month, rangeStart, rangeEnd)}
            className={className}
            cellAspectClassName={cellAspectClassName}
            cellRenderer={(day) => <SkeletonCell {...day} />}
        />
    )
}

const Bone = ({ className }: { className?: string }) => (
    <div className={cn('bg-ink/10 animate-pulse', className)} />
)

const SkeletonCell = ({ cell, inRange }: MonthGridDay) => {
    if (!inRange)
        return (
            <div className="relative h-full bg-hatch opacity-40 p-1">
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )

    return (
        <div className="flex h-full flex-col justify-between p-1.5">
            <span className="font-mono text-[12px] text-ink/30">{cell.dom}</span>
            <Bone className="h-3 w-6 self-end" />
        </div>
    )
}

const UndatedSkeleton = ({
    className,
    cellAspectClassName,
}: {
    className?: string
    cellAspectClassName?: string
}) => (
    <MonthGridFrame
        ariaHidden
        className={className}
        header={
            <>
                <div className="flex items-baseline gap-2">
                    <Bone className="h-6.5 lg:h-9 w-36 lg:w-52" />
                    <Bone className="h-3.5 lg:h-4.5 w-10 lg:w-12" />
                </div>
                <Bone className="h-2.5 lg:h-2.75 w-14" />
            </>
        }
    >
        {Array.from({ length: UNDATED_CELL_COUNT }, (_, i) => (
            <MonthGridCell key={i} cellAspectClassName={cellAspectClassName}>
                <div className="flex h-full flex-col justify-between p-1.5">
                    <Bone className="h-3 w-4" />
                    <Bone className="h-3 w-6 self-end" />
                </div>
            </MonthGridCell>
        ))}
    </MonthGridFrame>
)

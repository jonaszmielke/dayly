import { HourGrid } from './HourGrid'
import { type WeekCell } from '@/lib/calendar'

type HourGridSkeletonProps = {
    week: WeekCell[]
    hours: number[]
}

/** Loading state for `HourGrid`: the real grid, muted, with pulsing placeholder slots. */
export const HourGridSkeleton = ({ week, hours }: HourGridSkeletonProps) => (
    <HourGrid
        ariaHidden
        muted
        week={week}
        hours={hours}
        cellRenderer={({ inRange }) => <SkeletonSlot inRange={inRange} />}
    />
)

const SkeletonSlot = ({ inRange }: { inRange: boolean }) => {
    if (!inRange) return <div className="h-full bg-hatch opacity-40" />

    return (
        <div className="flex h-full items-center justify-center p-1.5">
            <div className="h-full w-full bg-ink/10 animate-pulse" />
        </div>
    )
}

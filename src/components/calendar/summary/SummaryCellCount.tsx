import type { SlotStats } from './summarySlot'

type SummaryCellCountSize = 'day' | 'hour'

type CountClasses = {
    /** ✓ shown when the selected person is available. */
    check: string
    /** Big count for slots where most people are free. */
    prominent: string
    /** "/total" next to the big count. */
    suffix: string
    /** Count for every other slot. */
    small: string
}

const SIZE_CLASSES: Record<SummaryCellCountSize, CountClasses> = {
    day: {
        check: 'font-sans text-[28px] font-extrabold leading-none',
        prominent: 'font-sans font-extrabold leading-none tracking-[-0.04em] text-[26px]',
        suffix: 'font-mono text-[11px] opacity-60',
        small: 'font-mono text-[11px] opacity-50',
    },
    hour: {
        check: 'font-sans text-[18px] font-extrabold leading-none',
        prominent: 'font-sans font-extrabold leading-none tracking-[-0.04em] text-[18px]',
        suffix: 'font-mono text-[10px] opacity-60',
        small: 'font-mono text-[11px] opacity-60',
    },
}

const PROMINENT_RATIO = 0.8

type SummaryCellCountProps = {
    size: SummaryCellCountSize
    stats: SlotStats
    hideTotal?: boolean
}

export const SummaryCellCount = ({ size, stats, hideTotal }: SummaryCellCountProps) => {
    const { isSelectedPersonAvailable, freeCount, total } = stats
    const classes = SIZE_CLASSES[size]

    if (isSelectedPersonAvailable !== null) {
        if (isSelectedPersonAvailable) return <span className={classes.check}>✓</span>
        return null
    }

    if (freeCount <= 0) return null

    const prominent = freeCount / total >= PROMINENT_RATIO
    const totalSuffix = hideTotal ? '' : `/${total}`

    if (!prominent)
        return (
            <span className={classes.small}>
                {freeCount}
                {totalSuffix}
            </span>
        )

    if (hideTotal) return <span className={classes.prominent}>{freeCount}</span>

    return (
        <div className="flex items-baseline gap-0.5">
            <span className={classes.prominent}>{freeCount}</span>
            <span className={classes.suffix}>{totalSuffix}</span>
        </div>
    )
}

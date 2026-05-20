import { GridCell } from '@/lib/dates'
import { pickFg, pickHeat } from '@/lib/heat'
import { cn } from '@/lib/utils'

type HeroCellProps = {
    cell: GridCell
    inRange: boolean
    freeCount: number
    totalCount: number
}

export const HeroCell = ({ cell, freeCount, totalCount }: HeroCellProps) => {
    if (!cell.inMonth) {
        return (
            <div
                className="relative flex items-start justify-start p-1 bg-hatch opacity-40"
                style={{ height: '100%' }}
            >
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )
    }

    const heat = pickHeat(freeCount, totalCount)
    const fg = pickFg(heat)
    const ratio = totalCount > 0 ? freeCount / totalCount : 0
    const prominent = ratio >= 0.8 && freeCount > 0

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between p-1.5 transition-all',
                'hover:shadow-[inset_0_0_0_3px_#161514]'
            )}
            style={{
                height: '100%',
                backgroundColor: heat,
                color: fg,
            }}
        >
            <span className="font-mono text-[12px] opacity-85 relative z-10">{cell.dom}</span>
            <div className="flex justify-end relative z-10">
                {freeCount > 0 &&
                    (prominent ? (
                        <div className="flex items-baseline gap-0.5">
                            <span
                                className="font-sans font-extrabold leading-none tracking-[-0.04em]"
                                style={{ fontSize: '26px' }}
                            >
                                {freeCount}
                            </span>
                            <span className="font-mono text-[11px] opacity-60">/{totalCount}</span>
                        </div>
                    ) : (
                        <span className="font-mono text-[11px] opacity-50">
                            {freeCount}/{totalCount}
                        </span>
                    ))}
            </div>
        </div>
    )
}

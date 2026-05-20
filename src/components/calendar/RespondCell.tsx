'use client'

import { GridCell } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { isWeekend } from '@/utils/isWeekend'

type RespondCellProps = {
    cell: GridCell
    inRange: boolean
    selected: boolean
    onMouseDown: (iso: string, shiftKey: boolean) => void
    onMouseEnter: (iso: string) => void
}

export const RespondCell = ({
    cell,
    inRange,
    selected,
    onMouseDown,
    onMouseEnter,
}: RespondCellProps) => {
    if (!inRange || !cell.inMonth) {
        return (
            <div className="relative bg-hatch opacity-40 p-1" style={{ height: '100%' }}>
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )
    }

    const weekend = isWeekend(cell.date)

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between p-1.5 cursor-pointer select-none transition-all',
                selected ? 'bg-mocha text-paper-2' : 'bg-white text-ink',
                !selected && 'hover:bg-paper-3'
            )}
            style={{
                height: '100%',
            }}
            onMouseDown={(e) => onMouseDown(cell.date, e.shiftKey)}
            onMouseEnter={() => onMouseEnter(cell.date)}
        >
            {/* Weekend hatch when unselected */}
            {weekend && !selected && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg,#161514,#161514 1px,transparent 1px,transparent 6px)',
                    }}
                />
            )}

            {/* Hover inset ring (CSS via group hover) */}
            <div
                className={cn(
                    'absolute inset-0 pointer-events-none transition-all',
                    !selected && 'hover-ring'
                )}
            />

            <span className="font-mono text-[12px] opacity-85 relative z-10">{cell.dom}</span>

            {selected && (
                <div className="flex justify-end relative z-10">
                    <span className="font-sans text-[28px] font-extrabold leading-none">✓</span>
                </div>
            )}
        </div>
    )
}

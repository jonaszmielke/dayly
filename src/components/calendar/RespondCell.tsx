'use client'

import { GridCell } from '@/lib/dates'
import { cn } from '@/lib/utils'

type RespondCellProps = {
    cell: GridCell
    inRange: boolean
    selected: boolean
    isHovered: boolean
    onPointerDown: (iso: string, shiftKey: boolean) => void
    onPointerEnter: (iso: string) => void
    onPointerLeave: () => void
}

export const RespondCell = ({
    cell,
    inRange,
    selected,
    isHovered,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
}: RespondCellProps) => {
    if (!inRange) {
        return (
            <div className="relative bg-hatch opacity-40 p-1" style={{ height: '100%' }}>
                <span className="font-mono text-[12px] text-ink/35">{cell.dom}</span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between p-1.5 cursor-pointer select-none transition-all',
                selected ? 'bg-mocha text-paper-2' : 'bg-white text-ink',
                !selected && 'hover:bg-paper-3'
            )}
            style={{ height: '100%', touchAction: 'none' }}
            onPointerDown={(e) => onPointerDown(cell.date, e.shiftKey)}
            onPointerEnter={() => onPointerEnter(cell.date)}
            onPointerLeave={onPointerLeave}
        >
            {isHovered && (
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_2px_#161514] z-0" />
            )}

            <span className="font-mono text-[12px] opacity-85 relative z-10">{cell.dom}</span>

            {selected && (
                <div className="flex justify-end relative z-10">
                    <span className="font-sans text-[28px] font-extrabold leading-none">✓</span>
                </div>
            )}
        </div>
    )
}

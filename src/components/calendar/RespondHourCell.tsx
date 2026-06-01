'use client'

import { slotKey } from '@/lib/dates'
import { cn } from '@/lib/utils'

type RespondHourCellProps = {
    date: string
    hour: number
    inRange: boolean
    selected: boolean
    hovered: boolean
    onPointerDown: (key: string) => void
    onPointerEnter: (key: string) => void
    onPointerLeave: () => void
}

export const RespondHourCell = ({
    date,
    hour,
    inRange,
    selected,
    hovered,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
}: RespondHourCellProps) => {
    if (!inRange) {
        return <div className="bg-hatch opacity-40 w-full h-full" />
    }

    const key = slotKey(date, hour)

    return (
        <div
            data-slot={key}
            onPointerDown={() => onPointerDown(key)}
            onPointerEnter={() => onPointerEnter(key)}
            onPointerLeave={onPointerLeave}
            className={cn(
                'relative w-full h-full cursor-pointer select-none transition-colors',
                selected ? 'bg-mocha' : 'bg-white hover:bg-paper-3'
            )}
            style={{ touchAction: 'none' }}
        >
            {hovered && (
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_2px_#161514]" />
            )}
        </div>
    )
}

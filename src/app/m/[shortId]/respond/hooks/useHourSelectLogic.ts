'use client'

import { usePaintSelection } from './usePaintSelection'
import { slotKey } from '@/lib/dates'
import { useCallback } from 'react'

type UseHourSelectLogicProps = {
    hours: number[]
    /** Keys "Reset" returns to (the edited response). */
    resetKeys?: string[]
}

/** Flips a whole line of slots: all on → all off, otherwise all on. */
const toggleAll = (s: Set<string>, keys: string[]) => {
    const allOn = keys.every((k) => s.has(k))
    keys.forEach((k) => (allOn ? s.delete(k) : s.add(k)))
}

export const useHourSelectLogic = ({ hours, resetKeys }: UseHourSelectLogicProps) => {
    const {
        selected,
        setSelected,
        apply,
        hoveredKey,
        startPaint,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
    } = usePaintSelection({ cellAttribute: 'data-slot', resetKeys })

    // Toggle a whole day column (all hours of one date)
    const handleToggleDay = useCallback(
        (date: string) => {
            apply((s) =>
                toggleAll(
                    s,
                    hours.map((h) => slotKey(date, h))
                )
            )
        },
        [apply, hours]
    )

    // Toggle one hour row across the in-range days of a single week
    const handleToggleHour = useCallback(
        (hour: number, weekDates: string[]) => {
            apply((s) =>
                toggleAll(
                    s,
                    weekDates.map((d) => slotKey(d, hour))
                )
            )
        },
        [apply]
    )

    return {
        selected,
        setSelected,
        hoveredSlot: hoveredKey,
        handlePointerDown: startPaint,
        handlePointerEnter,
        handlePointerLeave,
        handleToggleDay,
        handleToggleHour,
        handleReset,
    }
}

'use client'

import { usePaintSelection } from './usePaintSelection'
import { dateRange } from '@/lib/dates'
import { useCallback, useRef } from 'react'

type UseCalendarSelectLogicProps = {
    rangeStart: string
    rangeEnd: string
    /** Keys "Reset" returns to (the edited response). */
    resetKeys?: string[]
}

export const useCalendarSelectLogic = ({
    rangeStart,
    rangeEnd,
    resetKeys,
}: UseCalendarSelectLogicProps) => {
    const isInMeetingRange = useCallback(
        (iso: string) => iso >= rangeStart && iso <= rangeEnd,
        [rangeStart, rangeEnd]
    )

    const {
        selected,
        setSelected,
        apply,
        hoveredKey,
        startPaint,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
    } = usePaintSelection({ cellAttribute: 'data-iso', resetKeys, isSelectable: isInMeetingRange })

    // Last clicked day; ⇧-click fills the range between it and the new day.
    const anchorRef = useRef<string | null>(null)

    const handlePointerDown = useCallback(
        (iso: string, shiftKey: boolean) => {
            const anchor = anchorRef.current
            anchorRef.current = iso

            if (!shiftKey || !anchor) {
                startPaint(iso)
                return
            }

            const [from, to] = anchor <= iso ? [anchor, iso] : [iso, anchor]
            const range = dateRange(from, to).filter(isInMeetingRange)
            // The range copies the anchor's state: selected anchor adds, unselected removes.
            const add = selected.has(anchor)
            apply((s) => {
                range.forEach((d) => (add ? s.add(d) : s.delete(d)))
            })
        },
        [selected, apply, startPaint, isInMeetingRange]
    )

    const handleQuickPick = useCallback(
        (type: 'weekends' | 'weekdays') => {
            const days = dateRange(rangeStart, rangeEnd).filter((iso) => {
                const dow = new Date(iso + 'T00:00:00').getDay()
                const isWeekend = dow === 0 || dow === 6
                return type === 'weekends' ? isWeekend : !isWeekend
            })
            apply((s) => days.forEach((iso) => s.add(iso)))
        },
        [rangeStart, rangeEnd, apply]
    )

    return {
        selected,
        setSelected,
        hoveredDate: hoveredKey,
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
        handleQuickPick,
    }
}

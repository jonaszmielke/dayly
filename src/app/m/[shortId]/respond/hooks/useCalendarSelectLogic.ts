'use client'

import { dateRange } from '@/lib/dates'
import { useCallback, useEffect, useState } from 'react'

type UseCalendarSelectLogicProps = {
    rangeStart: string
    rangeEnd: string
}

export const useCalendarSelectLogic = ({ rangeStart, rangeEnd }: UseCalendarSelectLogicProps) => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [dragging, setDragging] = useState<'add' | 'remove' | null>(null)
    const [anchor, setAnchor] = useState<string | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)

    useEffect(() => {
        const onUp = () => setDragging(null)
        window.addEventListener('mouseup', onUp)
        return () => window.removeEventListener('mouseup', onUp)
    }, [])

    const handleMouseDown = useCallback(
        (iso: string, shiftKey: boolean) => {
            if (shiftKey && anchor) {
                const [a, b] = anchor <= iso ? [anchor, iso] : [iso, anchor]
                const range = dateRange(a, b).filter((d) => d >= rangeStart && d <= rangeEnd)
                const anchorSelected = selected.has(anchor)
                const mode = anchorSelected ? 'add' : 'remove'
                setSelected((prev) => {
                    const next = new Set(prev)
                    range.forEach((d) => {
                        if (mode === 'add') next.add(d)
                        else next.delete(d)
                    })
                    return next
                })
                setAnchor(iso)
                return
            }
            const isSelected = selected.has(iso)
            const mode = isSelected ? 'remove' : 'add'
            setDragging(mode)
            setAnchor(iso)
            setSelected((prev) => {
                const next = new Set(prev)
                if (mode === 'remove') next.delete(iso)
                else next.add(iso)
                return next
            })
        },
        [selected, anchor, rangeStart, rangeEnd]
    )

    const handleMouseEnter = useCallback(
        (iso: string) => {
            setHoveredDate(iso)
            if (!dragging) return
            setSelected((prev) => {
                const next = new Set(prev)
                if (dragging === 'remove') next.delete(iso)
                else next.add(iso)
                return next
            })
        },
        [dragging]
    )

    const handleMouseLeave = useCallback(() => {
        setHoveredDate(null)
    }, [])

    const handleReset = useCallback(() => {
        setSelected(new Set())
    }, [])

    const handleQuickPick = useCallback(
        (type: 'weekends' | 'weekdays') => {
            const all = dateRange(rangeStart, rangeEnd)
            const filtered = all.filter((iso) => {
                const dow = new Date(iso + 'T00:00:00').getDay()
                const isWeekend = dow === 0 || dow === 6
                return type === 'weekends' ? isWeekend : !isWeekend
            })
            setSelected((prev) => {
                const next = new Set(prev)
                filtered.forEach((iso) => next.add(iso))
                return next
            })
        },
        [rangeStart, rangeEnd]
    )

    return {
        selected,
        setSelected,
        hoveredDate,
        handleMouseDown,
        handleMouseEnter,
        handleMouseLeave,
        handleReset,
        handleQuickPick,
    }
}

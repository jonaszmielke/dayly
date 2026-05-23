'use client'

import { dateRange, ymd } from '@/lib/dates'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseCalendarSelectLogicProps = {
    rangeStart: string
    rangeEnd: string
    initialSelected?: Date[]
    edit?: boolean
}

export const useCalendarSelectLogic = ({
    rangeStart,
    rangeEnd,
    initialSelected,
    edit = false,
}: UseCalendarSelectLogicProps) => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)

    const dragRef = useRef<{
        active: boolean
        mode: 'add' | 'remove'
        lastIso: string | null
        anchor: string | null
    }>({ active: false, mode: 'add', lastIso: null, anchor: null })

    const apply = useCallback((mut: (s: Set<string>) => void) => {
        setSelected((prev) => {
            const next = new Set(prev)
            mut(next)
            return next
        })
    }, [])

    // End drag on pointer up / cancel
    useEffect(() => {
        const onUp = () => {
            dragRef.current.active = false
            dragRef.current.lastIso = null
        }
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)
        return () => {
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
        }
    }, [])

    // Touch-drag via elementFromPoint so dragging across cells works on mobile
    useEffect(() => {
        const onTouchMove = (e: TouchEvent) => {
            if (!dragRef.current.active) return
            const touch = e.touches[0]
            if (!touch) return
            const el = document.elementFromPoint(touch.clientX, touch.clientY)
            if (!el) return
            const cellEl = el.closest('[data-iso]') as HTMLElement | null
            if (!cellEl) return
            const iso = cellEl.getAttribute('data-iso')
            if (!iso || iso === dragRef.current.lastIso) return
            if (iso < rangeStart || iso > rangeEnd) return
            dragRef.current.lastIso = iso
            const { mode } = dragRef.current
            apply((s) => { if (mode === 'add') s.add(iso); else s.delete(iso) })
            if (e.cancelable) e.preventDefault()
        }
        window.addEventListener('touchmove', onTouchMove, { passive: false })
        return () => window.removeEventListener('touchmove', onTouchMove)
    }, [apply, rangeStart, rangeEnd])

    const handlePointerDown = useCallback(
        (iso: string, shiftKey: boolean) => {
            if (shiftKey && dragRef.current.anchor) {
                const anchor = dragRef.current.anchor
                const [a, b] = anchor <= iso ? [anchor, iso] : [iso, anchor]
                const range = dateRange(a, b).filter((d) => d >= rangeStart && d <= rangeEnd)
                const anchorSelected = selected.has(anchor)
                const mode = anchorSelected ? 'add' : 'remove'
                apply((s) => {
                    range.forEach((d) => { if (mode === 'add') s.add(d); else s.delete(d) })
                })
                dragRef.current.anchor = iso
                return
            }
            const isOn = selected.has(iso)
            const mode = isOn ? 'remove' : 'add'
            dragRef.current = { active: true, mode, lastIso: iso, anchor: iso }
            apply((s) => { if (mode === 'add') s.add(iso); else s.delete(iso) })
        },
        [selected, apply, rangeStart, rangeEnd]
    )

    const handlePointerEnter = useCallback(
        (iso: string) => {
            setHoveredDate(iso)
            if (!dragRef.current.active) return
            if (iso === dragRef.current.lastIso) return
            dragRef.current.lastIso = iso
            const { mode } = dragRef.current
            apply((s) => { if (mode === 'add') s.add(iso); else s.delete(iso) })
        },
        [apply]
    )

    const handlePointerLeave = useCallback(() => {
        setHoveredDate(null)
    }, [])

    const handleReset = useCallback(() => {
        if (edit && initialSelected) setSelected(new Set(initialSelected.map((d) => ymd(d))))
        else setSelected(new Set())
    }, [initialSelected, edit])

    const handleQuickPick = useCallback(
        (type: 'weekends' | 'weekdays') => {
            const all = dateRange(rangeStart, rangeEnd)
            const filtered = all.filter((iso) => {
                const dow = new Date(iso + 'T00:00:00').getDay()
                const isWeekend = dow === 0 || dow === 6
                return type === 'weekends' ? isWeekend : !isWeekend
            })
            apply((s) => { filtered.forEach((iso) => s.add(iso)) })
        },
        [rangeStart, rangeEnd, apply]
    )

    return {
        selected,
        setSelected,
        hoveredDate,
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
        handleQuickPick,
        // Legacy aliases — kept so existing call sites that use old names still compile
        handleMouseDown: handlePointerDown,
        handleMouseEnter: handlePointerEnter,
        handleMouseLeave: handlePointerLeave,
    }
}

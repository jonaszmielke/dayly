'use client'

import { slotKey, slotKeyFromUtc } from '@/lib/dates'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseHourSelectLogicProps = {
    hours: number[]
    initialSelected?: Date[]
    edit?: boolean
}

export const useHourSelectLogic = ({
    hours,
    initialSelected,
    edit = false,
}: UseHourSelectLogicProps) => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

    const dragRef = useRef<{ active: boolean; mode: 'add' | 'remove'; lastKey: string | null }>({
        active: false,
        mode: 'add',
        lastKey: null,
    })

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
            dragRef.current.lastKey = null
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
            const cellEl = el.closest('[data-slot]') as HTMLElement | null
            if (!cellEl) return
            const key = cellEl.getAttribute('data-slot')
            if (!key || key === dragRef.current.lastKey) return
            dragRef.current.lastKey = key
            const { mode } = dragRef.current
            apply((s) => { if (mode === 'add') s.add(key); else s.delete(key) })
            if (e.cancelable) e.preventDefault()
        }
        window.addEventListener('touchmove', onTouchMove, { passive: false })
        return () => window.removeEventListener('touchmove', onTouchMove)
    }, [apply])

    const handlePointerDown = useCallback(
        (key: string) => {
            const isOn = selected.has(key)
            const mode = isOn ? 'remove' : 'add'
            dragRef.current = { active: true, mode, lastKey: key }
            apply((s) => { if (mode === 'add') s.add(key); else s.delete(key) })
        },
        [selected, apply]
    )

    const handlePointerEnter = useCallback(
        (key: string) => {
            setHoveredSlot(key)
            if (!dragRef.current.active) return
            if (key === dragRef.current.lastKey) return
            dragRef.current.lastKey = key
            const { mode } = dragRef.current
            apply((s) => { if (mode === 'add') s.add(key); else s.delete(key) })
        },
        [apply]
    )

    const handlePointerLeave = useCallback(() => {
        setHoveredSlot(null)
    }, [])

    // Toggle a whole day column (all hours of one date)
    const handleToggleDay = useCallback(
        (date: string) => {
            apply((s) => {
                const keys = hours.map((h) => slotKey(date, h))
                const allOn = keys.every((k) => s.has(k))
                keys.forEach((k) => (allOn ? s.delete(k) : s.add(k)))
            })
        },
        [apply, hours]
    )

    // Toggle one hour row across the in-range days of a single week
    const handleToggleHour = useCallback(
        (hour: number, weekDates: string[]) => {
            apply((s) => {
                const keys = weekDates.map((d) => slotKey(d, hour))
                const allOn = keys.every((k) => s.has(k))
                keys.forEach((k) => (allOn ? s.delete(k) : s.add(k)))
            })
        },
        [apply]
    )

    const handleReset = useCallback(() => {
        if (edit && initialSelected) setSelected(new Set(initialSelected.map(slotKeyFromUtc)))
        else setSelected(new Set())
    }, [initialSelected, edit])

    return {
        selected,
        setSelected,
        hoveredSlot,
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        handleToggleDay,
        handleToggleHour,
        handleReset,
    }
}

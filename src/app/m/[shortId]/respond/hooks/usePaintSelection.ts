'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type PaintMode = 'add' | 'remove'

type UsePaintSelectionOptions = {
    /** Data attribute holding each cell's key, used to find cells under a finger during touch drags. */
    cellAttribute: 'data-iso' | 'data-slot'
    /** Keys "Reset" returns to (the edited response); empty selection when absent. */
    resetKeys?: string[]
    /** Extra filter for keys reached by touch-dragging. */
    isSelectable?: (key: string) => boolean
}

const paint = (set: Set<string>, key: string, mode: PaintMode) => {
    if (mode === 'add') set.add(key)
    else set.delete(key)
}

/**
 * Click-and-drag "painting" over a grid of cells, shared by the day and hour pickers.
 * Pressing a cell toggles it and starts a drag; every cell entered while dragging gets the same
 * add/remove mode. Touch drags are tracked with `elementFromPoint`, since touch events keep
 * targeting the cell where the finger went down.
 */
export const usePaintSelection = ({
    cellAttribute,
    resetKeys,
    isSelectable,
}: UsePaintSelectionOptions) => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [hoveredKey, setHoveredKey] = useState<string | null>(null)
    const dragRef = useRef<{ active: boolean; mode: PaintMode; lastKey: string | null }>({
        active: false,
        mode: 'add',
        lastKey: null,
    })

    const apply = useCallback((mutate: (s: Set<string>) => void) => {
        setSelected((prev) => {
            const next = new Set(prev)
            mutate(next)
            return next
        })
    }, [])

    const paintDragged = useCallback(
        (key: string) => {
            if (!dragRef.current.active || key === dragRef.current.lastKey) return
            dragRef.current.lastKey = key
            const { mode } = dragRef.current
            apply((s) => paint(s, key, mode))
        },
        [apply]
    )

    // End the drag wherever the pointer is released.
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

    useEffect(() => {
        const onTouchMove = (e: TouchEvent) => {
            if (!dragRef.current.active) return
            const touch = e.touches[0]
            if (!touch) return
            const cellEl = document
                .elementFromPoint(touch.clientX, touch.clientY)
                ?.closest(`[${cellAttribute}]`)
            const key = cellEl?.getAttribute(cellAttribute)
            if (!key || (isSelectable && !isSelectable(key))) return
            paintDragged(key)
            // Stop the page from scrolling while painting.
            if (e.cancelable) e.preventDefault()
        }
        window.addEventListener('touchmove', onTouchMove, { passive: false })
        return () => window.removeEventListener('touchmove', onTouchMove)
    }, [cellAttribute, isSelectable, paintDragged])

    /** Toggles `key` and starts a drag that applies the same change to every cell entered. */
    const startPaint = useCallback(
        (key: string) => {
            const mode: PaintMode = selected.has(key) ? 'remove' : 'add'
            dragRef.current = { active: true, mode, lastKey: key }
            apply((s) => paint(s, key, mode))
        },
        [selected, apply]
    )

    const handlePointerEnter = useCallback(
        (key: string) => {
            setHoveredKey(key)
            paintDragged(key)
        },
        [paintDragged]
    )

    const handlePointerLeave = useCallback(() => setHoveredKey(null), [])

    const handleReset = useCallback(() => setSelected(new Set(resetKeys)), [resetKeys])

    return {
        selected,
        setSelected,
        apply,
        hoveredKey,
        startPaint,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
    }
}

import type { HoverPos } from './HoverTip'
import { type MouseEventHandler, type PointerEventHandler, useState } from 'react'

type UseSummaryCellInteractionOptions = {
    key: string
    isTouch: boolean
    onMouseEnter: (key: string) => void
    onMouseLeave: () => void
    onTap?: (key: string) => void
}

/**
 * One popup per input type:
 * - mouse: hover shows the HoverTip (`hoverPos`), click does nothing
 * - touch and keyboard: activation calls `onTap`, which opens the detail sheet
 */
export const useSummaryCellInteraction = ({
    key,
    isTouch,
    onMouseEnter,
    onMouseLeave,
    onTap,
}: UseSummaryCellInteractionOptions) => {
    const [hoverPos, setHoverPos] = useState<HoverPos | null>(null)

    const onPointerEnter: PointerEventHandler<HTMLElement> = (e) => {
        if (isTouch || e.pointerType !== 'mouse') return
        setHoverPos({ x: e.clientX, y: e.clientY })
        onMouseEnter(key)
    }

    const onPointerLeave: PointerEventHandler<HTMLElement> = (e) => {
        if (isTouch || e.pointerType !== 'mouse') return
        setHoverPos(null)
        onMouseLeave()
    }

    // Keyboard-triggered clicks (Enter/Space) have `detail === 0`; mouse clicks are 1+.
    const onClick: MouseEventHandler<HTMLElement> = (e) => {
        if (isTouch || e.detail === 0) onTap?.(key)
    }

    return { hoverPos, onPointerEnter, onPointerLeave, onClick }
}

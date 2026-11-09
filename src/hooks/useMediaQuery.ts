'use client'

import { useCallback, useSyncExternalStore } from 'react'

export const MEDIA_QUERIES = {
    /** Below Tailwind's `lg` breakpoint (1024px); keep in sync with the `lg:` classes. */
    mobile: '(max-width: 1023px)',
    /** Primary input is a finger rather than a mouse. */
    touch: '(pointer: coarse)',
} as const

// The server can't know the screen; render the desktop/mouse variant until hydration.
const getServerSnapshot = (): boolean => false

/** Whether `query` currently matches; updates when it starts or stops matching. */
export const useMediaQuery = (query: string): boolean => {
    // Stable per query, otherwise React would re-subscribe on every render.
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mq = window.matchMedia(query)
            mq.addEventListener('change', onChange)
            return () => mq.removeEventListener('change', onChange)
        },
        [query]
    )
    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

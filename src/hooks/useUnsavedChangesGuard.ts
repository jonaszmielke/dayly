'use client'

import { useEffect } from 'react'

const LEAVE_MESSAGE = 'You have unsaved changes. Leave this page?'

/**
 * While `isDirty` is true, warns before the user leaves the page:
 * - closing the tab / reloading: the browser's native "Leave site?" dialog
 * - the browser back button: a confirm dialog
 */
export const useUnsavedChangesGuard = (isDirty: boolean) => {
    useEffect(() => {
        if (!isDirty) return
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isDirty])

    useEffect(() => {
        if (!isDirty) return
        // Extra history entry so the back button lands here first and we can intercept it.
        window.history.pushState(null, '', window.location.href)
        const onPopState = () => {
            if (window.confirm(LEAVE_MESSAGE)) {
                window.removeEventListener('popstate', onPopState)
                window.history.back()
            }
        }
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [isDirty])
}

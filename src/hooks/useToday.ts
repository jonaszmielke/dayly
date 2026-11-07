import { ymd } from '@/lib/dates'
import { useSyncExternalStore } from 'react'

const msUntilNextMidnight = (): number => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return nextMidnight.getTime() - now.getTime()
}

const subscribe = (callback: () => void) => {
    let timeoutId: ReturnType<typeof setTimeout>

    const schedule = () => {
        timeoutId = setTimeout(() => {
            callback()
            schedule()
        }, msUntilNextMidnight())
    }

    const handleVisibility = () => {
        if (document.visibilityState === 'visible') callback()
    }

    schedule()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('visibilitychange', handleVisibility)
    }
}

const getSnapshot = (): string => ymd(new Date())

const getServerSnapshot = (): null => null

export const useToday = (): string | null =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

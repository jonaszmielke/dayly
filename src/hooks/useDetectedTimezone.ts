'use client'

import { timezones } from '@/lib/slots'
import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

const getBrowserTimezone = () => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timezones.has(detectedTimezone) ? detectedTimezone : 'UTC'
}
const getServerTimezone = () => 'UTC'

export const useDetectedTimezone = (): string =>
    useSyncExternalStore(noopSubscribe, getBrowserTimezone, getServerTimezone)

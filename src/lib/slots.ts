// Hour-mode slots ("YYYY-MM-DDTHH" keys) and timezones.

export const timezones = new Set<string>(Intl.supportedValuesOf('timeZone'))

export const isValidTimezone = (tz: string): boolean => {
    return timezones.has(tz)
}

export const formatHour = (h: number) => `${String(h).padStart(2, '0')}:00`

export const slotKey = (date: string, hour: number): string =>
    `${date}T${String(hour).padStart(2, '0')}`

// Rebuild a slotKey from a stored hour Date. Slots are persisted tz-naive as UTC
// instants (see saveHoursResponse), so read them back with UTC getters.
export const slotKeyFromUtc = (d: Date): string => {
    const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
        d.getUTCDate()
    ).padStart(2, '0')}`
    return slotKey(date, d.getUTCHours())
}

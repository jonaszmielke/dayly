// Plain calendar dates ("YYYY-MM-DD" strings): parsing, arithmetic and display formatting.

export const ymd = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export const parseISO = (iso: string): Date => {
    return new Date(iso + 'T00:00:00')
}

export const addDays = (iso: string, n: number): string => {
    const d = parseISO(iso)
    d.setDate(d.getDate() + n)
    return ymd(d)
}

export const convertToUtc = (date: Date | string): Date => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()))
}

export const dateRange = (startISO: string, endISO: string): string[] => {
    const out: string[] = []
    const d = new Date(startISO + 'T00:00:00')
    const end = new Date(endISO + 'T00:00:00')
    while (d <= end) {
        out.push(ymd(d))
        d.setDate(d.getDate() + 1)
    }
    return out
}

export const addMonths = (
    year: number,
    month: number,
    delta: number
): { year: number; month: number } => {
    const d = new Date(year, month + delta, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
}

export const MONTH_NAMES = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
] as const

export const MONTH_ABBREVIATIONS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
] as const

export const DOW_ABBREVIATIONS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const

export const monthName = (month: number): string => {
    return MONTH_NAMES[month]
}

export const formatDate = (iso: string): string => {
    const d = parseISO(iso)
    return `${String(d.getDate()).padStart(2, '0')} ${MONTH_ABBREVIATIONS[d.getMonth()]} ${d.getFullYear()}`
}

export const formatDateMedium = (iso: string): string => {
    const d = parseISO(iso)
    const dow = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]
    return `${dow} ${d.getDate()} ${MONTH_ABBREVIATIONS[d.getMonth()]}`
}

export const formatDateLong = (iso: string): string => {
    const d = parseISO(iso)
    const dow = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
        d.getDay()
    ]
    return `${dow} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}

/** Calendar days from `a` to `b` (tomorrow is 1, today is 0). */
export const daysBetween = (a: string, b: string): number =>
    Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000)

/** Days in the range `a`..`b`, counting both ends (a single day is 1). */
export const daysBetweenInclusive = (
    a: string | null | undefined,
    b: string | null | undefined
): number => {
    if (!a || !b) return 0
    return daysBetween(a, b) + 1
}

export const isWeekend = (iso: string): boolean => {
    const d = new Date(iso + 'T00:00:00')
    const dow = d.getDay()
    return dow === 0 || dow === 6
}

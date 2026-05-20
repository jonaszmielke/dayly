export const ymd = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export const parseISO = (iso: string): Date => {
    return new Date(iso + 'T00:00:00')
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

export type GridCell = {
    date: string
    inMonth: boolean
    dom: number
}

export const monthGrid = (year: number, month: number): GridCell[] => {
    const first = new Date(year, month, 1)
    const startCol = (first.getDay() + 6) % 7 // Mon-first
    const cells: GridCell[] = []
    for (let i = 0; i < startCol; i++) {
        const d = new Date(year, month, 1 - (startCol - i))
        cells.push({ date: ymd(d), inMonth: false, dom: d.getDate() })
    }
    const last = new Date(year, month + 1, 0).getDate()
    for (let i = 1; i <= last; i++) {
        cells.push({ date: ymd(new Date(year, month, i)), inMonth: true, dom: i })
    }
    while (cells.length % 7 !== 0) {
        const i = cells.length - (startCol + last) + 1
        cells.push({
            date: ymd(new Date(year, month + 1, i)),
            inMonth: false,
            dom: i,
        })
    }
    return cells
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

export const daysBetweenInclusive = (
    a: string | null | undefined,
    b: string | null | undefined
): number => {
    if (!a || !b) return 0
    return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000) + 1
}

export type BestResult = {
    max: number
    range: [string, string] | null
    allDays: string[]
}

export const computeBest = (availSets: string[][]): BestResult => {
    const counts: Record<string, number> = {}
    for (const avail of availSets) {
        for (const d of avail) counts[d] = (counts[d] || 0) + 1
    }
    const max = Math.max(0, ...Object.values(counts))
    const days = Object.keys(counts)
        .filter((d) => counts[d] === max)
        .sort()
    if (days.length === 0) return { max: 0, range: null, allDays: [] }
    let bestStart = days[0],
        bestEnd = days[0],
        bestLen = 1
    let curLen = 1
    for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1] + 'T00:00:00')
        const cur = new Date(days[i] + 'T00:00:00')
        const diff = (cur.getTime() - prev.getTime()) / 86400000
        if (diff === 1) {
            curLen++
            if (curLen > bestLen) {
                bestLen = curLen
                bestStart = days[i - curLen + 1]
                bestEnd = days[i]
            }
        } else {
            curLen = 1
        }
    }
    return { max, range: [bestStart, bestEnd], allDays: days }
}

export const getDisplayMonths = (
    startISO: string,
    endISO: string
): { year: number; month: number }[] => {
    const start = parseISO(startISO)
    const end = parseISO(endISO)
    const months: { year: number; month: number }[] = []
    let y = start.getFullYear()
    let m = start.getMonth()
    while (y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth())) {
        months.push({ year: y, month: m })
        m++
        if (m > 11) {
            m = 0
            y++
        }
    }
    return months
}

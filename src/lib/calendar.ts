import { DOW_ABBREVIATIONS, parseISO, ymd } from './dates'

// Layout data for the month and week grids.

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

export const calcDaysInRange = (
    year: number,
    month: number,
    rangeStart: string,
    rangeEnd: string
) => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    const clampStart = new Date(
        Math.max(monthStart.getTime(), new Date(rangeStart + 'T00:00:00').getTime())
    )
    const clampEnd = new Date(
        Math.min(monthEnd.getTime(), new Date(rangeEnd + 'T00:00:00').getTime())
    )
    if (clampStart > clampEnd) return 0
    return Math.round((clampEnd.getTime() - clampStart.getTime()) / 86400000) + 1
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

export type WeekCell = {
    date: string
    inRange: boolean
    dom: number
    dow: string
}

// Mon-aligned weeks spanning [startISO, endISO]. Days outside the range are still
// emitted (as columns) with inRange=false — analogous to monthGrid's out-of-month padding.
export const getDisplayWeeks = (startISO: string, endISO: string): WeekCell[][] => {
    const start = parseISO(startISO)
    const monOffset = (start.getDay() + 6) % 7 // Mon-first
    const cursor = new Date(start)
    cursor.setDate(cursor.getDate() - monOffset)

    const weeks: WeekCell[][] = []
    while (ymd(cursor) <= endISO) {
        const week: WeekCell[] = []
        for (let i = 0; i < 7; i++) {
            const date = ymd(cursor)
            week.push({
                date,
                inRange: date >= startISO && date <= endISO,
                dom: cursor.getDate(),
                dow: DOW_ABBREVIATIONS[i],
            })
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }
    return weeks
}

import { slotKey } from './slots'

// Finding the best day range / hour window from everyone's availability.

export type BestResult = {
    max: number
    range: [string, string] | null
    allDays: string[]
}

export const computeBest = (availableSets: string[][]): BestResult => {
    const counts: Record<string, number> = {}
    for (const available of availableSets) {
        for (const day of available) counts[day] = (counts[day] || 0) + 1
    }
    const max = Math.max(0, ...Object.values(counts))
    const days = Object.keys(counts)
        .filter((day) => counts[day] === max)
        .sort()
    if (days.length === 0) return { max: 0, range: null, allDays: [] }
    let bestStart = days[0],
        bestEnd = days[0],
        bestLength = 1
    let currentLength = 1
    for (let i = 1; i < days.length; i++) {
        const previousDay = new Date(days[i - 1] + 'T00:00:00')
        const currentDay = new Date(days[i] + 'T00:00:00')
        const diff = (currentDay.getTime() - previousDay.getTime()) / 86400000
        if (diff === 1) {
            currentLength++
            if (currentLength > bestLength) {
                bestLength = currentLength
                bestStart = days[i - currentLength + 1]
                bestEnd = days[i]
            }
        } else {
            currentLength = 1
        }
    }
    return { max, range: [bestStart, bestEnd], allDays: days }
}

export type BestHoursResult = {
    max: number
    day: string
    startHour: number
    endHour: number // exclusive
}

// Longest run of consecutive hours, on a single day, where the max number of people
// are all free. Ties resolve to the earliest day, then the earliest hour.
export const computeBestHours = (
    people: { availSet: Set<string> }[],
    days: string[],
    hours: number[]
): BestHoursResult | null => {
    const free = (day: string, hour: number) =>
        people.reduce((n, p) => (p.availSet.has(slotKey(day, hour)) ? n + 1 : n), 0)

    let max = 0
    for (const day of days) {
        for (const hour of hours) {
            const f = free(day, hour)
            if (f > max) max = f
        }
    }
    if (max === 0) return null

    let best: BestHoursResult | null = null
    for (const day of days) {
        let runStart: number | null = null
        for (let i = 0; i < hours.length; i++) {
            const hour = hours[i]
            const isPeak = free(day, hour) === max
            if (isPeak && runStart === null) runStart = hour
            const runEnds = !isPeak || i === hours.length - 1
            if (runStart !== null && runEnds) {
                const lastHour = isPeak ? hour : hours[i - 1]
                const length = lastHour - runStart + 1
                if (!best || length > best.endHour - best.startHour) {
                    best = { max, day, startHour: runStart, endHour: lastHour + 1 }
                }
                runStart = null
            }
        }
    }
    return best
}

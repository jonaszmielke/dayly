import { type DateRangeValue } from '@/components/calendar/pickers/DateRangePicker'
import { type StatRow } from '@/components/StatCard'
import { MeetingMode } from '@/generated/prisma/enums'
import { daysBetweenInclusive, formatDate } from '@/lib/dates'
import { formatHour } from '@/lib/slots'

const EMPTY = '—'

type StatRowsInput = {
    name: string
    mode: MeetingMode
    dateRange: DateRangeValue
    startHour: number
    endHour: number
    timezone: string
    deadline: string | null
}

const formatRange = ({ start, end }: DateRangeValue): string => {
    if (!start || !end) return EMPTY
    return `${daysBetweenInclusive(start, end)} days`
}

const formatHours = (startHour: number, endHour: number): string => {
    if (endHour <= startHour) return EMPTY
    return `${formatHour(startHour)} → ${formatHour(endHour)} · ${endHour - startHour} hrs/day`
}

const formatDeadline = (deadline: string | null): string => {
    if (!deadline) return EMPTY
    return formatDate(deadline)
}

export const buildStatRows = (input: StatRowsInput): StatRow[] => {
    const rows: StatRow[] = [
        { label: 'Name', value: input.name || EMPTY },
        { label: 'Mode', value: input.mode },
        { label: 'Range', value: formatRange(input.dateRange) },
    ]

    if (input.mode === MeetingMode.HOURS) {
        rows.push(
            { label: 'Hours', value: formatHours(input.startHour, input.endHour) },
            { label: 'Timezone', value: input.timezone }
        )
    }

    rows.push({ label: 'Deadline', value: formatDeadline(input.deadline) })

    return rows
}

import type { MeetingCleanDays, MeetingCleanHours } from '../../types'
import type { StatRow } from '@/components/StatCard'
import { formatDate, ymd } from '@/lib/dates'
import { formatHour } from '@/lib/slots'

type MeetingRange = Pick<MeetingCleanDays, 'startDate' | 'endDate' | 'deadline'>

const rangeRow = ({ startDate, endDate }: MeetingRange): StatRow => ({
    label: 'Range',
    value: `${formatDate(ymd(startDate))} — ${formatDate(ymd(endDate))}`,
})

const deadlineRows = ({ deadline }: MeetingRange): StatRow[] => {
    if (!deadline) return []
    return [{ label: 'Respond by', value: formatDate(ymd(deadline)) }]
}

export const getDaysStatRows = (meeting: MeetingCleanDays): StatRow[] => [
    rangeRow(meeting),
    { label: 'Mode', value: meeting.mode },
    ...deadlineRows(meeting),
]

export const getHoursStatRows = (
    meeting: MeetingCleanHours,
    startHour: number,
    endHour: number
): StatRow[] => [
    rangeRow(meeting),
    { label: 'Window', value: `${formatHour(startHour)} — ${formatHour(endHour)}` },
    { label: 'Hours / day', value: String(endHour - startHour) },
    ...deadlineRows(meeting),
]

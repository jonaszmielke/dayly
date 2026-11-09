import { MeetingMode } from '@/generated/prisma/enums'
import { MAX_DAY_MODE_LENGTH_DAYS, MAX_HOUR_MODE_LENGTH_DAYS } from '@/lib/config'

export const MAX_NAME = 48

export const MAX_DAYS_BY_MODE: Record<MeetingMode, number> = {
    [MeetingMode.DAYS]: MAX_DAY_MODE_LENGTH_DAYS,
    [MeetingMode.HOURS]: MAX_HOUR_MODE_LENGTH_DAYS,
}

// HOURS mode adds the hours (04) and timezone (05) sections before the deadline.
export const DEADLINE_SECTION_NUMBER: Record<MeetingMode, string> = {
    [MeetingMode.DAYS]: '04',
    [MeetingMode.HOURS]: '06',
}

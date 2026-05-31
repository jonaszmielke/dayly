import type { Meeting, MeetingMode, Response as PrismaResponse } from '@/generated/prisma/client'

export type Response = Pick<PrismaResponse, 'id' | 'userName' | 'days'>

export type Person = {
    id: number
    name: string
    availSet: Set<string>
    daysCount: number
}

type MeetingCleanBase = Pick<
    Meeting,
    'shortId' | 'name' | 'mode' | 'startDate' | 'endDate' | 'deadline'
>

export type MeetingCleanDays = MeetingCleanBase & {
    mode: Extract<MeetingMode, 'DAYS'>
}
export type MeetingCleanHours = MeetingCleanBase & {
    mode: Extract<MeetingMode, 'HOURS'>
} & Pick<Meeting, 'startHour' | 'endHour' | 'timezone'>

export type MeetingClean = MeetingCleanDays | MeetingCleanHours

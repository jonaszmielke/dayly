import type { Meeting, MeetingMode, Response } from '@/generated/prisma/client'

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

export type ResponseCleanDays = Pick<Response, 'id' | 'days'>

export type ResponseCleanHours = Pick<Response, 'id' | 'hours'>

// Meeting fields a save subaction needs: range + (hours) window + the existing
// response (for renames). Selected once by the saveResponse parent, then dispatched.
export type MeetingForSave = Pick<
    Meeting,
    'id' | 'startDate' | 'endDate' | 'startHour' | 'endHour'
> & {
    responses: { userName: string }[]
}

export type SaveSubactionArgs = {
    meeting: MeetingForSave
    name: string
    newName?: string
    selection: string[]
}

export type SaveResponseResult = { success: boolean; message?: string }

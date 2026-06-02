import { MeetingClean } from '../types'
import { validateMeetingShortId } from '@/lib/code'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { notFound } from 'next/navigation'

export const getMeeting = cache(async (shortId: string): Promise<MeetingClean> => {
    if (!validateMeetingShortId(shortId)) notFound()

    const meeting = await prisma.meeting.findUnique({
        where: { shortId },
        select: {
            shortId: true,
            name: true,
            mode: true,
            startDate: true,
            endDate: true,
            deadline: true,
            startHour: true,
            endHour: true,
            timezone: true,
        },
    })

    if (!meeting) notFound()
    return meeting
})

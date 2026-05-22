import { validateMeetingShortId } from '@/lib/code'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { notFound } from 'next/navigation'

export const getMeeting = cache(async (shortId: string) => {
    if (!validateMeetingShortId(shortId)) notFound()

    const meeting = await prisma.meeting.findUnique({ where: { shortId } })
    if (!meeting) notFound()
    return meeting
})

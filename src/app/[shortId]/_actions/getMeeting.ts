import { prisma } from '@/app/shared/prisma'
import { cache } from 'react'
import { notFound } from 'next/navigation'

export const getMeeting = cache(async (shortId: string) => {
    const meeting = await prisma.meeting.findUnique({ where: { shortId } })

    if (!meeting) notFound()

    return meeting
})

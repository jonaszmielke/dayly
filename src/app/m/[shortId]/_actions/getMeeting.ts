import { cache } from 'react'
import { MOCK_MEETING } from '@/lib/mock'

// Real impl (restore when DB is ready):
// import { prisma } from '@/app/shared/prisma'
// import { notFound } from 'next/navigation'
// export const getMeeting = cache(async (shortId: string) => {
//     const meeting = await prisma.meeting.findUnique({ where: { shortId } })
//     if (!meeting) notFound()
//     return meeting
// })

export const getMeeting = cache(async (_shortId: string) => {
    return MOCK_MEETING
})

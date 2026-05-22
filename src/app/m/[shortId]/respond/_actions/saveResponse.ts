'use server'

import { convertToUtc } from '@/lib/dates'
import { prisma } from '@/lib/prisma'

type SaveResponseProps = {
    meetingShortId: string
    name: string
    newName?: string
    dates: string[]
    edit?: boolean
}

export const saveResponse = async ({
    meetingShortId,
    name,
    newName,
    dates,
    edit = false,
}: SaveResponseProps) => {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { shortId: meetingShortId },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                responses: {
                    where: {
                        userName: name,
                    },
                    select: { id: true, userName: true },
                },
            },
        })

        if (!meeting) return { success: false, message: 'Meeting not found' }
        if (!edit && meeting.responses.length > 0)
            return { success: false, message: 'Response already exists' }

        const formattedDates = dates.map((date) => convertToUtc(new Date(date)))
        const areDatesOutOfRange = formattedDates.some(
            (date) => date < meeting.startDate || date > meeting.endDate
        )

        if (areDatesOutOfRange) return { success: false, message: 'Dates are out of meeting range' }

        await prisma.response.upsert({
            where: {
                meetingId_userName: {
                    meetingId: meeting.id,
                    userName: name,
                },
            },
            update: {
                ...(newName && newName !== meeting.responses[0].userName && { userName: newName }),
                days: formattedDates,
            },
            create: {
                userName: name,
                days: formattedDates,
                meetingId: meeting.id,
            },
            select: { id: true },
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to fetch responses', { error })
        return { success: false, message: 'Failed to fetch responses, please try again later' }
    }
}

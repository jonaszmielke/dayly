'use server'

import { convertToUtc } from '@/lib/dates'
import { prisma } from '@/lib/prisma'

type SaveResponseProps = {
    meetingShortId: string
    name: string
    dates: string[]
}

export const saveResponse = async ({ meetingShortId, name, dates }: SaveResponseProps) => {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { shortId: meetingShortId },
        })

        if (!meeting) return { success: false, message: 'Meeting not found' }

        const formattedDates = dates.map((date) => convertToUtc(new Date(date)))
        const areDatesOutOfRange = formattedDates.some(
            (date) => date < meeting.startDate || date > meeting.endDate
        )

        if (areDatesOutOfRange) return { success: false, message: 'Dates are out of meeting range' }

        const response = await prisma.response.create({
            data: {
                userName: name,
                days: formattedDates,
                meetingId: meeting.id,
            },
            select: { id: true },
        })

        return { success: true, responseId: response.id }
    } catch (error) {
        console.error('Failed to fetch responses', { error })
        return { success: false, message: 'Failed to fetch responses, please try again later' }
    }
}

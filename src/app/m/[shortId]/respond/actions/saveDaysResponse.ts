'use server'

import type { SaveResponseResult, SaveSubactionArgs } from '../../types'
import { convertToUtc } from '@/lib/dates'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

export const saveDaysResponse = async ({
    meeting,
    name,
    newName,
    selection,
}: SaveSubactionArgs): Promise<SaveResponseResult> => {
    const parsed = z.array(isoDate).safeParse(selection)
    if (!parsed.success) return { success: false, message: 'Invalid dates' }

    const formattedDates = parsed.data.map((date) => convertToUtc(new Date(date)))
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
            ...(newName && newName !== meeting.responses[0]?.userName && { userName: newName }),
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
}

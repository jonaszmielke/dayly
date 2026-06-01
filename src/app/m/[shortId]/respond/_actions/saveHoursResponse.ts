'use server'

import type { SaveResponseResult, SaveSubactionArgs } from '../../types'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// slotKey shape: "YYYY-MM-DDTHH" (see slotKey() in @/lib/dates)
const slot = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}$/, 'Invalid slot')

export const saveHoursResponse = async ({
    meeting,
    name,
    newName,
    selection,
}: SaveSubactionArgs): Promise<SaveResponseResult> => {
    const { startHour, endHour } = meeting
    if (startHour == null || endHour == null)
        return { success: false, message: 'Meeting is missing its hour window' }

    const parsed = z.array(slot).safeParse(selection)
    if (!parsed.success) return { success: false, message: 'Invalid slots' }

    const formattedHours: Date[] = []
    for (const key of parsed.data) {
        const date = key.slice(0, 10)
        const hour = Number(key.slice(11, 13))
        const [y, m, d] = date.split('-').map(Number)

        // Day within range (compare at UTC-midnight, like days mode stores dates)
        const dayMidnight = new Date(Date.UTC(y, m - 1, d))
        if (dayMidnight < meeting.startDate || dayMidnight > meeting.endDate)
            return { success: false, message: 'Slots are out of meeting range' }

        // Hour within the meeting window [startHour, endHour)
        if (hour < startHour || hour >= endHour)
            return { success: false, message: 'Slots are out of meeting hours' }

        // Store tz-naive as a UTC instant, mirroring days mode's convertToUtc
        formattedHours.push(new Date(Date.UTC(y, m - 1, d, hour)))
    }

    await prisma.response.upsert({
        where: {
            meetingId_userName: {
                meetingId: meeting.id,
                userName: name,
            },
        },
        update: {
            ...(newName && newName !== meeting.responses[0]?.userName && { userName: newName }),
            hours: formattedHours,
        },
        create: {
            userName: name,
            hours: formattedHours,
            meetingId: meeting.id,
        },
        select: { id: true },
    })

    return { success: true }
}

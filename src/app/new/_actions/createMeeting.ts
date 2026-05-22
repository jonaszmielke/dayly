'use server'

import { generateMeetingId } from '@/lib/code'
import { convertToUtc } from '@/lib/dates'
import { prisma } from '@/lib/prisma'
import { MeetingMode } from '@prisma/client'
import { z } from 'zod'

const MAX_NAME = 48
const YMD = /^\d{4}-\d{2}-\d{2}$/

const createMeetingSchema = z
    .object({
        name: z.string().trim().min(1).max(MAX_NAME),
        mode: z.enum(MeetingMode),
        dateRange: z.object({
            start: z.string().regex(YMD),
            end: z.string().regex(YMD),
        }),
        deadline: z.string().regex(YMD),
    })
    .refine((d) => d.dateRange.start <= d.dateRange.end, {
        message: 'dateRange.start must be <= dateRange.end',
        path: ['dateRange', 'end'],
    })

export type CreateMeetingProps = z.infer<typeof createMeetingSchema>

type CreateMeetingResultSuccess = {
    success: true
    shortId: string
}

type CreateMeetingResultError = {
    success: false
    message: string
}

export const createMeeting = async (
    props: CreateMeetingProps
): Promise<CreateMeetingResultSuccess | CreateMeetingResultError> => {
    const parsed = createMeetingSchema.safeParse(props)
    if (!parsed.success) {
        const first = parsed.error.issues[0]
        return {
            success: false,
            message: first
                ? `Invalid ${first.path.join('.') || 'input'}: ${first.message}`
                : 'Invalid input',
        }
    }

    const { name, dateRange, deadline } = parsed.data
    const meetingId = generateMeetingId()

    try {
        await prisma.meeting.create({
            data: {
                shortId: meetingId,
                name,
                // For now we only support DAYS mode
                // TODO: change when implemented HOURLY mode
                mode: MeetingMode.DAYS,
                startDate: convertToUtc(dateRange.start),
                endDate: convertToUtc(dateRange.end),
                deadline: convertToUtc(deadline),
            },
        })
    } catch (error) {
        console.error('createMeeting: prisma.meeting.create failed', error)
        return {
            success: false,
            message: 'Failed to create meeting. Please try again later',
        }
    }

    return { success: true, shortId: meetingId }
}

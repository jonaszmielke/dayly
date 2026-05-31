'use server'

import { MeetingMode } from '@/generated/prisma/client'
import { generateMeetingId } from '@/lib/code'
import { convertToUtc, isValidTimezone } from '@/lib/dates'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const MAX_NAME = 48
const YMD = /^\d{4}-\d{2}-\d{2}$/

const baseSchema = z.object({
    name: z.string().trim().min(1).max(MAX_NAME),
    dateRange: z.object({
        start: z.string().regex(YMD),
        end: z.string().regex(YMD),
    }),
    deadline: z.string().regex(YMD).optional(),
})

const createMeetingSchema = z
    .discriminatedUnion('mode', [
        baseSchema.extend({ mode: z.literal(MeetingMode.DAYS) }),
        baseSchema.extend({
            mode: z.literal(MeetingMode.HOURS),
            startHour: z.number().int().min(0).max(23),
            endHour: z.number().int().min(1).max(24),
            timezone: z
                .string()
                .refine((tz) => isValidTimezone(tz), { message: 'Invalid timezone' }),
        }),
    ])
    .refine((d) => d.dateRange.start <= d.dateRange.end, {
        message: 'dateRange.start must be <= dateRange.end',
        path: ['dateRange', 'end'],
    })
    .superRefine((d, ctx) => {
        if (d.mode === MeetingMode.HOURS && d.startHour >= d.endHour) {
            ctx.addIssue({
                code: 'custom',
                message: 'startHour must be < endHour',
                path: ['endHour'],
            })
        }
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

    const { name, mode, dateRange, deadline } = parsed.data
    const meetingId = generateMeetingId()

    try {
        await prisma.meeting.create({
            data: {
                shortId: meetingId,
                name,
                mode,
                startDate: convertToUtc(dateRange.start),
                endDate: convertToUtc(dateRange.end),
                deadline: deadline ? convertToUtc(deadline) : undefined,
                ...(mode === MeetingMode.HOURS && {
                    startHour: parsed.data.startHour,
                    endHour: parsed.data.endHour,
                    timezone: parsed.data.timezone,
                }),
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

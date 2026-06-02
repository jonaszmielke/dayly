'use server'

import type { ResponseCleanDays, ResponseCleanHours } from '../../types'
import { MeetingMode } from '@/generated/prisma/client'
import { validateMeetingShortId } from '@/lib/code'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const getUserResponseSchema = z.object({
    meetingShortId: z.string().refine(validateMeetingShortId, 'Invalid meeting code'),
    name: z.string().trim().min(1),
})

export type GetUserResponseProps = z.infer<typeof getUserResponseSchema>

type GetUserResponseSuccess = {
    success: true
    data: ResponseCleanDays | ResponseCleanHours
}

type GetUserResponseError = {
    success: false
    message: string
}

export type GetUserResponseResponse = GetUserResponseSuccess | GetUserResponseError

export const getUserResponse = async (
    props: GetUserResponseProps
): Promise<GetUserResponseResponse> => {
    const parsed = getUserResponseSchema.safeParse(props)
    if (!parsed.success) {
        const first = parsed.error.issues[0]
        return {
            success: false,
            message: first
                ? `Invalid ${first.path.join('.') || 'input'}: ${first.message}`
                : 'Invalid input',
        }
    }

    const { meetingShortId, name } = parsed.data

    try {
        const meeting = await prisma.meeting.findUnique({
            where: {
                shortId: meetingShortId,
            },
            select: {
                mode: true,
                responses: {
                    where: {
                        userName: name,
                    },
                    select: {
                        id: true,
                        days: true,
                        hours: true,
                    },
                },
            },
        })

        if (!meeting) return { success: false, message: 'Meeting not found' }
        if (meeting.responses.length === 0) return { success: false, message: 'Response not found' }

        const { id, days, hours } = meeting.responses[0]
        const data =
            meeting.mode === MeetingMode.HOURS ? { id, hours } : { id, days }

        return { success: true, data }
    } catch (error) {
        console.error('Failed to fetch user response', { error })
        return { success: false, message: 'Failed to fetch user response, please try again later' }
    }
}

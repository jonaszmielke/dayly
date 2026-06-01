'use server'

import type { SaveResponseResult } from '../../types'
import { saveDaysResponse } from './saveDaysResponse'
import { saveHoursResponse } from './saveHoursResponse'
import { MeetingMode } from '@/generated/prisma/client'
import { validateMeetingShortId } from '@/lib/code'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const saveResponseSchema = z.object({
    meetingShortId: z.string().refine(validateMeetingShortId, 'Invalid meeting code'),
    name: z.string().trim().min(3).max(32),
    newName: z.string().trim().min(3).max(32).optional(),
    selection: z.array(z.string()),
    edit: z.boolean().optional().default(false),
})

export type SaveResponseProps = z.input<typeof saveResponseSchema>

export const saveResponse = async (props: SaveResponseProps): Promise<SaveResponseResult> => {
    const parsed = saveResponseSchema.safeParse(props)
    if (!parsed.success) {
        const first = parsed.error.issues[0]
        return {
            success: false,
            message: first
                ? `Invalid ${first.path.join('.') || 'input'}: ${first.message}`
                : 'Invalid input',
        }
    }

    const { meetingShortId, name, newName, selection, edit } = parsed.data

    try {
        const meeting = await prisma.meeting.findUnique({
            where: { shortId: meetingShortId },
            select: {
                id: true,
                mode: true,
                startDate: true,
                endDate: true,
                startHour: true,
                endHour: true,
                responses: {
                    where: { userName: name },
                    select: { userName: true },
                },
            },
        })

        if (!meeting) return { success: false, message: 'Meeting not found' }
        if (!edit && meeting.responses.length > 0)
            return { success: false, message: 'Response already exists' }

        const args = { meeting, name, newName, selection }
        return meeting.mode === MeetingMode.HOURS
            ? saveHoursResponse(args)
            : saveDaysResponse(args)
    } catch (error) {
        console.error('Failed to save response', { error })
        return { success: false, message: 'Failed to save response, please try again later' }
    }
}

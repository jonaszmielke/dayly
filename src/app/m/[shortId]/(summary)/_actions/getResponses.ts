'use server'

import { validateMeetingShortId } from '@/lib/code'
import { prisma } from '@/lib/prisma'
import type { Response } from '@/generated/prisma/client'

type GetResponsesResponseSuccess = {
    success: true
    data: Pick<Response, 'id' | 'userName' | 'days'>[]
}

type GetResponsesResponseError = {
    success: false
    message: string
}

export type GetResponsesResponse = GetResponsesResponseSuccess | GetResponsesResponseError

export const getResponses = async (meetingShortId: string): Promise<GetResponsesResponse> => {
    if (!validateMeetingShortId(meetingShortId))
        return { success: false, message: 'Invalid meeting code' }

    try {
        const responses = await prisma.response.findMany({
            where: {
                meeting: {
                    shortId: meetingShortId,
                },
            },
            orderBy: { createdAt: 'asc' },
            select: { id: true, userName: true, days: true },
        })

        return { success: true, data: responses }
    } catch (error) {
        console.error('Failed to fetch responses', { error })
        return { success: false, message: 'Failed to fetch responses, please try again later' }
    }
}

'use server'

import { prisma } from '@/lib/prisma'
import { Response } from '@prisma/client'

type GetUserResponseProps = {
    meetingShortId: string
    name: string
}

type GetUserResponseSuccess = {
    success: true
    data: Pick<Response, 'id' | 'days'>
}

type GetUserResponseError = {
    success: false
    message: string
}

export type GetUserResponseResponse = GetUserResponseSuccess | GetUserResponseError

export const getUserResponse = async ({
    meetingShortId,
    name,
}: GetUserResponseProps): Promise<GetUserResponseResponse> => {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: {
                shortId: meetingShortId,
            },
            select: {
                responses: {
                    where: {
                        userName: name,
                    },
                    select: {
                        id: true,
                        days: true,
                    },
                },
            },
        })

        if (!meeting) return { success: false, message: 'Meeting not found' }
        if (meeting.responses.length === 0) return { success: false, message: 'Response not found' }

        return { success: true, data: meeting.responses[0] }
    } catch (error) {
        console.error('Failed to fetch user response', { error })
        return { success: false, message: 'Failed to fetch user response, please try again later' }
    }
}

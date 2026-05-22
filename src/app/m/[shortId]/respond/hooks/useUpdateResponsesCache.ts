import { GetResponsesResponse } from '../../(summary)/_actions/getResponses'
import { queryKeys } from '@/lib/queryKeys'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

type ResponsesCache = GetResponsesResponse

export const useUpdateResponsesCache = () => {
    const queryClient = useQueryClient()

    const updateResponsesCache = useCallback(
        ({
            meetingShortId,
            name,
            dates,
        }: {
            meetingShortId: string
            name: string
            dates: string[]
        }) => {
            queryClient.setQueryData<ResponsesCache>(
                [queryKeys.responses, meetingShortId],
                (old) => {
                    const entry = {
                        id: -Date.now(),
                        userName: name,
                        days: dates.map((d) => new Date(d)),
                    }
                    if (!old || !old.success) return { success: true, data: [entry] }
                    return {
                        success: true,
                        data: [...old.data.filter((r) => r.userName !== name), entry],
                    }
                }
            )
        },
        [queryClient]
    )

    return updateResponsesCache
}

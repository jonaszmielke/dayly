import { GetUserResponseResponse } from '../_actions/getUserResponse'
import { GetResponsesResponse } from '../../(summary)/_actions/getResponses'
import { queryKeys } from '@/lib/queryKeys'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

type UpdateResponsesCacheProps = {
    meetingShortId: string
    name: string
    dates: string[]
    edit?: boolean
    originalName?: string
}

export const useUpdateResponsesCache = () => {
    const queryClient = useQueryClient()

    const updateResponsesCache = useCallback(
        ({
            meetingShortId,
            name,
            dates,
            edit = false,
            originalName,
        }: UpdateResponsesCacheProps) => {
            const days = dates.map((d) => new Date(d))
            const id = -Date.now()
            const removeName = edit && originalName ? originalName : name

            queryClient.setQueryData<GetResponsesResponse>(
                [queryKeys.responses, meetingShortId],
                (old) => {
                    const entry = { id, userName: name, days }
                    if (!old || !old.success) return { success: true, data: [entry] }
                    const idx = old.data.findIndex((r) => r.userName === removeName)
                    if (idx === -1) return { success: true, data: [...old.data, entry] }
                    const next = [...old.data]
                    next[idx] = entry
                    return { success: true, data: next }
                }
            )

            queryClient.setQueryData<GetUserResponseResponse>(
                [queryKeys.userSingleResponse, meetingShortId, name],
                { success: true, data: { id, days } }
            )

            if (edit && originalName && originalName !== name) {
                queryClient.removeQueries({
                    queryKey: [queryKeys.userSingleResponse, meetingShortId, originalName],
                })
            }
        },
        [queryClient]
    )

    return updateResponsesCache
}

'use client'

import { type GetUserResponseResponse } from '../actions/getUserResponse'
import { queryKeys } from '@/lib/queryKeys'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

type UpdateHoursResponseCacheProps = {
    meetingShortId: string
    name: string
    slots: string[]
    edit?: boolean
    originalName?: string
}

// slotKey ("YYYY-MM-DDTHH") -> the tz-naive UTC instant getUserResponse returns.
const slotToUtc = (key: string): Date => {
    const [y, m, d] = key.slice(0, 10).split('-').map(Number)
    const hour = Number(key.slice(11, 13))
    return new Date(Date.UTC(y, m - 1, d, hour))
}

export const useUpdateHoursResponseCache = () => {
    const queryClient = useQueryClient()

    return useCallback(
        ({
            meetingShortId,
            name,
            slots,
            edit = false,
            originalName,
        }: UpdateHoursResponseCacheProps) => {
            const hours = slots.map(slotToUtc)
            const id = -Date.now()

            // Typed const instead of an inline literal: react-query >=5.105's NoInfer'd
            // updater param rejects inline union literals under TS 5.9.
            const userResponse: GetUserResponseResponse = { success: true, data: { id, hours } }
            queryClient.setQueryData<GetUserResponseResponse>(
                [queryKeys.userSingleResponse, meetingShortId, name],
                userResponse
            )

            if (edit && originalName && originalName !== name) {
                queryClient.removeQueries({
                    queryKey: [queryKeys.userSingleResponse, meetingShortId, originalName],
                })
            }

            // Summary (responses) cache is days-shaped and owned by the later hours-summary
            // task — just invalidate so it refetches once that view exists.
            void queryClient.invalidateQueries({ queryKey: [queryKeys.responses, meetingShortId] })
        },
        [queryClient]
    )
}

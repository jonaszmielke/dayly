'use client'

import { getResponses } from '../_actions/getResponses'
import { useQuery } from '@tanstack/react-query'

export const useResponses = (meetingShortId: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['responses', meetingShortId],
        queryFn: () => getResponses(meetingShortId),
    })

    const responses = data?.success ? data.data : []

    return { responses, isLoading, isError, refetch }
}

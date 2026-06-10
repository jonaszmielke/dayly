'use client'

import { getResponses } from '../_actions/getResponses'
import { useActionQuery } from '@/hooks/useActionQuery'
import { queryKeys } from '@/lib/queryKeys'

export const useResponses = (meetingShortId: string) => {
    const { data, isLoading, isError, refetch } = useActionQuery({
        queryKey: [queryKeys.responses, meetingShortId],
        queryFn: () => getResponses(meetingShortId),
    })

    return { responses: data?.data ?? [], isLoading, isError, refetch }
}

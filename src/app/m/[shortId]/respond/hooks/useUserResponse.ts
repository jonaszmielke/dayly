'use client'

import { getUserResponse } from '../_actions/getUserResponse'
import { queryKeys } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'

type UseUserResponseProps = {
    meetingShortId: string
    name?: string
}

export const useUserResponse = ({ meetingShortId, name }: UseUserResponseProps) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: [queryKeys.userSingleResponse, meetingShortId, name],
        queryFn: () => getUserResponse({ meetingShortId, name: name! }),
        staleTime: 5 * 60 * 1000,
        enabled: !!name,
    })

    return { userResponse: data?.success ? data.data : null, isLoading, isError }
}

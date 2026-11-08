'use client'

import { useUserResponse } from './useUserResponse'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export type UserResponse = ReturnType<typeof useUserResponse>['userResponse']

type UseEditTargetOptions = {
    meetingShortId: string
    /** Turns the loaded response into selection keys. Define it outside the component so it stays stable. */
    toKeys: (response: UserResponse) => string[] | undefined
}

/** Reads `?edit=<name>` and loads that person's response as selection keys. */
export const useEditTarget = ({ meetingShortId, toKeys }: UseEditTargetOptions) => {
    const editOriginalName = useSearchParams().get('edit') ?? undefined

    const { userResponse, isLoading } = useUserResponse({
        meetingShortId,
        name: editOriginalName,
    })

    const originalKeys = useMemo(() => toKeys(userResponse), [toKeys, userResponse])

    return {
        /** Set when editing an existing response. */
        editOriginalName,
        /** The edited response's keys; `undefined` when not editing or not loaded yet. */
        originalKeys,
        isLoading: !!editOriginalName && isLoading,
    }
}

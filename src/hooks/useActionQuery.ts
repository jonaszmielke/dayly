'use client'

import { useToast } from '@/components/Toast'
import { DEFAULT_ERROR_MESSAGE } from '@/lib/config'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useEffect } from 'react'

type ActionResult = { success: boolean; message?: string }

type UseActionQueryArgs<TRes extends ActionResult> = Omit<
    UseQueryOptions<Extract<TRes, { success: true }>, Error>,
    'queryFn'
> & {
    queryFn: () => Promise<TRes>
    /** Show a toast when the action resolves success:false / the fetch throws. Default true. */
    toastOnError?: boolean
}

/**
 * Query twin of `useActionMutation`. Wraps `useQuery` for server actions that
 * *return* `{ success, message }` instead of throwing: rethrows on `success:false`
 * so `isError` fires, narrows `data` to `success:true` for callers, and (unless
 * `toastOnError: false`) toasts the message. v5 dropped `useQuery.onError`, so the
 * toast fires from an effect on `query.error`. Any other `useQuery` option
 * (`staleTime`, `enabled`, `retry`, …) passes straight through.
 */
export const useActionQuery = <TRes extends ActionResult>({
    queryFn,
    toastOnError = true,
    ...options
}: UseActionQueryArgs<TRes>) => {
    const { error } = useToast()
    const query = useQuery({
        ...options,
        queryFn: async () => {
            const res = await queryFn()
            if (!res.success) throw new Error(res.message ?? DEFAULT_ERROR_MESSAGE)
            return res as Extract<TRes, { success: true }>
        },
    })

    useEffect(() => {
        if (!toastOnError || !query.error) return
        error(query.error instanceof Error ? query.error.message : DEFAULT_ERROR_MESSAGE)
    }, [query.error, toastOnError, error])

    return query
}

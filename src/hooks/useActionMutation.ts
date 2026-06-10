'use client'

import { useToast } from '@/components/Toast'
import { DEFAULT_ERROR_MESSAGE } from '@/lib/config'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

type ActionResult = { success: boolean; message?: string }

type UseActionMutationArgs<TRes extends ActionResult, TVars> = Omit<
    UseMutationOptions<Extract<TRes, { success: true }>, Error, TVars>,
    'mutationFn' | 'onSuccess'
> & {
    mutationFn: (vars: TVars) => Promise<TRes>
    onSuccess?: (res: Extract<TRes, { success: true }>, vars: TVars) => void
}

/**
 * Wraps `useMutation` for server actions that *return* `{ success, message }`
 * instead of throwing. Rethrows on `success: false` so `onError` fires (covering
 * both action guards and real 4xx/5xx), and shows the message as a toast.
 *
 * `onSuccess` receives the result narrowed to `success: true`, so callers skip the
 * redundant check. `TVars` defaults to `void` so no-arg actions stay callable via
 * `mutate()`. The toast always fires; a caller-supplied `onError` runs after it,
 * additively. Any other `useMutation` option (`onSettled`, `gcTime`, `retry`, …)
 * passes straight through.
 */
export const useActionMutation = <TRes extends ActionResult, TVars = void>({
    mutationFn,
    onSuccess,
    onError,
    ...options
}: UseActionMutationArgs<TRes, TVars>) => {
    const { error } = useToast()
    return useMutation({
        ...options,
        mutationFn: async (vars: TVars) => {
            const res = await mutationFn(vars)
            if (!res.success) throw new Error(res.message ?? DEFAULT_ERROR_MESSAGE)
            return res as Extract<TRes, { success: true }>
        },
        onSuccess,
        // Toast always fires; a caller-supplied onError runs after, additively.
        onError: (...args) => {
            const [e] = args
            error(e instanceof Error ? e.message : DEFAULT_ERROR_MESSAGE)
            onError?.(...args)
        },
    })
}

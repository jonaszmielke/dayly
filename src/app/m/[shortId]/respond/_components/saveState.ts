export type SaveState = 'idle' | 'pending' | 'success'

export const SAVE_LABELS: Record<SaveState, string> = {
    idle: 'SAVE',
    pending: 'SAVING…',
    success: '✓ SAVED',
}

export const getSaveState = ({
    isPending,
    isSuccess,
}: {
    isPending: boolean
    isSuccess: boolean
}): SaveState => {
    if (isPending) return 'pending'
    if (isSuccess) return 'success'
    return 'idle'
}

import { cn } from '@/lib/utils'

type SubmitState = 'ready' | 'blocked'

const SUBMIT_STATE_CLASSES: Record<SubmitState, string> = {
    ready: 'bg-mocha text-paper-2 hover:bg-mocha-dark',
    blocked: 'bg-paper-2 text-ink/30 cursor-not-allowed',
}

type SubmitButtonProps = {
    canSubmit: boolean
    onSubmit: () => void
}

export const SubmitButton = ({ canSubmit, onSubmit }: SubmitButtonProps) => {
    const state: SubmitState = canSubmit ? 'ready' : 'blocked'

    return (
        <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
                'w-full py-5 border-brutal shadow-brutal',
                'font-sans text-[22px] font-bold uppercase tracking-[0.04em]',
                'transition-[transform,box-shadow,background-color,color] press-effect-mocha',
                SUBMIT_STATE_CLASSES[state]
            )}
        >
            Create Survey →
        </button>
    )
}

'use client'

import { cn } from '@/lib/utils'

type MobileActionBarProps = {
    count: number
    onReset: () => void
    onSave: () => void
    saveLabel: string
    canReset: boolean
    saveState: 'idle' | 'pending' | 'success'
}

export const MobileActionBar = ({
    count,
    onReset,
    onSave,
    saveLabel,
    canReset,
    saveState,
}: MobileActionBarProps) => {
    return (
        <div
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden mx-auto max-w-[430px] bg-paper border-t-[2.5px] border-ink grid grid-cols-[auto_1fr_auto] gap-2.5 px-2.5 pt-2.5"
            style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
        >
            {/* Days picked counter */}
            <div className="bg-ink text-paper-2 grid grid-cols-[auto_auto] items-center gap-2 px-3 py-2">
                <span
                    className="font-sans font-extrabold leading-[0.9] tracking-tighter tabular-nums"
                    style={{ fontSize: '30px' }}
                >
                    {String(count).padStart(2, '0')}
                </span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-paper/70 leading-tight">
                    DAYS PICKED
                </span>
            </div>

            {/* Reset */}
            <button
                onClick={onReset}
                disabled={!canReset}
                className="py-2 px-3 bg-white border-brutal shadow-brutal-sm font-sans text-[12px] font-bold uppercase tracking-[0.06em] press-effect disabled:opacity-40 disabled:cursor-not-allowed"
            >
                RESET
            </button>

            {/* Save */}
            <button
                onClick={onSave}
                disabled={saveState !== 'idle'}
                className={cn(
                    'py-2 px-4 border-brutal font-sans text-[12px] font-bold uppercase tracking-[0.06em] press-effect-mocha transition-all',
                    saveState === 'success'
                        ? 'bg-mocha-dark text-paper-2 shadow-brutal'
                        : 'bg-mocha text-paper-2 shadow-brutal disabled:opacity-40 disabled:cursor-not-allowed'
                )}
            >
                {saveLabel}
            </button>
        </div>
    )
}

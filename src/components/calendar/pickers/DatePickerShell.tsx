'use client'

import { ResponsivePopover } from './ResponsivePopover'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

type DatePickerShellProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Committed value shown on the trigger; the placeholder is shown when it's null. */
    displayText: string | null
    placeholder: string
    /** Small line under the trigger. */
    subtext: string
    /** Left side of the footer: the pending selection or a hint. */
    summary: ReactNode
    /** Optional line under the footer row. */
    note?: ReactNode
    canApply: boolean
    onApply: () => void
    onReset: () => void
    /** The calendar. */
    children: ReactNode
}

/** Trigger, popover and Reset/Apply footer shared by the date pickers. */
export const DatePickerShell = ({
    open,
    onOpenChange,
    displayText,
    placeholder,
    subtext,
    summary,
    note,
    canApply,
    onApply,
    onReset,
    children,
}: DatePickerShellProps) => (
    <ResponsivePopover
        open={open}
        onOpenChange={onOpenChange}
        triggerClassName={cn(
            'w-full text-left border-brutal shadow-brutal bg-white transition-all',
            open && 'bg-paper shadow-brutal-mocha'
        )}
        triggerStyle={{ padding: '18px 48px 18px 16px' }}
        subtext={subtext}
        trigger={<TriggerLabel displayText={displayText} placeholder={placeholder} />}
    >
        {children}
        <div className="flex flex-col gap-1.5 p-4 border-t border-ink">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex-1 flex items-center gap-2 font-mono text-[12px] flex-wrap">
                    {summary}
                </div>
                <button
                    type="button"
                    onClick={onReset}
                    className="px-3 py-1.5 border-thin font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-paper transition-colors"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onApply}
                    disabled={!canApply}
                    className="px-4 py-1.5 bg-mocha text-paper-2 border-brutal shadow-brutal-sm font-mono text-[11px] uppercase tracking-[0.08em] disabled:opacity-40 hover:bg-mocha-dark transition-colors press-effect"
                >
                    Apply
                </button>
            </div>
            {note}
        </div>
    </ResponsivePopover>
)

const TriggerLabel = ({
    displayText,
    placeholder,
}: {
    displayText: string | null
    placeholder: string
}) => (
    <div className="relative">
        <span
            className={cn(
                'font-sans font-bold text-[22px] uppercase',
                !displayText && 'text-ink/30'
            )}
        >
            {displayText ?? placeholder}
        </span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-ink/50">▾</span>
    </div>
)

/** Dark label chip in the footer summary, e.g. "FROM" or "DEADLINE". */
export const PickerChip = ({ children }: { children: ReactNode }) => (
    <span className="bg-ink text-paper-2 font-mono text-[11px] px-1.5 py-0.5 uppercase tracking-widest">
        {children}
    </span>
)

/** A picked date in the footer summary. */
export const PickerValue = ({ children }: { children: ReactNode }) => (
    <span className="font-bold text-ink">{children}</span>
)

/** Instruction shown in the footer summary while nothing is complete yet. */
export const PickerHint = ({ children }: { children: ReactNode }) => (
    <span className="text-ink/50 uppercase tracking-[0.08em]">{children}</span>
)

/** Secondary line under the footer row. */
export const PickerNote = ({ children }: { children: ReactNode }) => (
    <div className="font-mono text-[11px] text-ink/55 uppercase tracking-[0.08em]">{children}</div>
)

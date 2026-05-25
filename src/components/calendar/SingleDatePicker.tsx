'use client'

import { DPMonth } from './DPMonth'
import { ResponsivePopover } from './ResponsivePopover'
import { daysBetweenInclusive, DOW_ABBREVIATIONS, formatDate, parseISO, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type SingleDatePickerProps = {
    value: string | null
    onChange: (v: string) => void
    placeholder?: string
    minDate?: string
    label?: string
}

const formatDateWithDow = (iso: string): string => {
    const d = parseISO(iso)
    return `${DOW_ABBREVIATIONS[d.getDay()]} ${formatDate(iso)}`
}

export const SingleDatePicker = ({
    value,
    onChange,
    placeholder = 'SELECT DATE',
    minDate,
    label = 'DEADLINE',
}: SingleDatePickerProps) => {
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState<string | null>(value)

    const current = open ? pending : value

    const handlePick = (iso: string) => {
        setPending(iso)
    }

    const handleApply = () => {
        if (pending) {
            onChange(pending)
            setOpen(false)
        }
    }

    const handleReset = () => {
        setPending(null)
    }

    const handleOpenChange = (next: boolean) => {
        if (next) setPending(value)
        setOpen(next)
    }

    const today = ymd(new Date())
    const subtext = value ? `${daysBetweenInclusive(today, value)} DAYS FROM TODAY` : 'SINGLE DATE'

    return (
        <ResponsivePopover
            open={open}
            onOpenChange={handleOpenChange}
            triggerClassName={cn(
                'w-full text-left border-brutal shadow-brutal bg-white transition-all',
                open && 'bg-paper shadow-brutal-mocha'
            )}
            triggerStyle={{ padding: '18px 48px 18px 16px' }}
            subtext={subtext}
            trigger={
                <div className="relative">
                    <span
                        className={cn(
                            'font-sans font-bold text-[22px] uppercase',
                            !value && 'text-ink/30'
                        )}
                    >
                        {value ? formatDateWithDow(value) : placeholder}
                    </span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-ink/50">
                        ▾
                    </span>
                </div>
            }
        >
            <DPMonth
                mode="single"
                value={current}
                rangeValue={{ start: null, end: null }}
                onPick={handlePick}
                minDate={minDate}
            />
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3 p-4 border-t border-ink">
                <div className="flex-1 flex items-center gap-2 font-mono text-[12px] flex-wrap">
                    {current ? (
                        <>
                            <span className="bg-ink text-paper-2 font-mono text-[11px] px-1.5 py-0.5 uppercase tracking-widest">
                                {label}
                            </span>
                            <span className="font-bold text-ink">{formatDateWithDow(current)}</span>
                        </>
                    ) : (
                        <span className="text-ink/50 uppercase tracking-[0.08em]">Pick a date</span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 border-thin font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-paper transition-colors"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={!pending}
                    className="px-4 py-1.5 bg-mocha text-paper-2 border-brutal shadow-brutal-sm font-mono text-[11px] uppercase tracking-[0.08em] disabled:opacity-40 hover:bg-mocha-dark transition-colors press-effect"
                >
                    Apply
                </button>
            </div>
        </ResponsivePopover>
    )
}

'use client'

import { DPMonth } from './DPMonth'
import { daysBetweenInclusive, formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Popover } from '@base-ui/react/popover'
import { useState } from 'react'

type DateRangeValue = {
    start: string | null
    end: string | null
}

type DateRangePickerProps = {
    value: DateRangeValue
    onChange: (v: DateRangeValue) => void
    placeholder?: string
    minDate?: string
}

export const DateRangePicker = ({
    value,
    onChange,
    placeholder = 'SELECT DATE RANGE',
    minDate,
}: DateRangePickerProps) => {
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState<DateRangeValue>({ start: null, end: null })
    const [hoverIso, setHoverIso] = useState<string | null>(null)

    const current = open ? pending : value

    const handlePick = (iso: string) => {
        if (!pending.start || (pending.start && pending.end)) {
            setPending({ start: iso, end: null })
        } else {
            const s = pending.start <= iso ? pending.start : iso
            const e = pending.start <= iso ? iso : pending.start
            setPending({ start: s, end: e })
        }
    }

    const handleApply = () => {
        if (pending.start && pending.end) {
            onChange(pending)
            setOpen(false)
        }
    }

    const handleReset = () => {
        setPending({ start: null, end: null })
        onChange({ start: null, end: null })
    }

    const displayText =
        value.start && value.end ? `${formatDate(value.start)} — ${formatDate(value.end)}` : null

    const subtext =
        value.start && value.end
            ? `${daysBetweenInclusive(value.start, value.end)} DAYS IN RANGE`
            : 'TWO CLICKS — START, THEN END'

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                className={cn(
                    'w-full text-left border-brutal shadow-brutal bg-white transition-all',
                    open && 'bg-paper shadow-brutal-mocha'
                )}
                style={{ padding: '18px 48px 18px 16px' }}
            >
                <div className="relative">
                    <span
                        className={cn(
                            'font-sans font-bold text-[22px] uppercase',
                            !displayText && 'text-ink/30'
                        )}
                    >
                        {displayText || placeholder}
                    </span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-ink/50">
                        ▾
                    </span>
                </div>
            </Popover.Trigger>
            <div className="mt-1 pl-2 font-mono text-[11px] text-ink/55 uppercase tracking-[0.08em]">
                {subtext}
            </div>

            <Popover.Portal>
                <Popover.Positioner align="center" sideOffset={10}>
                    <Popover.Popup className="z-50 w-[540px] bg-white border-brutal shadow-brutal">
                        <DPMonth
                            mode="range"
                            value={null}
                            rangeValue={current}
                            onPick={handlePick}
                            minDate={minDate}
                            hoverIso={hoverIso}
                            onHoverIso={setHoverIso}
                        />
                        <div className="flex flex-col gap-1.5 p-4 border-t border-ink">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 font-mono text-[12px]">
                                    {current.start && current.end && (
                                        <>
                                            <span className="bg-ink text-paper-2 font-mono text-[11px] px-1.5 py-0.5 uppercase tracking-widest">
                                                FROM
                                            </span>
                                            <span className="font-bold text-ink">
                                                {formatDate(current.start)}
                                            </span>
                                            <span className="text-ink/50">→</span>
                                            <span className="bg-ink text-paper-2 font-mono text-[11px] px-1.5 py-0.5 uppercase tracking-widest">
                                                TO
                                            </span>
                                            <span className="font-bold text-ink">
                                                {formatDate(current.end)}
                                            </span>
                                        </>
                                    )}
                                    {current.start && !current.end && (
                                        <span className="text-ink/50 uppercase tracking-[0.08em]">
                                            Pick end date
                                        </span>
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
                                    disabled={!pending.start || !pending.end}
                                    className="px-4 py-1.5 bg-mocha text-paper-2 border-brutal shadow-brutal-sm font-mono text-[11px] uppercase tracking-[0.08em] disabled:opacity-40 hover:bg-mocha-dark transition-colors press-effect"
                                >
                                    Apply
                                </button>
                            </div>
                            {current.start && current.end && (
                                <div className="font-mono text-[11px] text-ink/55 uppercase tracking-[0.08em]">
                                    · {daysBetweenInclusive(current.start, current.end)} DAYS
                                </div>
                            )}
                        </div>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}

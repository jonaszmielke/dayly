'use client'

import { useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { DPMonth } from './DPMonth'
import { formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface DateRangeValue {
    start: string | null
    end: string | null
}

interface DateRangePickerProps {
    value: DateRangeValue
    onChange: (v: DateRangeValue) => void
    placeholder?: string
    minDate?: string
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = 'SELECT DATE RANGE',
    minDate,
}: DateRangePickerProps) {
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
        value.start && value.end
            ? `${formatDate(value.start)} — ${formatDate(value.end)}`
            : null

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                className={cn(
                    'w-full text-left border-brutal shadow-brutal bg-white transition-all',
                    open && 'bg-paper shadow-brutal-mocha',
                )}
                style={{ padding: '14px 48px 14px 16px' }}
            >
                <div className="relative">
                    <span
                        className={cn(
                            'font-sans font-bold text-[18px]',
                            !displayText && 'text-ink/30',
                        )}
                    >
                        {displayText || placeholder}
                    </span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-ink/50">
                        ▾
                    </span>
                </div>
                {displayText && (
                    <div className="font-mono text-[10.5px] text-ink/50 mt-0.5 uppercase tracking-[0.08em]">
                        DATE RANGE
                    </div>
                )}
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Positioner align="start" sideOffset={10}>
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
                        <div className="flex items-center gap-3 p-4 border-t border-ink/10">
                            <div className="flex-1 font-mono text-[12px] text-ink/50">
                                {current.start && !current.end && (
                                    <span>Pick end date</span>
                                )}
                                {current.start && current.end && (
                                    <span className="font-bold text-ink">
                                        {formatDate(current.start)} → {formatDate(current.end)}
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
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}

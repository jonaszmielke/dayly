'use client'

import { DPMonth } from './DPMonth'
import { formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Popover } from '@base-ui/react/popover'
import { useState } from 'react'

type SingleDatePickerProps = {
    value: string | null
    onChange: (v: string) => void
    placeholder?: string
    minDate?: string
    label?: string
}

export const SingleDatePicker = ({
    value,
    onChange,
    placeholder = 'SELECT DATE',
    minDate,
    label,
}: SingleDatePickerProps) => {
    const [open, setOpen] = useState(false)

    const handlePick = (iso: string) => {
        onChange(iso)
        setOpen(false)
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                className={cn(
                    'w-full text-left border-brutal shadow-brutal bg-white transition-all',
                    open && 'bg-paper shadow-brutal-mocha'
                )}
                style={{ padding: '14px 48px 14px 16px' }}
            >
                <div className="relative">
                    <span
                        className={cn('font-sans font-bold text-[18px]', !value && 'text-ink/30')}
                    >
                        {formatDate(value) || placeholder}
                    </span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-ink/50">
                        ▾
                    </span>
                </div>
                {label && (
                    <div className="font-mono text-[10.5px] text-ink/50 mt-0.5 uppercase tracking-[0.08em]">
                        {label}
                    </div>
                )}
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Positioner align="start" sideOffset={10}>
                    <Popover.Popup className="z-50 w-[360px] bg-white border-brutal shadow-brutal">
                        <DPMonth
                            mode="single"
                            value={value}
                            rangeValue={{ start: null, end: null }}
                            onPick={handlePick}
                            minDate={minDate}
                        />
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}

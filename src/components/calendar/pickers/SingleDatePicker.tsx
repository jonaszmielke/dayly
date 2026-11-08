'use client'

import { DatePickerShell, PickerChip, PickerHint, PickerValue } from './DatePickerShell'
import { MonthPicker } from './MonthPicker'
import { useToday } from '@/hooks/useToday'
import { daysBetween, DOW_ABBREVIATIONS, formatDate, parseISO } from '@/lib/dates'
import { useState } from 'react'

type SingleDatePickerProps = {
    value: string | null
    onChange: (v: string) => void
    placeholder?: string
    minDate?: string
    label?: string
}

const NO_RANGE = { start: null, end: null }

const formatDateWithDow = (iso: string): string => {
    // DOW_ABBREVIATIONS starts on Monday; getDay() starts on Sunday.
    const mondayFirstIndex = (parseISO(iso).getDay() + 6) % 7
    return `${DOW_ABBREVIATIONS[mondayFirstIndex]} ${formatDate(iso)}`
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
    const today = useToday()

    const current = open ? pending : value

    const handleApply = () => {
        if (!pending) return
        onChange(pending)
        setOpen(false)
    }

    const handleOpenChange = (next: boolean) => {
        if (next) setPending(value)
        setOpen(next)
    }

    return (
        <DatePickerShell
            open={open}
            onOpenChange={handleOpenChange}
            displayText={value && formatDateWithDow(value)}
            placeholder={placeholder}
            subtext={getSubtext(today, value)}
            summary={<SingleSummary value={current} label={label} />}
            canApply={!!pending}
            onApply={handleApply}
            onReset={() => setPending(null)}
        >
            <MonthPicker
                mode="single"
                value={current}
                rangeValue={NO_RANGE}
                onPick={setPending}
                minDate={minDate}
            />
        </DatePickerShell>
    )
}

const getSubtext = (today: string | null, value: string | null): string => {
    // `today` is null until hydration (see useToday).
    if (!value || !today) return 'SINGLE DATE'
    const days = daysBetween(today, value)
    if (days === 0) return 'TODAY'
    if (days === 1) return '1 DAY FROM TODAY'
    return `${days} DAYS FROM TODAY`
}

const SingleSummary = ({ value, label }: { value: string | null; label: string }) => {
    if (!value) return <PickerHint>Pick a date</PickerHint>
    return (
        <>
            <PickerChip>{label}</PickerChip>
            <PickerValue>{formatDateWithDow(value)}</PickerValue>
        </>
    )
}

'use client'

import { DatePickerShell, PickerChip, PickerHint, PickerNote, PickerValue } from './DatePickerShell'
import { MonthPicker } from './MonthPicker'
import { addDays, daysBetweenInclusive, formatDate } from '@/lib/dates'
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
    maxDays?: number
}

const EMPTY_RANGE: DateRangeValue = { start: null, end: null }

/** The later of two ISO dates; either may be missing. */
const laterDate = (a?: string, b?: string): string | undefined => {
    if (!a) return b
    if (!b) return a
    return a > b ? a : b
}

/**
 * Mid-selection (start picked, end pending): the window of `maxDays` around the start,
 * so an over-long range can't be built.
 */
const getSelectionWindow = (range: DateRangeValue, maxDays?: number) => {
    if (!range.start || range.end || !maxDays) return undefined
    return {
        min: addDays(range.start, -(maxDays - 1)),
        max: addDays(range.start, maxDays - 1),
    }
}

/** Trigger text for the committed range. */
const getTriggerText = ({ start, end }: DateRangeValue) => {
    if (!start || !end) return { displayText: null, subtext: 'TWO CLICKS — START, THEN END' }
    return {
        displayText: `${formatDate(start)} — ${formatDate(end)}`,
        subtext: `${daysBetweenInclusive(start, end)} DAYS IN RANGE`,
    }
}

export const DateRangePicker = ({
    value,
    onChange,
    placeholder = 'SELECT DATE RANGE',
    minDate,
    maxDays,
}: DateRangePickerProps) => {
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState<DateRangeValue>(EMPTY_RANGE)
    const [hoverIso, setHoverIso] = useState<string | null>(null)

    const current = open ? pending : value
    const selectionWindow = getSelectionWindow(current, maxDays)

    const handlePick = (iso: string) => {
        if (!pending.start || pending.end) {
            setPending({ start: iso, end: null })
            return
        }
        const [start, end] = pending.start <= iso ? [pending.start, iso] : [iso, pending.start]
        setPending({ start, end })
    }

    const handleApply = () => {
        if (!pending.start || !pending.end) return
        onChange(pending)
        setOpen(false)
    }

    const handleReset = () => {
        setPending(EMPTY_RANGE)
        onChange(EMPTY_RANGE)
    }

    // Sync pending from the committed value on open so external resets
    // (e.g. parent clearing the range on mode change) take effect.
    const handleOpenChange = (next: boolean) => {
        if (next) setPending(value)
        setOpen(next)
    }

    const { displayText, subtext } = getTriggerText(value)

    return (
        <DatePickerShell
            open={open}
            onOpenChange={handleOpenChange}
            displayText={displayText}
            placeholder={placeholder}
            subtext={subtext}
            summary={<RangeSummary range={current} />}
            note={<RangeLength range={current} />}
            canApply={!!pending.start && !!pending.end}
            onApply={handleApply}
            onReset={handleReset}
        >
            <MonthPicker
                mode="range"
                value={null}
                rangeValue={current}
                onPick={handlePick}
                minDate={laterDate(selectionWindow?.min, minDate)}
                maxDate={selectionWindow?.max}
                hoverIso={hoverIso}
                onHoverIso={setHoverIso}
            />
        </DatePickerShell>
    )
}

const RangeSummary = ({ range: { start, end } }: { range: DateRangeValue }) => {
    if (start && end)
        return (
            <>
                <PickerChip>FROM</PickerChip>
                <PickerValue>{formatDate(start)}</PickerValue>
                <span className="text-ink/50">→</span>
                <PickerChip>TO</PickerChip>
                <PickerValue>{formatDate(end)}</PickerValue>
            </>
        )
    if (start) return <PickerHint>Pick end date</PickerHint>
    return null
}

const RangeLength = ({ range: { start, end } }: { range: DateRangeValue }) => {
    if (!start || !end) return null
    return <PickerNote>· {daysBetweenInclusive(start, end)} DAYS</PickerNote>
}

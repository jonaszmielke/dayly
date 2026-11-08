'use client'

import { useToday } from '@/hooks/useToday'
import {
    addMonths,
    DOW_ABBREVIATIONS,
    formatDateLong,
    GridCell,
    monthGrid,
    monthName,
} from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type MonthPickerProps = {
    mode: 'single' | 'range'
    value: string | null
    rangeValue: { start: string | null; end: string | null }
    onPick: (iso: string) => void
    minDate?: string
    maxDate?: string
    hoverIso?: string | null
    onHoverIso?: (iso: string | null) => void
    initialMonth?: { year: number; month: number }
}

export const MonthPicker = ({
    mode,
    value,
    rangeValue,
    onPick,
    minDate,
    maxDate,
    hoverIso,
    onHoverIso,
    initialMonth,
}: MonthPickerProps) => {
    const today = useToday()
    const [{ year, month }, setYM] = useState(() => {
        if (initialMonth) return initialMonth
        const seed = mode === 'single' ? value || today : rangeValue.start || today
        const d = new Date(seed + 'T00:00:00')
        return { year: d.getFullYear(), month: d.getMonth() }
    })

    const cells = monthGrid(year, month)

    const prev = () => setYM((ym) => addMonths(ym.year, ym.month, -1))
    const next = () => setYM((ym) => addMonths(ym.year, ym.month, 1))

    return (
        <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center px-3.5 py-3.5 border-b-2 border-ink">
                <button
                    type="button"
                    onClick={prev}
                    className="flex items-center justify-center w-9 h-9 border-2 border-ink font-sans text-[14px] font-bold hover:bg-mocha hover:text-paper-2 transition-colors"
                >
                    &lt;
                </button>
                <div className="text-center font-sans text-[18px] font-bold uppercase tracking-wider">
                    {monthName(month)} <span className="font-mono text-ink/55">{year}</span>
                </div>
                <button
                    type="button"
                    onClick={next}
                    className="flex items-center justify-center w-9 h-9 border-2 border-ink font-sans text-[14px] font-bold hover:bg-mocha hover:text-paper-2 transition-colors"
                >
                    &gt;
                </button>
            </div>

            {/* DOW */}
            <div className="grid grid-cols-7 bg-paper">
                {DOW_ABBREVIATIONS.map((d, i) => (
                    <div
                        key={d}
                        className={cn(
                            'py-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-ink/50 border border-ink',
                            i >= 5 && 'bg-paper-shade'
                        )}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7">
                {cells.map((cell) => (
                    <Cell
                        key={cell.date}
                        cell={cell}
                        mode={mode}
                        value={value}
                        rangeValue={rangeValue}
                        onPick={onPick}
                        minDate={minDate}
                        maxDate={maxDate}
                        hoverIso={hoverIso}
                        onHoverIso={onHoverIso}
                    />
                ))}
            </div>
        </div>
    )
}

type CellState = 'disabled' | 'endpoint' | 'inRange' | 'outside' | 'default'

type CellFlags = {
    disabled: boolean
    endpoint: boolean
    inRange: boolean
    inMonth: boolean
}

// Order = visual priority: a cell shows exactly one state, the first that matches.
const getCellState = ({ disabled, endpoint, inRange, inMonth }: CellFlags): CellState => {
    if (disabled) return 'disabled'
    if (endpoint) return 'endpoint'
    if (inRange) return 'inRange'
    if (!inMonth) return 'outside'
    return 'default'
}

const CELL_BASE_CLASSES =
    'relative flex items-center justify-center h-14 font-mono text-[13px] cursor-pointer select-none border border-ink transition-all'

const CELL_STATE_CLASSES: Record<CellState, string> = {
    disabled: 'bg-hatch-light cursor-not-allowed text-ink/30',
    endpoint: 'bg-ink text-paper-2 inset-ring-3 inset-ring-mocha',
    inRange: 'bg-paper-range hover:bg-paper-shade',
    outside: 'bg-paper-2 text-ink/30',
    default: 'hover:bg-paper-range',
}

const isInRange = (
    iso: string,
    { mode, rangeValue, hoverIso }: Pick<MonthPickerProps, 'mode' | 'rangeValue' | 'hoverIso'>
): boolean => {
    if (mode !== 'range') return false
    const { start, end } = rangeValue
    if (start && end) return iso >= start && iso <= end
    if (start && !end && hoverIso) {
        const s = start <= hoverIso ? start : hoverIso
        const e = start <= hoverIso ? hoverIso : start
        return iso >= s && iso <= e
    }
    return false
}

const isEndpoint = (
    iso: string,
    { mode, value, rangeValue }: Pick<MonthPickerProps, 'mode' | 'value' | 'rangeValue'>
): boolean => {
    if (mode === 'single') return iso === value
    const { start, end } = rangeValue
    if (start && end) return iso === start || iso === end
    if (start && !end) return iso === start
    return false
}

const isDisabled = (
    iso: string,
    { minDate, maxDate }: Pick<MonthPickerProps, 'minDate' | 'maxDate'>
): boolean => {
    if (minDate && iso < minDate) return true
    if (maxDate && iso > maxDate) return true
    return false
}

type CellProps = {
    cell: GridCell
} & Omit<MonthPickerProps, 'initialMonth'>

const Cell = ({ cell, onPick, onHoverIso, ...picker }: CellProps) => {
    const disabled = isDisabled(cell.date, picker)
    const state = getCellState({
        disabled,
        endpoint: isEndpoint(cell.date, picker),
        inRange: isInRange(cell.date, picker),
        inMonth: cell.inMonth,
    })

    return (
        <button
            type="button"
            disabled={disabled}
            aria-label={formatDateLong(cell.date)}
            aria-pressed={state === 'endpoint'}
            data-state={state}
            className={cn(CELL_BASE_CLASSES, CELL_STATE_CLASSES[state])}
            onClick={() => onPick(cell.date)}
            onMouseEnter={() => onHoverIso?.(cell.date)}
            onMouseLeave={() => onHoverIso?.(null)}
            onFocus={() => onHoverIso?.(cell.date)}
            onBlur={() => onHoverIso?.(null)}
        >
            {cell.dom}
        </button>
    )
}

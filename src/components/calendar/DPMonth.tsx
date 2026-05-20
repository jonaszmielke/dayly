'use client'

import { addMonths, DOW_ABBREVIATIONS, monthGrid, monthName, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type DPMonthProps = {
    mode: 'single' | 'range'
    value: string | null
    rangeValue: { start: string | null; end: string | null }
    onPick: (iso: string) => void
    minDate?: string
    hoverIso?: string | null
    onHoverIso?: (iso: string | null) => void
    initialMonth?: { year: number; month: number }
}

export const DPMonth = ({
    mode,
    value,
    rangeValue,
    onPick,
    minDate,
    hoverIso,
    onHoverIso,
    initialMonth,
}: DPMonthProps) => {
    const today = new Date()
    const [{ year, month }, setYM] = useState(() => {
        if (initialMonth) return initialMonth
        const seed = mode === 'single' ? value || ymd(today) : rangeValue.start || ymd(today)
        const d = new Date(seed + 'T00:00:00')
        return { year: d.getFullYear(), month: d.getMonth() }
    })

    const cells = monthGrid(year, month)

    const isInRange = (iso: string): boolean => {
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

    const isEndpoint = (iso: string): boolean => {
        if (mode === 'single') return iso === value
        const { start, end } = rangeValue
        if (start && end) return iso === start || iso === end
        if (start && !end) return iso === start
        return false
    }

    const isDisabled = (iso: string): boolean => {
        if (minDate && iso < minDate) return true
        return false
    }

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
                {cells.map((c) => {
                    const inSel = isInRange(c.date)
                    const endpoint = isEndpoint(c.date)
                    const disabled = isDisabled(c.date)

                    return (
                        <div
                            key={c.date}
                            className={cn(
                                'relative flex items-center justify-center h-14 font-mono text-[13px] cursor-pointer select-none border border-ink transition-all',
                                !c.inMonth && 'text-ink/30 bg-paper-2',
                                c.inMonth &&
                                    !disabled &&
                                    !endpoint &&
                                    !inSel &&
                                    'hover:bg-paper-range',
                                inSel && !endpoint && 'bg-paper-range hover:bg-paper-shade',
                                endpoint && 'bg-ink text-paper-2',
                                disabled && 'bg-hatch-light cursor-not-allowed text-ink/30'
                            )}
                            style={endpoint ? { boxShadow: 'inset 0 0 0 3px #7E6038' } : undefined}
                            onClick={() => !disabled && onPick(c.date)}
                            onMouseEnter={() => onHoverIso?.(c.date)}
                            onMouseLeave={() => onHoverIso?.(null)}
                        >
                            {c.dom}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

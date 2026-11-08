'use client'

import { type WeekCell } from '@/lib/calendar'
import { MONTH_ABBREVIATIONS } from '@/lib/dates'
import { formatHour } from '@/lib/slots'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export type HourGridSlot = {
    date: string
    hour: number
    inRange: boolean
}

type HourGridProps = {
    week: WeekCell[]
    hours: number[]
    cellRenderer: (slot: HourGridSlot) => ReactNode
    onToggleDay?: (date: string) => void
    onToggleHour?: (hour: number, weekDates: string[]) => void
    /** Greyed-out week label and day numbers, for loading skeletons. */
    muted?: boolean
    /** Hide from screen readers, e.g. for loading skeletons. */
    ariaHidden?: boolean
}

const monthAbbr = (iso: string) => MONTH_ABBREVIATIONS[Number(iso.slice(5, 7)) - 1]
const pad = (n: number) => String(n).padStart(2, '0')

const weekLabel = (week: WeekCell[]): string => {
    const first = week[0]
    const last = week[week.length - 1]
    const firstMon = monthAbbr(first.date)
    const lastMon = monthAbbr(last.date)
    return firstMon === lastMon
        ? `${pad(first.dom)}-${pad(last.dom)} ${firstMon}`
        : `${pad(first.dom)} ${firstMon} - ${pad(last.dom)} ${lastMon}`
}

export const HourGrid = ({
    week,
    hours,
    cellRenderer,
    onToggleDay,
    onToggleHour,
    muted,
    ariaHidden,
}: HourGridProps) => {
    const weekDates = week.filter((c) => c.inRange).map((c) => c.date)
    const gridTemplateColumns = '64px repeat(7, minmax(0, 1fr))'

    return (
        <div className="bg-white border-brutal shadow-brutal" aria-hidden={ariaHidden}>
            {/* Week head */}
            <div className="flex items-baseline justify-between px-3 py-3 lg:px-5 lg:py-4 border-b-2 border-ink">
                <span
                    className={cn(
                        'font-sans text-[20px] lg:text-[26px] font-extrabold leading-none tracking-[-0.03em]',
                        muted && 'text-ink/30'
                    )}
                >
                    {weekLabel(week)}
                </span>
                <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-widest text-ink/55">
                    {hours.length} HRS/DAY
                </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns }}>
                {/* Header row */}
                <div className="flex items-center justify-center bg-paper border-r-[1.5px] border-b-[1.5px] border-ink font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.04em] text-ink/45">
                    HR
                </div>
                {week.map((c, i) => {
                    const last = i === week.length - 1
                    const dowLabel = (
                        <>
                            {c.dow.slice(0, 1)}
                            <span className="hidden lg:inline">{c.dow.slice(1)}</span>
                        </>
                    )
                    if (!c.inRange) {
                        return (
                            <div
                                key={c.date}
                                className={cn(
                                    'bg-paper border-b-[1.5px] border-ink py-1.5 text-center opacity-40',
                                    !last && 'border-r-[1.5px]'
                                )}
                            >
                                <div className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.04em] text-ink/45">
                                    {dowLabel}
                                </div>
                                <div className="font-mono text-[11px] lg:text-[12px] text-ink/35">
                                    {pad(c.dom)}
                                </div>
                            </div>
                        )
                    }
                    const headInner = (
                        <>
                            <div className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.04em] text-ink/55">
                                {dowLabel}
                            </div>
                            <div
                                className={cn(
                                    'font-sans text-[12px] lg:text-[13px] font-bold text-ink',
                                    muted && 'text-ink/40'
                                )}
                            >
                                {pad(c.dom)}
                            </div>
                        </>
                    )
                    const headClass = cn(
                        'bg-paper border-b-[1.5px] border-ink py-1.5 text-center',
                        !last && 'border-r-[1.5px]'
                    )
                    return onToggleDay ? (
                        <button
                            key={c.date}
                            type="button"
                            onClick={() => onToggleDay(c.date)}
                            title={`Toggle all of ${c.dow}`}
                            className={cn(headClass, 'hover:bg-paper-3 transition-colors')}
                        >
                            {headInner}
                        </button>
                    ) : (
                        <div key={c.date} className={headClass}>
                            {headInner}
                        </div>
                    )
                })}

                {/* Body rows */}
                {hours.map((h, ri) => {
                    const lastRow = ri === hours.length - 1
                    const labelClass = cn(
                        'flex items-center justify-center bg-paper border-r-[1.5px] border-ink font-mono text-[11px] lg:text-[12px] text-ink/70',
                        !lastRow && 'border-b-[1.5px]'
                    )
                    return (
                        <div key={h} className="contents">
                            {onToggleHour ? (
                                <button
                                    type="button"
                                    onClick={() => onToggleHour(h, weekDates)}
                                    title={`Toggle ${formatHour(h)} across this week`}
                                    className={cn(labelClass, 'hover:bg-paper-3 transition-colors')}
                                >
                                    {formatHour(h)}
                                </button>
                            ) : (
                                <div className={labelClass}>{formatHour(h)}</div>
                            )}
                            {week.map((c, ci) => {
                                const lastCol = ci === week.length - 1
                                return (
                                    <div
                                        key={c.date}
                                        className={cn(
                                            'min-h-[40px] lg:min-h-[44px] border-ink',
                                            !lastCol && 'border-r-[1.5px]',
                                            !lastRow && 'border-b-[1.5px]'
                                        )}
                                    >
                                        {cellRenderer({
                                            date: c.date,
                                            hour: h,
                                            inRange: c.inRange,
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

'use client'

import { useState, useMemo } from 'react'
import { useResponses } from './_hooks/useResponses'
import { MOCK_MEETING } from '@/lib/mock'
import { ymd, formatDate, formatDateLong, daysBetweenInclusive, computeBest, getDisplayMonths } from '@/lib/dates'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { HeatLegend } from '@/components/calendar/HeatLegend'
import { StatCard } from '@/components/StatCard'
import { cn } from '@/lib/utils'

const meeting = MOCK_MEETING
const rangeStart = ymd(meeting.startDate)
const rangeEnd = ymd(meeting.endDate)

const SummaryPage = () => {
    const { responses } = useResponses()
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)

    const people = useMemo(
        () =>
            responses.map((r) => ({
                id: r.id,
                name: r.userName,
                availSet: new Set(r.days.map((d) => ymd(d))),
                daysCount: r.days.length,
            })),
        [responses],
    )

    const best = useMemo(
        () => computeBest(people.map((p) => Array.from(p.availSet))),
        [people],
    )

    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)

    const totalDays = daysBetweenInclusive(rangeStart, rangeEnd)

    const statRows = [
        { label: 'Range', value: `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}` },
        { label: 'Mode', value: meeting.mode },
        { label: 'Deadline', value: formatDate(ymd(meeting.deadline)) ?? '—' },
        { label: 'Responses', value: String(responses.length) },
    ]

    const handlePersonClick = (id: string) => {
        setSelectedPersonId((prev) => (prev === id ? null : id))
    }

    return (
        <div className="grid gap-8 p-8" style={{ gridTemplateColumns: '304px 1fr' }}>
            {/* Sidebar */}
            <aside className="flex flex-col gap-4 sticky top-6 self-start">
                {/* Who's In panel */}
                <div className="bg-white border-brutal shadow-brutal">
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink">
                        <span className="font-sans text-[13px] font-bold uppercase tracking-[0.08em]">
                            Who&apos;s In
                        </span>
                        <span className="font-mono text-[11px] text-ink/55">
                            {responses.length}/{responses.length}
                        </span>
                    </div>
                    <div>
                        {people.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => handlePersonClick(p.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                    i > 0 && 'border-t border-ink/10',
                                    selectedPersonId === p.id
                                        ? 'bg-ink text-paper-2'
                                        : 'hover:bg-paper-3',
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-[16px]',
                                        selectedPersonId === p.id
                                            ? 'text-mocha-pale'
                                            : 'text-ink/40',
                                    )}
                                >
                                    {selectedPersonId === p.id ? '●' : '○'}
                                </span>
                                <span className="flex-1 font-sans text-[14px] font-semibold">
                                    {p.name}
                                </span>
                                <span className="font-mono text-[11px]">
                                    {p.daysCount}
                                    <span className="text-ink/40">d</span>
                                </span>
                            </button>
                        ))}
                    </div>
                    {selectedPersonId && (
                        <div className="p-3 border-t border-ink/20 flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedPersonId(null)}
                                className="w-full py-2 px-3 border-thin font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 hover:text-ink hover:border-ink transition-colors"
                                style={{
                                    borderStyle: 'dashed',
                                }}
                            >
                                ← Back to heatmap
                            </button>
                        </div>
                    )}
                </div>

                <HeatLegend total={responses.length} />
                <StatCard rows={statRows} />
            </aside>

            {/* Main content */}
            <main className="flex flex-col gap-6">
                {/* Best day banner */}
                {best.range && (
                    <div
                        className="bg-white border-brutal flex items-center gap-4 px-5 py-4"
                        style={{ boxShadow: 'var(--b-shadow) #C5AC6A' }}
                    >
                        <div className="bg-ink text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
                            {selectedPersonId ? 'SOLO' : 'BEST'}
                        </div>
                        <div className="flex-1">
                            <div className="font-sans text-[22px] font-bold leading-tight">
                                {formatDateLong(best.range[0])} — {formatDateLong(best.range[1])}
                            </div>
                            <div className="font-mono text-[11px] text-ink/60 mt-0.5">
                                ALL {best.max}/{responses.length} FREE ·{' '}
                                {daysBetweenInclusive(best.range[0], best.range[1])} CONSECUTIVE DAYS
                            </div>
                        </div>
                        <span className="font-mono text-[20px] text-ink/30">↘</span>
                    </div>
                )}

                {/* Month grids */}
                {displayMonths.map(({ year, month }) => {
                    const daysInRange = (() => {
                        const monthStart = new Date(year, month, 1)
                        const monthEnd = new Date(year, month + 1, 0)
                        const clampStart = new Date(Math.max(monthStart.getTime(), new Date(rangeStart + 'T00:00:00').getTime()))
                        const clampEnd = new Date(Math.min(monthEnd.getTime(), new Date(rangeEnd + 'T00:00:00').getTime()))
                        if (clampStart > clampEnd) return 0
                        return Math.round((clampEnd.getTime() - clampStart.getTime()) / 86400000) + 1
                    })()

                    return (
                        <MonthGrid
                            key={`${year}-${month}`}
                            year={year}
                            month={month}
                            rangeStart={rangeStart}
                            rangeEnd={rangeEnd}
                            daysInRange={daysInRange}
                            cellRenderer={(cell, inRange) => (
                                <SummaryCell
                                    cell={cell}
                                    inRange={inRange}
                                    people={people}
                                    selectedPersonId={selectedPersonId}
                                />
                            )}
                        />
                    )
                })}
            </main>
        </div>
    )
}

export default SummaryPage

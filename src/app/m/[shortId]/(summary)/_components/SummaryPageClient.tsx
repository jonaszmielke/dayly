'use client'

import { useResponses } from '../_hooks/useResponses'
import { MeetingFooter } from '../../_components/Footer'
import { BestDayBanner } from './BestDayBanner'
import { HeatLegend } from '@/components/calendar/HeatLegend'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { StatCard } from '@/components/StatCard'
import { computeBest, formatDate, getDisplayMonths, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Meeting } from '@prisma/client'
import { useCallback, useMemo, useState } from 'react'

export const SummaryPageClient = ({ meeting }: { meeting: Meeting }) => {
    const { responses, isLoading } = useResponses(meeting.shortId)
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)

    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)

    const handleCellEnter = useCallback((iso: string) => setHoveredDate(iso), [])
    const handleCellLeave = useCallback(() => setHoveredDate(null), [])

    const people = useMemo(
        () =>
            responses.map((r) => ({
                id: r.id,
                name: r.userName,
                availSet: new Set(r.days.map((d) => ymd(d))),
                daysCount: r.days.length,
            })),
        [responses]
    )

    const best = useMemo(() => computeBest(people.map((p) => Array.from(p.availSet))), [people])

    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)

    const statRows = [
        { label: 'Range', value: `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}` },
        { label: 'Mode', value: meeting.mode },
        { label: 'Deadline', value: formatDate(ymd(meeting.deadline)) ?? '—' },
        { label: 'Responses', value: String(responses.length) },
    ]

    const handlePersonClick = (id: number) => {
        setSelectedPersonId((prev) => (prev === id ? null : id))
    }

    const selectedPerson = useMemo(() => {
        if (!selectedPersonId) return null
        return people.find((p) => p.id === selectedPersonId)
    }, [people, selectedPersonId])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div
            className="grid py-8"
            style={{
                gridTemplateColumns: '12.5vw 47.06vw',
                columnGap: '1.47vw',
                paddingLeft: '19.48vw',
                paddingRight: '19.48vw',
            }}
        >
            {/* Sidebar */}
            <aside className="flex flex-col gap-4 sticky top-6 self-start">
                {/* Who's In panel */}
                <div className="bg-white border-brutal shadow-brutal">
                    <div className="flex items-center justify-between px-4 py-3 border-b-[1.5px] border-ink">
                        <span className="font-sans text-[18px] font-bold tracking-[-0.01em]">
                            WHO&apos;S IN
                        </span>
                        {/* <span className="font-mono text-[12px] text-ink/60">
                            {responses.length}/{responses.length}
                        </span> */}
                        <button>+</button>
                    </div>
                    <div className="px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink/55 border-b border-ink/10">
                        {selectedPersonId !== null
                            ? 'CLICK SAME NAME TO CLEAR'
                            : 'CLICK A NAME TO ISOLATE'}
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
                                        : 'hover:bg-paper-3'
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-[16px]',
                                        selectedPersonId === p.id
                                            ? 'text-mocha-pale'
                                            : 'text-ink/40'
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
                    {selectedPersonId !== null && (
                        <div className="p-3 border-t border-ink/20 flex flex-col gap-2">
                            <button className="w-full py-2.5 px-3 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-sm font-sans text-[12px] font-bold uppercase tracking-[0.08em] press-effect-mocha">
                                ✎ Edit {people.find((p) => p.id === selectedPersonId)?.name}&apos;s
                                availability
                            </button>
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
                <BestDayBanner
                    meetingShortId={meeting.shortId}
                    responsesLength={responses.length}
                    selectedPerson={selectedPerson || null}
                    best={best}
                />

                {/* Month grids */}
                {displayMonths.map(({ year, month }) => {
                    const daysInRange = (() => {
                        const monthStart = new Date(year, month, 1)
                        const monthEnd = new Date(year, month + 1, 0)
                        const clampStart = new Date(
                            Math.max(
                                monthStart.getTime(),
                                new Date(rangeStart + 'T00:00:00').getTime()
                            )
                        )
                        const clampEnd = new Date(
                            Math.min(monthEnd.getTime(), new Date(rangeEnd + 'T00:00:00').getTime())
                        )
                        if (clampStart > clampEnd) return 0
                        return (
                            Math.round((clampEnd.getTime() - clampStart.getTime()) / 86400000) + 1
                        )
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
                                    isHovered={hoveredDate === cell.date}
                                    onMouseEnter={handleCellEnter}
                                    onMouseLeave={handleCellLeave}
                                />
                            )}
                        />
                    )
                })}

                <MeetingFooter />
            </main>
        </div>
    )
}

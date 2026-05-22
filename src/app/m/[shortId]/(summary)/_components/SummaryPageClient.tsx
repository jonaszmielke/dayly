'use client'

import { useResponses } from '../_hooks/useResponses'
import { MeetingFooter } from '../../_components/Footer'
import { BestDayBanner } from './BestDayBanner'
import { WhosInPanel } from './WhosInPanel'
import { HeatLegend } from '@/components/calendar/HeatLegend'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { StatCard } from '@/components/StatCard'
import { computeBest, formatDate, getDisplayMonths, ymd } from '@/lib/dates'
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
                <WhosInPanel
                    meetingShortId={meeting.shortId}
                    people={people}
                    selectedPersonId={selectedPersonId}
                    onPersonClick={handlePersonClick}
                    onClearSelection={() => setSelectedPersonId(null)}
                />

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

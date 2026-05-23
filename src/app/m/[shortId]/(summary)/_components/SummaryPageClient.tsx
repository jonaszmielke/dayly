'use client'

import { useResponses } from '../_hooks/useResponses'
import MeetingHeader from '../../_components/MeetingHeader'
import { BestDayBanner } from './BestDayBanner'
import { DayDetailSheet } from './DayDetailSheet'
import { SummaryMobileDrawer } from './SummaryMobileDrawer'
import { WhosInPanel } from './WhosInPanel'
import { HeatLegend } from '@/components/calendar/HeatLegend'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { StatCard } from '@/components/StatCard'
import { computeBest, formatDate, getDisplayMonths, ymd } from '@/lib/dates'
import { Meeting, MeetingMode } from '@prisma/client'
import { useCallback, useMemo, useState } from 'react'

const calcDaysInRange = (year: number, month: number, rangeStart: string, rangeEnd: string) => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    const clampStart = new Date(
        Math.max(monthStart.getTime(), new Date(rangeStart + 'T00:00:00').getTime())
    )
    const clampEnd = new Date(
        Math.min(monthEnd.getTime(), new Date(rangeEnd + 'T00:00:00').getTime())
    )
    if (clampStart > clampEnd) return 0
    return Math.round((clampEnd.getTime() - clampStart.getTime()) / 86400000) + 1
}

export const SummaryPageClient = ({ meeting }: { meeting: Meeting }) => {
    const { responses, isLoading } = useResponses(meeting.shortId)
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [burgerOpen, setBurgerOpen] = useState(false)

    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)

    const handleCellEnter = useCallback((iso: string) => setHoveredDate(iso), [])
    const handleCellLeave = useCallback(() => setHoveredDate(null), [])
    const handleCellTap = useCallback((iso: string) => {
        setSelectedDate((prev) => (prev === iso ? null : iso))
    }, [])

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

    const drawerMeta = `${formatDate(rangeStart)} — ${formatDate(rangeEnd)} • ${
        meeting.mode === MeetingMode.DAYS ? 'DAY MODE' : 'HOUR MODE'
    }`

    const handlePersonClick = (id: number) => {
        setSelectedPersonId((prev) => (prev === id ? null : id))
    }

    const selectedPerson = useMemo(
        () => (selectedPersonId ? (people.find((p) => p.id === selectedPersonId) ?? null) : null),
        [people, selectedPersonId]
    )

    const dayDetailPeople = useMemo(
        () =>
            selectedDate
                ? people.map((p) => ({ name: p.name, available: p.availSet.has(selectedDate) }))
                : [],
        [selectedDate, people]
    )

    const burgerButton = (
        <button
            className="flex items-center justify-center w-9 h-9 bg-white border-2 border-ink font-sans text-[20px] font-bold leading-none"
            style={{ boxShadow: '3px 3px 0 #161514' }}
            onClick={() => setBurgerOpen(true)}
            aria-label="Open menu"
        >
            ≡
        </button>
    )

    const renderMonths = (mobile: boolean) =>
        displayMonths.map(({ year, month }) => (
            <MonthGrid
                key={`${year}-${month}`}
                year={year}
                month={month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                daysInRange={calcDaysInRange(year, month, rangeStart, rangeEnd)}
                cellAspectClassName={mobile ? 'aspect-square' : 'aspect-[140/100]'}
                cellRenderer={(cell, inRange) => (
                    <SummaryCell
                        cell={cell}
                        inRange={inRange}
                        people={people}
                        selectedPersonId={selectedPersonId}
                        isHovered={mobile ? false : hoveredDate === cell.date}
                        isSelected={selectedDate === cell.date}
                        hideTotal={mobile}
                        onMouseEnter={handleCellEnter}
                        onMouseLeave={handleCellLeave}
                        onTap={handleCellTap}
                    />
                )}
            />
        ))

    if (isLoading) {
        return (
            <>
                <MeetingHeader
                    meeting={meeting}
                    mobileRight={burgerButton}
                    showMobileAddResponseButton
                />
                <div className="px-4 py-8 font-mono text-[12px] text-ink/55 uppercase tracking-widest">
                    Loading…
                </div>
            </>
        )
    }

    return (
        <>
            <MeetingHeader
                meeting={meeting}
                mobileRight={burgerButton}
                showMobileAddResponseButton
            />

            {/* ── Mobile layout (default, hidden lg) ── */}
            <div className="flex flex-col gap-4 px-4 py-6 lg:hidden">
                <BestDayBanner
                    meetingShortId={meeting.shortId}
                    responsesLength={responses.length}
                    selectedPerson={selectedPerson}
                    best={best}
                />
                {renderMonths(true)}
                <HeatLegend total={responses.length} />
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout (lg+) ── */}
            <div className="hidden lg:block py-8">
                <div className="mx-auto w-full max-w-[1600px] px-6 xl:px-10">
                    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
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

                        <main className="flex flex-col gap-6">
                            <BestDayBanner
                                meetingShortId={meeting.shortId}
                                responsesLength={responses.length}
                                selectedPerson={selectedPerson}
                                best={best}
                            />
                            {renderMonths(false)}
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile: sticky day detail sheet */}
            <DayDetailSheet
                iso={selectedDate}
                people={dayDetailPeople}
                onClose={() => setSelectedDate(null)}
            />

            {/* Mobile: burger sheet */}
            <SummaryMobileDrawer
                open={burgerOpen}
                onClose={() => setBurgerOpen(false)}
                meetingShortId={meeting.shortId}
                meta={drawerMeta}
                people={people}
                selectedPersonId={selectedPersonId}
                onPersonClick={handlePersonClick}
                onClearSelection={() => setSelectedPersonId(null)}
            />
        </>
    )
}

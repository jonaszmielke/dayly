'use client'

import { useResponses } from '../_hooks/useResponses'
import MeetingHeader from '../../_components/MeetingHeader'
import { MeetingClean } from '../../types'
import { BestDayBanner } from './BestBanner/BestDayBanner'
import { BestHoursBanner } from './BestBanner/BestHoursBanner'
import { DayDetailSheet } from './DayDetailSheet'
import { SummaryMobileDrawer } from './SummaryMobileDrawer'
import { WhosInPanel } from './WhosInPanel'
import { HeatLegend } from '@/components/calendar/HeatLegend'
import { HourGrid } from '@/components/calendar/HourGrid'
import { HourGridSkeleton } from '@/components/calendar/HourGridSkeleton'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { MonthGridSkeleton } from '@/components/calendar/MonthGridSkeleton'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { SummaryHourCell } from '@/components/calendar/SummaryHourCell'
import { StatCard } from '@/components/StatCard'
import { MeetingMode } from '@/generated/prisma/enums'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import {
    calcDaysInRange,
    computeBest,
    computeBestHours,
    dateRange,
    formatDate,
    formatDateMedium,
    formatHour,
    getDisplayMonths,
    getDisplayWeeks,
    slotKey,
    slotKeyFromUtc,
    ymd,
} from '@/lib/dates'
import { useCallback, useMemo, useState } from 'react'

export const SummaryPageClient = ({ meeting }: { meeting: MeetingClean }) => {
    const { responses, isLoading } = useResponses(meeting.shortId)
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [burgerOpen, setBurgerOpen] = useState(false)
    const isTouch = useIsTouchDevice()

    const hoursMeta = meeting.mode === MeetingMode.HOURS ? meeting : null
    const isHours = hoursMeta !== null

    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)

    const startHour = hoursMeta?.startHour ?? 0
    const endHour = hoursMeta?.endHour ?? 24

    const handleCellEnter = useCallback((key: string) => setHoveredDate(key), [])
    const handleCellLeave = useCallback(() => setHoveredDate(null), [])
    const handleCellTap = useCallback((key: string) => {
        setSelectedDate((prev) => (prev === key ? null : key))
    }, [])

    const people = useMemo(
        () =>
            responses.map((r) => {
                const availSet = new Set(
                    isHours ? r.hours.map(slotKeyFromUtc) : r.days.map((d) => ymd(d))
                )
                return { id: r.id, name: r.userName, availSet, daysCount: availSet.size }
            }),
        [responses, isHours]
    )

    const hours = useMemo(
        () => (isHours ? Array.from({ length: endHour - startHour }, (_, i) => startHour + i) : []),
        [isHours, startHour, endHour]
    )
    const weeks = useMemo(() => getDisplayWeeks(rangeStart, rangeEnd), [rangeStart, rangeEnd])
    const inRangeDays = useMemo(() => dateRange(rangeStart, rangeEnd), [rangeStart, rangeEnd])
    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)

    const bestDays = useMemo(
        () => (isHours ? null : computeBest(people.map((p) => Array.from(p.availSet)))),
        [isHours, people]
    )
    const bestHours = useMemo(
        () => (isHours ? computeBestHours(people, inRangeDays, hours) : null),
        [isHours, people, inRangeDays, hours]
    )

    const statRows = [
        { label: 'Range', value: `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}` },
        { label: 'Mode', value: meeting.mode },
        ...(meeting.deadline
            ? [{ label: 'Deadline', value: formatDate(ymd(meeting.deadline)) }]
            : []),
        { label: 'Responses', value: String(responses.length) },
    ]

    const drawerMeta = `${formatDate(rangeStart)} — ${formatDate(rangeEnd)} • ${
        isHours ? 'HOUR MODE' : 'DAY MODE'
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

    const detailHeading =
        isHours && selectedDate
            ? `${formatDateMedium(selectedDate.slice(0, 10))} · ${formatHour(
                  Number(selectedDate.slice(11, 13))
              )}`
            : undefined

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
                        isTouch={isTouch}
                        onMouseEnter={handleCellEnter}
                        onMouseLeave={handleCellLeave}
                        onTap={handleCellTap}
                    />
                )}
            />
        ))

    const renderHourWeeks = (mobile: boolean) =>
        weeks.map((week) => (
            <HourGrid
                key={week[0].date}
                week={week}
                hours={hours}
                cellRenderer={(date, hour, inRange) => {
                    const key = slotKey(date, hour)
                    return (
                        <SummaryHourCell
                            date={date}
                            hour={hour}
                            inRange={inRange}
                            people={people}
                            selectedPersonId={selectedPersonId}
                            isHovered={mobile ? false : hoveredDate === key}
                            isSelected={selectedDate === key}
                            hideTotal={mobile}
                            isTouch={isTouch}
                            onMouseEnter={handleCellEnter}
                            onMouseLeave={handleCellLeave}
                            onTap={handleCellTap}
                        />
                    )
                }}
            />
        ))

    const renderCalendar = ({
        mobile,
        isLoading = false,
    }: {
        mobile: boolean
        isLoading?: boolean
    }) => {
        if (isLoading)
            return isHours
                ? weeks.map((week) => (
                      <HourGridSkeleton key={week[0].date} week={week} hours={hours} />
                  ))
                : displayMonths.map(({ year, month }) => (
                      <MonthGridSkeleton
                          key={`${year}-${month}`}
                          year={year}
                          month={month}
                          rangeStart={rangeStart}
                          rangeEnd={rangeEnd}
                          cellAspectClassName="aspect-square lg:aspect-[140/100]"
                      />
                  ))

        return isHours ? renderHourWeeks(mobile) : renderMonths(mobile)
    }

    const bestBanner = isHours ? (
        <BestHoursBanner
            meetingShortId={meeting.shortId}
            responsesLength={responses.length}
            selectedPerson={selectedPerson}
            best={bestHours}
            isLoading={isLoading}
        />
    ) : (
        <BestDayBanner
            meetingShortId={meeting.shortId}
            responsesLength={responses.length}
            selectedPerson={selectedPerson}
            best={bestDays}
            isLoading={isLoading}
        />
    )

    return (
        <>
            <MeetingHeader
                meeting={meeting}
                mobileRight={burgerButton}
                showMobileAddResponseButton
            />

            {/* ── Mobile layout (default, hidden lg) ── */}
            <div className="flex flex-col gap-4 px-4 py-6 lg:hidden">
                {bestBanner}
                {renderCalendar({ mobile: true, isLoading })}
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
                                countUnit={isHours ? 'h' : 'd'}
                                onPersonClick={handlePersonClick}
                                onClearSelection={() => setSelectedPersonId(null)}
                            />
                            <HeatLegend total={responses.length} />
                            <StatCard rows={statRows} />
                        </aside>

                        <main className="flex flex-col gap-6">
                            {bestBanner}
                            {renderCalendar({ mobile: false, isLoading })}
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile: sticky day detail sheet */}
            <DayDetailSheet
                iso={selectedDate}
                heading={detailHeading}
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
                countUnit={isHours ? 'h' : 'd'}
                onPersonClick={handlePersonClick}
                onClearSelection={() => setSelectedPersonId(null)}
                isLoading={isLoading}
            />
        </>
    )
}

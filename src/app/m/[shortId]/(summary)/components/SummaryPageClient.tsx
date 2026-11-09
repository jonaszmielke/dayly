'use client'

import { DesktopSidebarLayout } from '../../components/DesktopSidebarLayout'
import { MeetingHeader } from '../../components/MeetingHeader'
import { type MeetingClean } from '../../types'
import { useResponses } from '../hooks/useResponses'
import { BestBanner } from './BestBanner/BestBanner'
import { BurgerButton } from './BurgerButton'
import { DayDetailSheet } from './DayDetailSheet'
import { HeatLegend } from './HeatLegend'
import { SummaryCalendar } from './SummaryCalendar'
import { type SummaryCellsState } from './summaryCells'
import { SummaryMobileDrawer } from './SummaryMobileDrawer'
import { WhosInPanel } from './WhosInPanel/WhosInPanel'
import { StatCard } from '@/components/StatCard'
import { MeetingMode } from '@/generated/prisma/enums'
import { MEDIA_QUERIES, useMediaQuery } from '@/hooks/useMediaQuery'
import { computeBest, computeBestHours } from '@/lib/best'
import { getDisplayMonths, getDisplayWeeks } from '@/lib/calendar'
import { dateRange, formatDate, formatDateMedium, ymd } from '@/lib/dates'
import { formatHour, slotKeyFromUtc } from '@/lib/slots'
import { useCallback, useMemo, useState } from 'react'

export const SummaryPageClient = ({ meeting }: { meeting: MeetingClean }) => {
    const { responses, isLoading } = useResponses(meeting.shortId)
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [burgerOpen, setBurgerOpen] = useState(false)
    const isTouch = useMediaQuery(MEDIA_QUERIES.touch)

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

    const cells: SummaryCellsState = {
        people,
        selectedPersonId,
        hoveredKey: hoveredDate,
        selectedKey: selectedDate,
        isTouch,
        onCellEnter: handleCellEnter,
        onCellLeave: handleCellLeave,
        onCellTap: handleCellTap,
    }

    const calendarProps = {
        isHours,
        isLoading,
        rangeStart,
        rangeEnd,
        displayMonths,
        weeks,
        hours,
        cells,
    }

    const bestBannerProps = {
        isHours,
        bestDays,
        bestHours,
        meetingShortId: meeting.shortId,
        responsesLength: responses.length,
        selectedPerson,
        isLoading,
    }

    return (
        <>
            <MeetingHeader
                meeting={meeting}
                mobileRight={<BurgerButton onClick={() => setBurgerOpen(true)} />}
                showMobileAddResponseButton
            />

            {/* ── Mobile layout (default, hidden lg) ── */}
            <div className="flex flex-col gap-4 px-4 py-6 lg:hidden">
                <BestBanner {...bestBannerProps} />
                <SummaryCalendar compact {...calendarProps} />
                <HeatLegend total={responses.length} />
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout (lg+) ── */}
            <DesktopSidebarLayout
                sidebar={
                    <>
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
                    </>
                }
            >
                <BestBanner {...bestBannerProps} />
                <SummaryCalendar compact={false} {...calendarProps} />
            </DesktopSidebarLayout>

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

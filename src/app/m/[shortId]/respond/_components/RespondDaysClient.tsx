'use client'

import { type MeetingCleanDays } from '../../types'
import { useCalendarSelectLogic } from '../hooks/useCalendarSelectLogic'
import { type UserResponse, useEditTarget } from '../hooks/useEditTarget'
import { useRespondForm } from '../hooks/useRespondForm'
import { useUpdateResponsesCache } from '../hooks/useUpdateResponsesCache'
import { QuickPicks } from './QuickPicks'
import { type RespondCopy, RespondLayout } from './RespondLayout'
import { RespondMonthGrids } from './RespondMonthGrids'
import { getDaysStatRows } from './statRows'
import { MonthGridSkeleton } from '@/components/calendar/MonthGridSkeleton'
import { getDisplayMonths, ymd } from '@/lib/dates'

const DAYS_COPY: RespondCopy = {
    title: 'When are you free?',
    desktopSubtitle: 'Click or drag days in the calendar below',
    mobileHelp: 'TAP toggle · DRAG paint multiple · ⇧ CLICK range',
    desktopHelp: ['CLICK to toggle a day', 'DRAG to select multiple', '⇧ CLICK for range'],
    counterLabel: ['DAYS', 'SELECTED'],
}

const toDayKeys = (response: UserResponse) =>
    response && 'days' in response ? response.days.map((d) => ymd(d)) : undefined

export const RespondDaysClient = ({ meeting }: { meeting: MeetingCleanDays }) => {
    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)
    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)

    const {
        editOriginalName,
        originalKeys,
        isLoading: isEditLoading,
    } = useEditTarget({ meetingShortId: meeting.shortId, toKeys: toDayKeys })

    const {
        selected,
        setSelected,
        hoveredDate,
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        handleReset,
        handleQuickPick,
    } = useCalendarSelectLogic({
        rangeStart,
        rangeEnd,
        resetKeys: originalKeys,
    })

    const updateResponsesCache = useUpdateResponsesCache()

    const form = useRespondForm({
        meetingShortId: meeting.shortId,
        editOriginalName,
        originalKeys,
        isOriginalLoading: isEditLoading,
        selected,
        setSelected,
        onSaved: ({ name, keys }) =>
            updateResponsesCache({
                meetingShortId: meeting.shortId,
                name,
                dates: keys,
                edit: !!editOriginalName,
                originalName: editOriginalName,
            }),
    })

    return (
        <RespondLayout
            meeting={meeting}
            copy={DAYS_COPY}
            editOriginalName={editOriginalName}
            form={form}
            selectedCount={selected.size}
            onReset={handleReset}
            statRows={getDaysStatRows(meeting)}
            sidebarExtra={<QuickPicks onPick={handleQuickPick} />}
            grids={
                <RespondMonthGrids
                    displayMonths={displayMonths}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    selected={selected}
                    hoveredDate={hoveredDate}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                />
            }
            isLoading={isEditLoading}
            skeleton={displayMonths.map(({ year, month }) => (
                <MonthGridSkeleton
                    key={`${year}-${month}`}
                    year={year}
                    month={month}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    cellAspectClassName="aspect-square lg:aspect-[140/100]"
                />
            ))}
        />
    )
}

'use client'

import { type MeetingCleanHours } from '../../types'
import { type UserResponse, useEditTarget } from '../hooks/useEditTarget'
import { useHourSelectLogic } from '../hooks/useHourSelectLogic'
import { useRespondForm } from '../hooks/useRespondForm'
import { useUpdateHoursResponseCache } from '../hooks/useUpdateHoursResponseCache'
import { RespondHourGrids } from './RespondHourGrids'
import { type RespondCopy, RespondLayout } from './RespondLayout'
import { getHoursStatRows } from './statRows'
import { HourGridSkeleton } from '@/components/calendar/HourGridSkeleton'
import { getDisplayWeeks, slotKeyFromUtc, ymd } from '@/lib/dates'
import { useMemo } from 'react'

const HOURS_COPY: RespondCopy = {
    title: 'Which hours work for you?',
    desktopSubtitle: 'Click or drag slots · click a day or hour label to paint a line',
    mobileHelp: 'TAP toggle · DRAG paint · DAY/HR label paints a line',
    desktopHelp: [
        'CLICK to toggle a slot',
        'DRAG to paint multiple',
        'DAY ▸ toggle column · HR ▸ toggle row',
    ],
    counterLabel: ['HOUR', 'SLOTS'],
    mobileCountLabel: 'SLOTS PICKED',
}

const toSlotKeys = (response: UserResponse) =>
    response && 'hours' in response ? response.hours.map(slotKeyFromUtc) : undefined

export const RespondHoursClient = ({ meeting }: { meeting: MeetingCleanHours }) => {
    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)
    const startHour = meeting.startHour ?? 0
    const endHour = meeting.endHour ?? 24

    const weeks = useMemo(() => getDisplayWeeks(rangeStart, rangeEnd), [rangeStart, rangeEnd])
    const hours = useMemo(
        () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
        [startHour, endHour]
    )

    const {
        editOriginalName,
        originalKeys,
        isLoading: isEditLoading,
    } = useEditTarget({ meetingShortId: meeting.shortId, toKeys: toSlotKeys })

    const {
        selected,
        setSelected,
        hoveredSlot,
        handlePointerDown,
        handlePointerEnter,
        handlePointerLeave,
        handleToggleDay,
        handleToggleHour,
        handleReset,
    } = useHourSelectLogic({
        hours,
        resetKeys: originalKeys,
    })

    const updateHoursCache = useUpdateHoursResponseCache()

    const form = useRespondForm({
        meetingShortId: meeting.shortId,
        editOriginalName,
        originalKeys,
        isOriginalLoading: isEditLoading,
        selected,
        setSelected,
        onSaved: ({ name, keys }) =>
            updateHoursCache({
                meetingShortId: meeting.shortId,
                name,
                slots: keys,
                edit: !!editOriginalName,
                originalName: editOriginalName,
            }),
    })

    return (
        <RespondLayout
            meeting={meeting}
            copy={HOURS_COPY}
            editOriginalName={editOriginalName}
            form={form}
            selectedCount={selected.size}
            onReset={handleReset}
            statRows={getHoursStatRows(meeting, startHour, endHour)}
            grids={
                <RespondHourGrids
                    weeks={weeks}
                    hours={hours}
                    selected={selected}
                    hoveredSlot={hoveredSlot}
                    onToggleDay={handleToggleDay}
                    onToggleHour={handleToggleHour}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                />
            }
            isLoading={isEditLoading}
            skeleton={weeks.map((week) => (
                <HourGridSkeleton key={week[0].date} week={week} hours={hours} />
            ))}
        />
    )
}

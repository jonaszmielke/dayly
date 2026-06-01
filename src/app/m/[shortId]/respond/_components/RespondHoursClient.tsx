'use client'

import { saveResponse } from '../_actions/saveResponse'
import MeetingHeader from '../../_components/MeetingHeader'
import { MeetingCleanHours } from '../../types'
import { useHourSelectLogic } from '../hooks/useHourSelectLogic'
import { useUpdateHoursResponseCache } from '../hooks/useUpdateHoursResponseCache'
import { useUserResponse } from '../hooks/useUserResponse'
import { MobileActionBar } from './MobileActionBar'
import { HourGrid } from '@/components/calendar/HourGrid'
import { RespondHourCell } from '@/components/calendar/RespondHourCell'
import { StatCard } from '@/components/StatCard'
import { formatDate, formatHour, getDisplayWeeks, slotKey, slotKeyFromUtc, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const RespondHoursClient = ({ meeting }: { meeting: MeetingCleanHours }) => {
    const router = useRouter()

    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)
    const startHour = meeting.startHour ?? 0
    const endHour = meeting.endHour ?? 24

    const weeks = useMemo(() => getDisplayWeeks(rangeStart, rangeEnd), [rangeStart, rangeEnd])
    const hours = useMemo(
        () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
        [startHour, endHour]
    )

    const searchParams = useSearchParams()
    const edit = searchParams.get('edit')
    const editOriginalName = useMemo(() => edit ?? undefined, [edit])
    const [name, setName] = useState<string>('')

    const { userResponse, isLoading: isUserResponseLoading } = useUserResponse({
        meetingShortId: meeting.shortId,
        name: editOriginalName,
    })

    const responseHours = userResponse && 'hours' in userResponse ? userResponse.hours : undefined

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
        initialSelected: responseHours,
        edit: !!editOriginalName,
    })

    const [editInitialized, setEditInitialized] = useState(false)

    useEffect(() => {
        if (!editOriginalName || isUserResponseLoading || !responseHours) return
        setName(editOriginalName)
        setSelected(new Set(responseHours.map(slotKeyFromUtc)))
        setEditInitialized(true)
    }, [responseHours, editOriginalName, isUserResponseLoading])

    const updateHoursCache = useUpdateHoursResponseCache()

    const saveMutation = useMutation({
        mutationFn: () =>
            saveResponse({
                meetingShortId: meeting.shortId,
                name,
                selection: Array.from(selected),
                edit: !!editOriginalName,
                newName: !!editOriginalName && name !== editOriginalName ? name : undefined,
            }),
        onSuccess: () => {
            updateHoursCache({
                meetingShortId: meeting.shortId,
                name,
                slots: Array.from(selected),
                edit: !!editOriginalName,
                originalName: editOriginalName,
            })
            setTimeout(() => router.push(`/m/${meeting.shortId}`), 600)
        },
    })

    const handleSave = async () => {
        if (!name.trim() || !saveMutation.isIdle) return
        saveMutation.mutate()
    }

    const isDirty = useMemo(() => {
        if (saveMutation.isSuccess || saveMutation.isPending) return false
        if (editOriginalName) {
            if (!editInitialized || !responseHours) return false
            const original = new Set(responseHours.map(slotKeyFromUtc))
            if (name !== editOriginalName) return true
            if (original.size !== selected.size) return true
            for (const k of selected) if (!original.has(k)) return true
            return false
        }
        return name.trim().length > 0 || selected.size > 0
    }, [
        name,
        selected,
        editOriginalName,
        responseHours,
        editInitialized,
        saveMutation.isSuccess,
        saveMutation.isPending,
    ])

    useEffect(() => {
        if (!isDirty) return
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isDirty])

    useEffect(() => {
        if (!isDirty) return
        window.history.pushState(null, '', window.location.href)
        const onPopState = () => {
            if (window.confirm('You have unsaved changes. Leave this page?')) {
                window.removeEventListener('popstate', onPopState)
                window.history.back()
            }
        }
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [isDirty])

    const statRows = [
        { label: 'Range', value: `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}` },
        { label: 'Window', value: `${formatHour(startHour)} — ${formatHour(endHour)}` },
        { label: 'Hours / day', value: String(hours.length) },
        ...(meeting.deadline
            ? [{ label: 'Respond by', value: formatDate(ymd(meeting.deadline)) }]
            : []),
    ]

    const saveState = saveMutation.isPending
        ? 'pending'
        : saveMutation.isSuccess
          ? 'success'
          : 'idle'

    const saveLabel =
        saveState === 'pending' ? 'SAVING…' : saveState === 'success' ? '✓ SAVED' : 'SAVE'

    const namePanel = (
        <div className="bg-white border-brutal shadow-brutal">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/20">
                <span className="font-sans text-[13px] font-bold uppercase tracking-[0.08em]">
                    {!!editOriginalName
                        ? name === editOriginalName
                            ? 'Keeping the same name'
                            : 'Changing name'
                        : 'Your Name'}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mocha">
                    Required
                </span>
            </div>
            <div className="p-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 32))}
                    placeholder="YOUR NAME"
                    autoFocus
                    minLength={3}
                    maxLength={32}
                    className={cn(
                        'w-full bg-paper border-thin px-3 py-3',
                        'font-sans text-[22px] font-bold uppercase',
                        'placeholder:text-ink/30 text-ink',
                        'outline-none focus:bg-white'
                    )}
                    style={{ caretColor: '#7E6038' }}
                />
            </div>
        </div>
    )

    const hourGrids = weeks.map((week) => (
        <HourGrid
            key={week[0].date}
            week={week}
            hours={hours}
            onToggleDay={handleToggleDay}
            onToggleHour={handleToggleHour}
            cellRenderer={(date, hour, inRange) => (
                <RespondHourCell
                    date={date}
                    hour={hour}
                    inRange={inRange}
                    selected={selected.has(slotKey(date, hour))}
                    hovered={hoveredSlot === slotKey(date, hour)}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                />
            )}
        />
    ))

    return (
        <>
            <MeetingHeader meeting={meeting} />

            {/* ── Mobile layout ── */}
            <div className="flex flex-col gap-4 px-4 py-6 pb-[130px] lg:hidden">
                {/* Banner */}
                <div className="bg-white border-brutal shadow-brutal flex items-center gap-3 px-3 py-3">
                    <div className="bg-mocha text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] shrink-0">
                        {!!editOriginalName ? 'EDIT' : 'PICK'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-sans text-[17px] font-bold leading-tight">
                            {!!editOriginalName
                                ? `Editing ${editOriginalName}'s response`
                                : 'Which hours work for you?'}
                        </div>
                        <div className="font-mono text-[10px] text-ink/55 mt-0.5">
                            TAP · DRAG TO PAINT MANY
                        </div>
                    </div>
                </div>

                {namePanel}
                {hourGrids}

                {/* Mobile help + stat */}
                <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
                    <div>TAP toggle · DRAG paint · DAY/HR label paints a line</div>
                </div>
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout ── */}
            <div className="hidden lg:block py-8">
                <div className="mx-auto w-full max-w-[1600px] px-6 xl:px-10">
                    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
                        {/* Sidebar */}
                        <aside className="flex flex-col gap-4 sticky top-6 self-start">
                            {namePanel}
                            <StatCard rows={statRows} />

                            {/* Counter */}
                            <div className="bg-ink text-paper-2 border-brutal shadow-brutal-mocha grid grid-cols-[auto_1fr] items-center gap-4 px-5 py-4">
                                <span
                                    className="font-sans font-extrabold leading-none tracking-tighter"
                                    style={{ fontSize: '56px' }}
                                >
                                    {String(selected.size).padStart(2, '0')}
                                </span>
                                <div>
                                    <div className="font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-paper/70">
                                        HOUR
                                    </div>
                                    <div className="font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-paper/70">
                                        SLOTS
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={!name.trim() || !saveMutation.isIdle}
                                    className={cn(
                                        'py-3 border-brutal font-sans text-[13px] font-bold uppercase tracking-[0.08em] transition-all press-effect',
                                        saveMutation.isSuccess
                                            ? 'bg-mocha-dark text-paper-2 shadow-brutal'
                                            : 'bg-mocha text-paper-2 shadow-brutal disabled:opacity-40 disabled:cursor-not-allowed'
                                    )}
                                >
                                    {saveLabel}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="py-3 bg-white border-brutal shadow-brutal-sm font-sans text-[13px] font-bold uppercase tracking-[0.08em] hover:bg-paper transition-colors press-effect"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
                                <div>CLICK to toggle a slot</div>
                                <div>DRAG to paint multiple</div>
                                <div>DAY ▸ toggle column · HR ▸ toggle row</div>
                            </div>
                        </aside>

                        {/* Main */}
                        <main className="flex flex-col gap-6">
                            <div className="bg-white border-brutal shadow-brutal flex items-center gap-4 px-5 py-4">
                                <div className="bg-mocha text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
                                    PICK
                                </div>
                                <div className="flex-1">
                                    <div className="font-sans text-[22px] font-bold leading-tight">
                                        Which hours work for you?
                                    </div>
                                    <div className="font-mono text-[11px] text-ink/55 mt-0.5">
                                        Click or drag slots · click a day or hour label to paint a
                                        line
                                    </div>
                                </div>
                                <span className="font-mono text-[20px] text-ink/30">↗</span>
                            </div>
                            {hourGrids}
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile sticky action bar */}
            <MobileActionBar
                count={selected.size}
                onReset={handleReset}
                onSave={handleSave}
                saveLabel={saveLabel}
                canReset={selected.size > 0}
                canSave={!!name.trim() && isDirty && selected.size > 0}
                saveState={saveState}
                countLabel="SLOTS PICKED"
            />
        </>
    )
}

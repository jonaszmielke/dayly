'use client'

import { saveResponse } from '../_actions/saveResponse'
import MeetingHeader from '../../_components/MeetingHeader'
import { useCalendarSelectLogic } from '../hooks/useCalendarSelectLogic'
import { useUpdateResponsesCache } from '../hooks/useUpdateResponsesCache'
import { useUserResponse } from '../hooks/useUserResponse'
import { MobileActionBar } from './MobileActionBar'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { RespondCell } from '@/components/calendar/RespondCell'
import { StatCard } from '@/components/StatCard'
import { formatDate, getDisplayMonths, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Meeting } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const RespondPageClient = ({ meeting }: { meeting: Meeting }) => {
    const router = useRouter()

    const rangeStart = ymd(meeting.startDate)
    const rangeEnd = ymd(meeting.endDate)

    const searchParams = useSearchParams()
    const edit = searchParams.get('edit')
    const editOriginalName = useMemo(() => edit ?? undefined, [edit])
    const [name, setName] = useState<string>('')

    const { userResponse, isLoading: isUserResponseLoading } = useUserResponse({
        meetingShortId: meeting.shortId,
        name: editOriginalName,
    })

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
        initialSelected: userResponse?.days,
        edit: !!editOriginalName,
    })

    const [editInitialized, setEditInitialized] = useState(false)

    useEffect(() => {
        if (!editOriginalName || isUserResponseLoading || !userResponse) return
        setName(editOriginalName)
        setSelected(new Set(userResponse.days.map((d) => ymd(d))))
        setEditInitialized(true)
    }, [userResponse, editOriginalName, isUserResponseLoading])

    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)
    const updateResponsesCache = useUpdateResponsesCache()

    const saveMutation = useMutation({
        mutationFn: () =>
            saveResponse({
                meetingShortId: meeting.shortId,
                name,
                dates: Array.from(selected),
                edit: !!editOriginalName,
                newName: !!editOriginalName && name !== editOriginalName ? name : undefined,
            }),
        onSuccess: () => {
            updateResponsesCache({
                meetingShortId: meeting.shortId,
                name,
                dates: Array.from(selected),
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
            if (!editInitialized || !userResponse) return false
            const original = new Set(userResponse.days.map((d) => ymd(d)))
            if (name !== editOriginalName) return true
            if (original.size !== selected.size) return true
            for (const d of selected) if (!original.has(d)) return true
            return false
        }
        return name.trim().length > 0 || selected.size > 0
    }, [
        name,
        selected,
        editOriginalName,
        userResponse,
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
        { label: 'Mode', value: meeting.mode },
        { label: 'Respond by', value: formatDate(ymd(meeting.deadline)) ?? '—' },
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
                    Your Name
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

    const quickPicks = (
        <div className="bg-white border-brutal shadow-brutal-sm p-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-mocha/70 mb-2">
                Quick Picks
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => handleQuickPick('weekends')}
                    className="py-1.5 bg-paper border-thin font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-mocha hover:text-paper-2 hover:border-mocha transition-colors"
                >
                    Weekends
                </button>
                <button
                    onClick={() => handleQuickPick('weekdays')}
                    className="py-1.5 bg-paper border-thin font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-mocha hover:text-paper-2 hover:border-mocha transition-colors"
                >
                    Weekdays
                </button>
            </div>
        </div>
    )

    const monthGrids = displayMonths.map(({ year, month }) => (
        <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            cellRenderer={(cell, inRange) => (
                <RespondCell
                    cell={cell}
                    inRange={inRange}
                    selected={selected.has(cell.date)}
                    isHovered={hoveredDate === cell.date}
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
                        PICK
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-sans text-[17px] font-bold leading-tight">
                            When are you free?
                        </div>
                        <div className="font-mono text-[10px] text-ink/55 mt-0.5">
                            TAP · DRAG TO PAINT MANY
                        </div>
                    </div>
                </div>

                {namePanel}
                {quickPicks}
                {monthGrids}

                {/* Mobile help + stat */}
                <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
                    <div>TAP toggle · DRAG paint multiple · ⇧ CLICK range</div>
                </div>
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout ── */}
            <div
                className="hidden lg:grid py-8"
                style={{
                    gridTemplateColumns: '12.5vw 47.06vw',
                    columnGap: '1.47vw',
                    paddingLeft: '19.48vw',
                    paddingRight: '19.48vw',
                }}
            >
                {/* Sidebar */}
                <aside className="flex flex-col gap-4 sticky top-6 self-start">
                    {namePanel}
                    {quickPicks}
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
                                DAYS
                            </div>
                            <div className="font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-paper/70">
                                SELECTED
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
                        <div>CLICK to toggle a day</div>
                        <div>DRAG to select multiple</div>
                        <div>⇧ CLICK for range</div>
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
                                When are you free?
                            </div>
                            <div className="font-mono text-[11px] text-ink/55 mt-0.5">
                                Click or drag days in the calendar below
                            </div>
                        </div>
                        <span className="font-mono text-[20px] text-ink/30">↗</span>
                    </div>
                    {monthGrids}
                </main>
            </div>

            {/* Mobile sticky action bar */}
            <MobileActionBar
                count={selected.size}
                onReset={handleReset}
                onSave={handleSave}
                saveLabel={saveLabel}
                canReset={selected.size > 0}
                saveState={saveState}
            />
        </>
    )
}

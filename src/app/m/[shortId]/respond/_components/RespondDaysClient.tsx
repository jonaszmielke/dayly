'use client'

import MeetingHeader from '../../_components/MeetingHeader'
import { type MeetingCleanDays } from '../../types'
import { saveResponse } from '../_actions/saveResponse'
import { useCalendarSelectLogic } from '../hooks/useCalendarSelectLogic'
import { useUpdateResponsesCache } from '../hooks/useUpdateResponsesCache'
import { useUserResponse } from '../hooks/useUserResponse'
import { MobileActionBar } from './MobileActionBar'
import { NamePanel } from './NamePanel'
import { QuickPicks } from './QuickPicks'
import { RespondMonthGrids } from './RespondMonthGrids'
import { getSaveState, SAVE_LABELS } from './saveState'
import { getDaysStatRows } from './statRows'
import { MonthGridSkeleton } from '@/components/calendar/MonthGridSkeleton'
import { StatCard } from '@/components/StatCard'
import { useActionMutation } from '@/hooks/useActionMutation'
import { getDisplayMonths, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const RespondDaysClient = ({ meeting }: { meeting: MeetingCleanDays }) => {
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

    const responseDays = userResponse && 'days' in userResponse ? userResponse.days : undefined

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
        initialSelected: responseDays,
        edit: !!editOriginalName,
    })

    const [editInitialized, setEditInitialized] = useState(false)

    useEffect(() => {
        if (!editOriginalName || isUserResponseLoading || !responseDays) return
        setName(editOriginalName)
        setSelected(new Set(responseDays.map((d) => ymd(d))))
        setEditInitialized(true)
    }, [responseDays, editOriginalName, isUserResponseLoading])

    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)
    const updateResponsesCache = useUpdateResponsesCache()

    const saveMutation = useActionMutation({
        mutationFn: () =>
            saveResponse({
                meetingShortId: meeting.shortId,
                name,
                selection: Array.from(selected),
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
        if (!name.trim() || saveMutation.isPending || saveMutation.isSuccess) return
        saveMutation.mutate()
    }

    const isDirty = useMemo(() => {
        if (saveMutation.isSuccess || saveMutation.isPending) return false
        if (editOriginalName) {
            if (!editInitialized || !responseDays) return false
            const original = new Set(responseDays.map((d) => ymd(d)))
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
        responseDays,
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

    const statRows = getDaysStatRows(meeting)
    const saveState = getSaveState(saveMutation)
    const saveLabel = SAVE_LABELS[saveState]

    const monthGridsProps = {
        displayMonths,
        rangeStart,
        rangeEnd,
        selected,
        hoveredDate,
        onPointerDown: handlePointerDown,
        onPointerEnter: handlePointerEnter,
        onPointerLeave: handlePointerLeave,
    }

    if (editOriginalName && isUserResponseLoading) {
        return (
            <>
                <MeetingHeader meeting={meeting} />
                <div className="flex flex-col gap-4 px-4 py-6 lg:py-8">
                    <div className="mx-auto flex w-full max-w-225 flex-col gap-4">
                        {displayMonths.map(({ year, month }) => (
                            <MonthGridSkeleton
                                key={`${year}-${month}`}
                                year={year}
                                month={month}
                                rangeStart={rangeStart}
                                rangeEnd={rangeEnd}
                                cellAspectClassName="aspect-square lg:aspect-[140/100]"
                            />
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <MeetingHeader meeting={meeting} />

            {/* ── Mobile layout ── */}
            <div className="flex flex-col gap-4 px-4 py-6 pb-32.5 lg:hidden">
                {/* Banner */}
                <div className="bg-white border-brutal shadow-brutal flex items-center gap-3 px-3 py-3">
                    <div className="bg-mocha text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] shrink-0">
                        {editOriginalName ? 'EDIT' : 'PICK'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-sans text-[17px] font-bold leading-tight">
                            {editOriginalName
                                ? `Editing ${editOriginalName}'s response`
                                : 'When are you free?'}
                        </div>
                        <div className="font-mono text-[10px] text-ink/55 mt-0.5">
                            TAP · DRAG TO PAINT MANY
                        </div>
                    </div>
                </div>

                <NamePanel name={name} onNameChange={setName} editOriginalName={editOriginalName} />
                <QuickPicks onPick={handleQuickPick} />
                <RespondMonthGrids {...monthGridsProps} />

                {/* Mobile help + stat */}
                <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
                    <div>TAP toggle · DRAG paint multiple · ⇧ CLICK range</div>
                </div>
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout ── */}
            <div className="hidden lg:block py-8">
                <div className="mx-auto w-full max-w-[1600px] px-6 xl:px-10">
                    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
                        {/* Sidebar */}
                        <aside className="flex flex-col gap-4 sticky top-6 self-start">
                            <NamePanel
                                name={name}
                                onNameChange={setName}
                                editOriginalName={editOriginalName}
                            />
                            <QuickPicks onPick={handleQuickPick} />
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
                                    disabled={
                                        !name.trim() ||
                                        saveMutation.isPending ||
                                        saveMutation.isSuccess
                                    }
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
                            <RespondMonthGrids {...monthGridsProps} />
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
            />
        </>
    )
}

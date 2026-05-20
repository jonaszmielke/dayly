'use client'

import { MeetingFooter } from '../_components/Footer'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { RespondCell } from '@/components/calendar/RespondCell'
import { StatCard } from '@/components/StatCard'
import { dateRange, formatDate, getDisplayMonths, ymd } from '@/lib/dates'
import { MOCK_MEETING } from '@/lib/mock'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const meeting = MOCK_MEETING
const rangeStart = ymd(meeting.startDate)
const rangeEnd = ymd(meeting.endDate)

type SaveState = 'idle' | 'saving' | 'saved'

const RespondPage = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [dragging, setDragging] = useState<'add' | 'remove' | null>(null)
    const [anchor, setAnchor] = useState<string | null>(null)
    const [hoveredDate, setHoveredDate] = useState<string | null>(null)
    const [saveState, setSaveState] = useState<SaveState>('idle')

    const displayMonths = getDisplayMonths(rangeStart, rangeEnd)

    const handleMouseDown = useCallback(
        (iso: string, shiftKey: boolean) => {
            if (shiftKey && anchor) {
                const [a, b] = anchor <= iso ? [anchor, iso] : [iso, anchor]
                const range = dateRange(a, b).filter(
                    (d) => d >= rangeStart && d <= rangeEnd
                )
                const anchorSelected = selected.has(anchor)
                const mode = anchorSelected ? 'add' : 'remove'
                setSelected((prev) => {
                    const next = new Set(prev)
                    range.forEach((d) => {
                        if (mode === 'add') next.add(d)
                        else next.delete(d)
                    })
                    return next
                })
                setAnchor(iso)
                return
            }
            const isSelected = selected.has(iso)
            const mode = isSelected ? 'remove' : 'add'
            setDragging(mode)
            setAnchor(iso)
            setSelected((prev) => {
                const next = new Set(prev)
                if (mode === 'remove') next.delete(iso)
                else next.add(iso)
                return next
            })
        },
        [selected, anchor]
    )

    const handleMouseEnter = useCallback(
        (iso: string) => {
            setHoveredDate(iso)
            if (!dragging) return
            setSelected((prev) => {
                const next = new Set(prev)
                if (dragging === 'remove') next.delete(iso)
                else next.add(iso)
                return next
            })
        },
        [dragging]
    )

    const handleMouseLeave = useCallback(() => {
        setHoveredDate(null)
    }, [])

    useEffect(() => {
        const onUp = () => setDragging(null)
        window.addEventListener('mouseup', onUp)
        return () => window.removeEventListener('mouseup', onUp)
    }, [])

    const handleReset = () => {
        setSelected(new Set())
    }

    const handleSave = async () => {
        if (!name.trim() || saveState !== 'idle') return
        setSaveState('saving')
        // Simulate save — replace with real API call
        await new Promise((r) => setTimeout(r, 600))
        setSaveState('saved')
        setTimeout(() => router.push(`/${meeting.shortId}`), 600)
    }

    const handleQuickPick = (type: 'weekends' | 'weekdays') => {
        const all = dateRange(rangeStart, rangeEnd)
        const filtered = all.filter((iso) => {
            const dow = new Date(iso + 'T00:00:00').getDay()
            const isWeekend = dow === 0 || dow === 6
            return type === 'weekends' ? isWeekend : !isWeekend
        })
        setSelected((prev) => {
            const next = new Set(prev)
            filtered.forEach((iso) => next.add(iso))
            return next
        })
    }

    const statRows = [
        { label: 'Range', value: `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}` },
        { label: 'Mode', value: meeting.mode },
        { label: 'Respond by', value: formatDate(ymd(meeting.deadline)) ?? '—' },
    ]

    const saveLabel =
        saveState === 'saving' ? 'SAVING…' : saveState === 'saved' ? '✓ SAVED' : 'SAVE'

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
                {/* Name panel */}
                <div className="bg-white border-brutal shadow-brutal">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-ink/20">
                        <span className="font-sans text-[13px] font-bold uppercase tracking-[0.08em]">
                            Your Name
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mocha">
                            Required
                        </span>
                    </div>
                    <div className="p-3 relative">
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
                            style={{
                                caretColor: '#7E6038',
                            }}
                        />
                    </div>
                </div>

                {/* Quick picks */}
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
                        disabled={!name.trim() || saveState !== 'idle'}
                        className={cn(
                            'py-3 border-brutal font-sans text-[13px] font-bold uppercase tracking-[0.08em] transition-all press-effect',
                            saveState === 'saved'
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

                {/* Help */}
                <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
                    <div>CLICK to toggle a day</div>
                    <div>DRAG to select multiple</div>
                    <div>⇧ CLICK for range</div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex flex-col gap-6">
                {/* Banner */}
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

                {/* Month grids */}
                {displayMonths.map(({ year, month }) => (
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
                                onMouseDown={handleMouseDown}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        )}
                    />
                ))}

                <MeetingFooter />
            </main>
        </div>
    )
}

export default RespondPage

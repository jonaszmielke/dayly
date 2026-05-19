'use client'

import { useState } from 'react'
import { TopBar } from '@/components/TopBar'
import { StatCard } from '@/components/StatCard'
import { DateRangePicker } from '@/components/calendar/DateRangePicker'
import { SingleDatePicker } from '@/components/calendar/SingleDatePicker'
import { formatDate, daysBetweenInclusive, ymd } from '@/lib/dates'
import { cn } from '@/lib/utils'

const today = ymd(new Date())
const MAX_NAME = 48

export default function CreatePage() {
    const [name, setName] = useState('')
    const [mode, setMode] = useState<'days' | 'hours'>('days')
    const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
        start: null,
        end: null,
    })
    const [deadline, setDeadline] = useState<string | null>(null)

    const handleSubmit = () => {
        console.log({ name, mode, dateRange, deadline })
    }

    const canSubmit = name.trim() && dateRange.start && dateRange.end && deadline

    const statRows = [
        { label: 'Name', value: name || '—' },
        { label: 'Mode', value: mode === 'days' ? 'DAYS' : 'HOURS' },
        {
            label: 'Range',
            value:
                dateRange.start && dateRange.end
                    ? `${daysBetweenInclusive(dateRange.start, dateRange.end)} days`
                    : '—',
        },
        { label: 'Deadline', value: formatDate(deadline) || '—' },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar
                crumbs={[
                    { label: 'Surveys', href: '/' },
                    { label: 'New' },
                ]}
                title="CREATE SURVEY"
                meta={['STEP 1/1', 'BASICS', 'NO ACCOUNT NEEDED']}
                right={
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-ink text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em]">
                            DRAFT
                        </div>
                        <span className="font-mono text-[11px] text-ink/50">
                            dayly.cz/new
                        </span>
                    </div>
                }
            />

            <div className="flex-1 flex justify-center px-6 py-10">
                <div className="w-full max-w-[760px] flex flex-col gap-9">
                    {/* Section 1: Name */}
                    <Section number="01" title="Meeting Name" hint={`${name.length}/${MAX_NAME}`}>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value.toUpperCase().slice(0, MAX_NAME))
                                }
                                placeholder="NAME YOUR MEETING"
                                maxLength={MAX_NAME}
                                className={cn(
                                    'w-full bg-white border-brutal shadow-brutal px-4 py-[18px] pr-20',
                                    'font-sans text-[28px] font-bold uppercase',
                                    'placeholder:text-ink/30 text-ink',
                                    'outline-none focus:shadow-brutal-mocha',
                                    'transition-shadow',
                                )}
                            />
                            <span className="absolute right-4 top-4 font-mono text-[11px] text-ink/40">
                                {name.length}/{MAX_NAME}
                            </span>
                        </div>
                    </Section>

                    {/* Section 2: Mode */}
                    <Section number="02" title="Meeting Mode" hint="BY HOUR coming soon">
                        <div className="grid grid-cols-2 gap-4">
                            <ModeCard
                                active={mode === 'days'}
                                onClick={() => setMode('days')}
                                title="Day-only"
                                desc="Pick full days you're free"
                                glyph={
                                    <div className="grid grid-cols-7 gap-0.5">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[6px] h-[6px]"
                                                style={{
                                                    backgroundColor:
                                                        [2, 5, 7, 8, 9, 12].includes(i)
                                                            ? mode === 'days' ? '#7E6038' : '#7E6038'
                                                            : mode === 'days' ? 'rgba(236,226,203,0.4)' : 'rgba(22,21,20,0.2)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                }
                            />
                            <ModeCard
                                active={false}
                                disabled
                                onClick={() => {}}
                                title="By Hour"
                                desc="Pick specific time slots"
                                badge="SOON"
                                glyph={null}
                            />
                        </div>
                    </Section>

                    {/* Section 3: Date Range */}
                    <Section number="03" title="Date Range" hint="When could the meeting happen?">
                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            minDate={today}
                        />
                    </Section>

                    {/* Section 4: Deadline */}
                    <Section number="04" title="Response Deadline" hint="By when should people respond?">
                        <SingleDatePicker
                            value={deadline}
                            onChange={setDeadline}
                            placeholder="SELECT DEADLINE"
                            minDate={today}
                            label="DEADLINE"
                        />
                    </Section>

                    {/* Recap */}
                    <StatCard rows={statRows} />

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={cn(
                            'w-full py-5 border-brutal shadow-brutal',
                            'font-sans text-[22px] font-bold uppercase tracking-[0.04em]',
                            'transition-all press-effect-mocha',
                            canSubmit
                                ? 'bg-mocha text-paper-2 hover:bg-mocha-dark'
                                : 'bg-paper-2 text-ink/30 cursor-not-allowed',
                        )}
                    >
                        Create Survey →
                    </button>
                </div>
            </div>
        </div>
    )
}

function Section({
    number,
    title,
    hint,
    children,
}: {
    number: string
    title: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-ink text-paper-2 w-7 h-7 flex items-center justify-center font-mono text-[12px]">
                        {number}
                    </div>
                    <h2 className="font-sans text-[22px] font-bold">{title}</h2>
                </div>
                {hint && (
                    <span className="font-mono text-[11px] text-ink/45 uppercase tracking-[0.08em]">
                        {hint}
                    </span>
                )}
            </div>
            {children}
        </div>
    )
}

function ModeCard({
    active,
    disabled,
    onClick,
    title,
    desc,
    badge,
    glyph,
}: {
    active: boolean
    disabled?: boolean
    onClick: () => void
    title: string
    desc: string
    badge?: string
    glyph: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'grid items-start text-left p-4 border-brutal transition-all',
                active
                    ? 'bg-ink text-paper-2 shadow-brutal-mocha'
                    : disabled
                      ? 'bg-paper-2 opacity-60 cursor-not-allowed shadow-brutal-xs'
                      : 'bg-white shadow-brutal hover:shadow-brutal-sm press-effect',
            )}
            style={{ gridTemplateColumns: '24px 1fr auto' }}
        >
            <span className="font-mono text-[22px] leading-none mt-0.5">
                {active ? '■' : '□'}
            </span>
            <div>
                <div className="font-sans text-[16px] font-bold">{title}</div>
                <div
                    className={cn(
                        'font-sans text-[13px] mt-0.5',
                        active ? 'text-paper-2/70' : 'text-ink/60',
                    )}
                >
                    {desc}
                </div>
                {badge && (
                    <span className="inline-block mt-2 bg-ink/10 font-mono text-[10px] uppercase tracking-[0.1em] px-1.5 py-0.5">
                        {badge}
                    </span>
                )}
            </div>
            <div className="pt-1">{glyph}</div>
        </button>
    )
}

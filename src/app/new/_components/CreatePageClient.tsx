'use client'

import { createMeeting, CreateMeetingProps } from '../_actions/createMeeting'
import { CreateSection } from './CreateSection'
import { HourSelect } from './HourSelect'
import { ModeCard } from './ModeCard'
import { DateRangePicker } from '@/components/calendar/DateRangePicker'
import { SingleDatePicker } from '@/components/calendar/SingleDatePicker'
import { StatCard } from '@/components/StatCard'
import { TopBar } from '@/components/TopBar'
import { MeetingMode } from '@/generated/prisma/enums'
import { daysBetweenInclusive, formatDate, formatHour, timezones, ymd } from '@/lib/dates'
import { appShortUrl, cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const today = ymd(new Date())
const MAX_NAME = 48

const CreatePageClient = () => {
    const [name, setName] = useState<string>('')
    const [mode, setMode] = useState<MeetingMode>(MeetingMode.DAYS)
    const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
        start: null,
        end: null,
    })
    const [deadline, setDeadline] = useState<string | null>(null)
    const [startHour, setStartHour] = useState(8)
    const [endHour, setEndHour] = useState(16)
    const [timezone, setTimezone] = useState<string>('UTC')
    const [detectedTimeZone, setDetectedTimeZone] = useState<string>('UTC')
    const router = useRouter()

    const sortedTimezones = useMemo(() => [...timezones].sort(), [])

    useEffect(() => {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (timezones.has(detected)) {
            setTimezone(detected)
            setDetectedTimeZone(detected)
        }
    }, [])

    const createMeetingMutation = useMutation({
        mutationFn: (props: CreateMeetingProps) => createMeeting(props),
        onSuccess: (response) => {
            if (response.success) router.push(`/m/${response.shortId}`)
        },
    })

    const hoursValid = endHour > startHour
    const canSubmit = Boolean(
        name.trim() &&
        dateRange.start &&
        dateRange.end &&
        deadline &&
        (mode === MeetingMode.DAYS || hoursValid)
    )

    const handleSubmit = () => {
        if (!name.trim() || !dateRange.start || !dateRange.end || !deadline) return
        const base = { name, dateRange: { start: dateRange.start, end: dateRange.end }, deadline }
        if (mode === MeetingMode.HOURS) {
            createMeetingMutation.mutate({
                ...base,
                mode: MeetingMode.HOURS,
                startHour,
                endHour,
                timezone,
            })
        } else {
            createMeetingMutation.mutate({ ...base, mode: MeetingMode.DAYS })
        }
    }

    const handleStartHourChange = (v: number) => {
        setStartHour(v)
        if (endHour <= v) setEndHour(Math.min(v + 1, 24))
    }

    const statRows = [
        { label: 'Name', value: name || '—' },
        { label: 'Mode', value: mode },
        {
            label: 'Range',
            value:
                dateRange.start && dateRange.end
                    ? `${daysBetweenInclusive(dateRange.start, dateRange.end)} days`
                    : '—',
        },
        ...(mode === MeetingMode.HOURS
            ? [
                  {
                      label: 'Hours',
                      value: hoursValid
                          ? `${formatHour(startHour)} → ${formatHour(endHour)} · ${endHour - startHour} hrs/day`
                          : '—',
                  },
                  { label: 'Timezone', value: timezone },
              ]
            : []),
        { label: 'Deadline', value: deadline ? formatDate(deadline) : '—' },
    ]

    const deadlineSectionNumber = mode === MeetingMode.HOURS ? '06' : '04'

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar
                crumbs={[{ label: 'Surveys', href: '/' }, { label: 'New' }]}
                title="NEW MEETING"
                right={
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-ink text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest">
                            DRAFT
                        </div>
                        <span className="font-mono text-[11px] text-ink/50">
                            {appShortUrl()}/new
                        </span>
                    </div>
                }
            />

            <div className="flex-1 flex justify-center px-6 py-10">
                <div className="w-full max-w-[760px] flex flex-col gap-9">
                    {/* Section 1: Name */}
                    <CreateSection
                        number="01"
                        title="Meeting Name"
                        hint={`${name.length}/${MAX_NAME}`}
                    >
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
                                    'transition-shadow'
                                )}
                            />
                            <span className="absolute right-4 top-4 font-mono text-[11px] text-ink/40">
                                {name.length}/{MAX_NAME}
                            </span>
                        </div>
                    </CreateSection>

                    {/* Section 2: Mode */}
                    <CreateSection number="02" title="Meeting Mode" hint="HOW DO WE PICK?">
                        <div className="grid grid-cols-2 gap-4">
                            <ModeCard
                                active={mode === MeetingMode.DAYS}
                                onClick={() => setMode(MeetingMode.DAYS)}
                                title="Day-only"
                                desc="Pick full days you're free"
                                glyph={
                                    <div className="grid grid-cols-7 gap-0.5">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[6px] h-[6px]"
                                                style={{
                                                    backgroundColor: [2, 5, 7, 8, 9, 12].includes(i)
                                                        ? '#7E6038'
                                                        : mode === MeetingMode.DAYS
                                                          ? 'rgba(236,226,203,0.4)'
                                                          : 'rgba(22,21,20,0.2)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                }
                            />
                            <ModeCard
                                active={mode === MeetingMode.HOURS}
                                onClick={() => setMode(MeetingMode.HOURS)}
                                title="By Hour"
                                desc="Pick specific time slots"
                                glyph={
                                    <div className="grid grid-cols-7 gap-0.5">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[6px] h-[6px]"
                                                style={{
                                                    backgroundColor: [3, 4, 5, 10, 11].includes(i)
                                                        ? '#7E6038'
                                                        : mode === MeetingMode.HOURS
                                                          ? 'rgba(236,226,203,0.4)'
                                                          : 'rgba(22,21,20,0.2)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                }
                            />
                        </div>
                    </CreateSection>

                    {/* Section 3: Date Range */}
                    <CreateSection
                        number="03"
                        title="Date Range"
                        hint="When could the meeting happen?"
                    >
                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            minDate={today}
                        />
                    </CreateSection>

                    {/* Section 4: Suitable Hours (HOURS mode only) */}
                    {mode === MeetingMode.HOURS && (
                        <CreateSection
                            number="04"
                            title="Suitable Hours"
                            hint="Which part of the day?"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-6">
                                    <HourSelect
                                        label="FROM"
                                        value={startHour}
                                        onChange={handleStartHourChange}
                                    />

                                    <HourSelect
                                        label="TO"
                                        value={endHour}
                                        onChange={(value) => setEndHour(value)}
                                        fromHour={startHour}
                                    />
                                </div>

                                <div
                                    className={cn(
                                        'font-mono text-[11px] tracking-widest uppercase ',
                                        hoursValid ? 'text-ink/50' : 'text-red-600'
                                    )}
                                >
                                    {hoursValid
                                        ? `${endHour - startHour} HOURS / DAY`
                                        : 'END MUST BE AFTER START'}
                                </div>
                            </div>
                        </CreateSection>
                    )}

                    {/* Section 5: Timezone (HOURS mode only) */}
                    {mode === MeetingMode.HOURS && (
                        <CreateSection
                            number="05"
                            title="Timezone"
                            hint={timezone === detectedTimeZone ? 'AUTO-DETECTED' : 'CUSTOM'}
                        >
                            <div className="relative border-brutal shadow-brutal bg-white transition-all">
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full appearance-none bg-transparent font-sans font-bold text-[22px] uppercase text-ink outline-none cursor-pointer"
                                    style={{ padding: '18px 48px 18px 16px' }}
                                >
                                    {sortedTimezones.map((tz) => (
                                        <option key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-ink/50">
                                    ▾
                                </span>
                            </div>
                        </CreateSection>
                    )}

                    {/* Section 4/6: Deadline */}
                    <CreateSection
                        number={deadlineSectionNumber}
                        title="Response Deadline"
                        hint="By when should people respond?"
                    >
                        <SingleDatePicker
                            value={deadline}
                            onChange={setDeadline}
                            placeholder="SELECT DEADLINE"
                            minDate={today}
                            label="DEADLINE"
                        />
                    </CreateSection>

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
                                : 'bg-paper-2 text-ink/30 cursor-not-allowed'
                        )}
                    >
                        Create Survey →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreatePageClient

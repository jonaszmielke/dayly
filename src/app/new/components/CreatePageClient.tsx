'use client'

import { DEADLINE_SECTION_NUMBER, MAX_DAYS_BY_MODE } from '../constants'
import { useCreateMeetingForm } from '../hooks/useCreateMeetingForm'
import { DraftBadge } from './DraftBadge'
import { DateRangeSection } from './sections/DateRangeSection'
import { DeadlineSection } from './sections/DeadlineSection'
import { HoursSection } from './sections/HoursSection'
import { ModeSection } from './sections/ModeSection'
import { NameSection } from './sections/NameSection'
import { TimezoneSection } from './sections/TimezoneSection'
import { SubmitButton } from './SubmitButton'
import { StatCard } from '@/components/StatCard'
import { TopBar } from '@/components/topbar/TopBar'
import { MeetingMode } from '@/generated/prisma/enums'
import { useToday } from '@/hooks/useToday'

const CRUMBS = [{ label: 'Surveys', href: '/' }, { label: 'New' }]

const CreatePageClient = () => {
    const form = useCreateMeetingForm()
    // null until hydration; the pickers can't be opened before that anyway.
    const minDate = useToday() ?? undefined

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar crumbs={CRUMBS} title="NEW MEETING" right={<DraftBadge />} />

            <div className="flex-1 flex justify-center px-6 py-10">
                <div className="w-full max-w-190 flex flex-col gap-9">
                    <NameSection name={form.name} onNameChange={form.changeName} />
                    <ModeSection mode={form.mode} onModeChange={form.changeMode} />
                    <DateRangeSection
                        value={form.dateRange}
                        onChange={form.setDateRange}
                        minDate={minDate}
                        maxDays={MAX_DAYS_BY_MODE[form.mode]}
                    />

                    {form.mode === MeetingMode.HOURS && (
                        <>
                            <HoursSection
                                startHour={form.startHour}
                                endHour={form.endHour}
                                onStartHourChange={form.changeStartHour}
                                onEndHourChange={form.setEndHour}
                            />
                            <TimezoneSection
                                timezone={form.timezone}
                                isDetected={form.isTimezoneDetected}
                                onTimezoneChange={form.setPickedTimezone}
                            />
                        </>
                    )}

                    <DeadlineSection
                        number={DEADLINE_SECTION_NUMBER[form.mode]}
                        deadline={form.deadline}
                        onDeadlineChange={form.setDeadline}
                        minDate={minDate}
                    />

                    <StatCard rows={form.statRows} />
                    <SubmitButton canSubmit={form.canSubmit} onSubmit={form.submit} />
                </div>
            </div>
        </div>
    )
}

export default CreatePageClient

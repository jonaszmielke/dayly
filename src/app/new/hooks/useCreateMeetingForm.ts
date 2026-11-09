import { createMeeting, type CreateMeetingProps } from '../actions/createMeeting'
import { MAX_DAYS_BY_MODE, MAX_NAME } from '../constants'
import { buildStatRows } from '../statRows'
import { type DateRangeValue } from '@/components/calendar/pickers/DateRangePicker'
import { MeetingMode } from '@/generated/prisma/enums'
import { useActionMutation } from '@/hooks/useActionMutation'
import { useDetectedTimezone } from '@/hooks/useDetectedTimezone'
import { daysBetweenInclusive } from '@/lib/dates'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useCreateMeetingForm = () => {
    const router = useRouter()

    const [name, setName] = useState('')
    const [mode, setMode] = useState<MeetingMode>(MeetingMode.DAYS)
    const [dateRange, setDateRange] = useState<DateRangeValue>({ start: null, end: null })
    const [deadline, setDeadline] = useState<string | null>(null)
    const [startHour, setStartHour] = useState(8)
    const [endHour, setEndHour] = useState(16)

    const detectedTimezone = useDetectedTimezone()
    const [pickedTimezone, setPickedTimezone] = useState<string | null>(null)
    const timezone = pickedTimezone ?? detectedTimezone

    const createMeetingMutation = useActionMutation({
        mutationFn: (props: CreateMeetingProps) => createMeeting(props),
        onSuccess: (response) => router.push(`/m/${response.shortId}`),
    })

    const hoursValid = endHour > startHour
    const canSubmit = Boolean(
        name.trim() && dateRange.start && dateRange.end && (mode === MeetingMode.DAYS || hoursValid)
    )

    const changeName = (value: string) => setName(value.toUpperCase().slice(0, MAX_NAME))

    const changeMode = (newMode: MeetingMode) => {
        if (mode === newMode) return
        if (daysBetweenInclusive(dateRange.start, dateRange.end) > MAX_DAYS_BY_MODE[newMode]) {
            setDateRange({ start: null, end: null })
        }
        setMode(newMode)
    }

    const changeStartHour = (hour: number) => {
        setStartHour(hour)
        if (endHour <= hour) setEndHour(Math.min(hour + 1, 24))
    }

    const submit = () => {
        if (!name.trim() || !dateRange.start || !dateRange.end) return
        const base = {
            name,
            dateRange: { start: dateRange.start, end: dateRange.end },
            deadline: deadline ?? undefined,
        }
        if (mode === MeetingMode.HOURS) {
            createMeetingMutation.mutate({
                ...base,
                mode: MeetingMode.HOURS,
                startHour,
                endHour,
                timezone,
            })
            return
        }
        createMeetingMutation.mutate({ ...base, mode: MeetingMode.DAYS })
    }

    const statRows = buildStatRows({
        name,
        mode,
        dateRange,
        startHour,
        endHour,
        timezone,
        deadline,
    })

    return {
        name,
        changeName,
        mode,
        changeMode,
        dateRange,
        setDateRange,
        deadline,
        setDeadline,
        startHour,
        changeStartHour,
        endHour,
        setEndHour,
        timezone,
        isTimezoneDetected: timezone === detectedTimezone,
        setPickedTimezone,
        canSubmit,
        submit,
        statRows,
    }
}

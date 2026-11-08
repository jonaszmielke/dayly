import { HourGrid } from '@/components/calendar/HourGrid'
import { RespondHourCell } from '@/components/calendar/RespondHourCell'
import { slotKey, type WeekCell } from '@/lib/dates'
import type { ComponentProps } from 'react'

type RespondHourGridsProps = {
    weeks: WeekCell[][]
    hours: number[]
    selected: Set<string>
    hoveredSlot: string | null
} & Pick<ComponentProps<typeof HourGrid>, 'onToggleDay' | 'onToggleHour'> &
    Pick<
        ComponentProps<typeof RespondHourCell>,
        'onPointerDown' | 'onPointerEnter' | 'onPointerLeave'
    >

export const RespondHourGrids = ({
    weeks,
    hours,
    selected,
    hoveredSlot,
    onToggleDay,
    onToggleHour,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
}: RespondHourGridsProps) =>
    weeks.map((week) => (
        <HourGrid
            key={week[0].date}
            week={week}
            hours={hours}
            onToggleDay={onToggleDay}
            onToggleHour={onToggleHour}
            cellRenderer={({ date, hour, inRange }) => (
                <RespondHourCell
                    date={date}
                    hour={hour}
                    inRange={inRange}
                    selected={selected.has(slotKey(date, hour))}
                    hovered={hoveredSlot === slotKey(date, hour)}
                    onPointerDown={onPointerDown}
                    onPointerEnter={onPointerEnter}
                    onPointerLeave={onPointerLeave}
                />
            )}
        />
    ))

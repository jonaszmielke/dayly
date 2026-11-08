'use client'

import { HeroCell } from './HeroCell'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { MonthGridSkeleton } from '@/components/calendar/MonthGridSkeleton'
import { useToday } from '@/hooks/useToday'
import { parseISO, ymd } from '@/lib/dates'

const HERO_TOTAL = 5

const heroFreeCount = (dom: number): number => {
    const n = (dom * 9301 + 49297) % 233280
    return Math.floor((n / 233280) * (HERO_TOTAL + 1))
}

export const HeroGrid = () => {
    const today = useToday()

    if (!today) return <MonthGridSkeleton />

    const now = parseISO(today)
    const year = now.getFullYear()
    const month = now.getMonth()
    const monthStart = ymd(new Date(year, month, 1))
    const monthEnd = ymd(new Date(year, month + 1, 0))

    return (
        <MonthGrid
            year={year}
            month={month}
            rangeStart={monthStart}
            rangeEnd={monthEnd}
            cellAspectClassName="aspect-square lg:aspect-[140/100]"
            cellRenderer={({ cell, inRange }) => (
                <HeroCell
                    cell={cell}
                    inRange={inRange}
                    freeCount={heroFreeCount(cell.dom)}
                    totalCount={HERO_TOTAL}
                />
            )}
        />
    )
}

import { type Person } from '../../../types'
import { BestDayBanner } from './BestDayBanner'
import { BestHoursBanner } from './BestHoursBanner'
import { type BestHoursResult, type BestResult } from '@/lib/dates'

type BestBannerProps = {
    isHours: boolean
    bestDays: BestResult | null
    bestHours: BestHoursResult | null
    meetingShortId: string
    responsesLength: number
    selectedPerson: Person | null
    isLoading: boolean
}

/** Picks the day- or hour-mode "best" banner. */
export const BestBanner = ({ isHours, bestDays, bestHours, ...shared }: BestBannerProps) => {
    if (isHours) return <BestHoursBanner best={bestHours} {...shared} />
    return <BestDayBanner best={bestDays} {...shared} />
}

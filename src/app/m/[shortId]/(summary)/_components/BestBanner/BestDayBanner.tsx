import { Person } from '../../../types'
import { BestBannerLoading } from './BestBannerLoading'
import { BestBannerNoResponses } from './BestBannerNoResponses'
import { BestResult, daysBetweenInclusive, formatDateMedium } from '@/lib/dates'

type BestDayBannerProps = {
    meetingShortId: string
    responsesLength: number
    selectedPerson: Person | null
    best: BestResult | null
    isLoading?: boolean
}

export const BestDayBanner = ({
    meetingShortId,
    responsesLength,
    selectedPerson,
    best,
    isLoading = false,
}: BestDayBannerProps) => {
    if (isLoading) return <BestBannerLoading />

    const hasResponses = responsesLength > 0 && !!best

    return (
        <div
            className="bg-white border-brutal flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-3 lg:py-4"
            style={{ boxShadow: 'var(--b-shadow-sm) #C5AC6A' }}
        >
            {hasResponses ? (
                <BestDayBannerWithResponses
                    responsesLength={responsesLength}
                    selectedPerson={selectedPerson}
                    best={best}
                />
            ) : (
                <BestBannerNoResponses meetingShortId={meetingShortId} />
            )}
        </div>
    )
}

type WithResponsesProps = {
    responsesLength: number
    selectedPerson: Person | null
    best: BestResult
}

const BestDayBannerWithResponses = ({
    responsesLength,
    selectedPerson,
    best,
}: WithResponsesProps) => {
    return (
        <>
            <div className="bg-ink text-paper-2 px-2 py-1.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.12em] shrink-0">
                {selectedPerson !== null ? 'SOLO' : 'BEST'}
            </div>
            <div className="flex-1 min-w-0">
                {selectedPerson !== null ? (
                    <>
                        <div className="font-sans text-[17px] lg:text-[22px] font-bold leading-tight uppercase truncate">
                            {selectedPerson.name} is available
                        </div>
                        <div className="font-mono text-[10px] lg:text-[11px] text-ink/60 mt-0.5 uppercase tracking-[0.08em]">
                            {selectedPerson.daysCount} DAYS SELECTED
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-sans text-[17px] lg:text-[22px] font-bold leading-tight">
                            {formatDateMedium(best.range![0])} — {formatDateMedium(best.range![1])}
                        </div>
                        <div className="font-mono text-[10px] lg:text-[11px] text-ink/60 mt-0.5">
                            ALL {best.max}/{responsesLength} FREE ·{' '}
                            {daysBetweenInclusive(best.range![0], best.range![1])} DAYS
                        </div>
                    </>
                )}
            </div>
            <span className="font-mono text-[16px] lg:text-[20px] text-ink/30">↘</span>
        </>
    )
}

import { Person } from '../../../types'
import { BestBannerLoading } from './BestBannerLoading'
import { BestBannerNoResponses } from './BestBannerNoResponses'
import { BestHoursResult, formatDateMedium, formatHour } from '@/lib/dates'

type BestHoursBannerProps = {
    meetingShortId: string
    responsesLength: number
    selectedPerson: Person | null
    best: BestHoursResult | null
    isLoading?: boolean
}

export const BestHoursBanner = ({
    meetingShortId,
    responsesLength,
    selectedPerson,
    best,
    isLoading = false,
}: BestHoursBannerProps) => {
    if (isLoading) return <BestBannerLoading />

    const hasResponses = responsesLength > 0 && !!best

    return (
        <div
            className="bg-white border-brutal flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-3 lg:py-4"
            style={{ boxShadow: 'var(--b-shadow-sm) #C5AC6A' }}
        >
            {hasResponses ? (
                <BestHoursBannerWithResponses
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
    best: BestHoursResult
}

const BestHoursBannerWithResponses = ({
    responsesLength,
    selectedPerson,
    best,
}: WithResponsesProps) => {
    const length = best.endHour - best.startHour

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
                            {selectedPerson.daysCount} SLOTS SELECTED
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-sans text-[17px] lg:text-[22px] font-bold leading-tight">
                            {formatDateMedium(best.day)} · {formatHour(best.startHour)}–
                            {formatHour(best.endHour)}
                        </div>
                        <div className="font-mono text-[10px] lg:text-[11px] text-ink/60 mt-0.5">
                            ALL {best.max}/{responsesLength} FREE · {length} HRS
                        </div>
                    </>
                )}
            </div>
            <span className="font-mono text-[16px] lg:text-[20px] text-ink/30">↘</span>
        </>
    )
}

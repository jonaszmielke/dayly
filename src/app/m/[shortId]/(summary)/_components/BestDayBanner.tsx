import { Person } from '../../types'
import { BestResult, daysBetweenInclusive, formatDateMedium } from '@/lib/dates'
import Link from 'next/link'

type BestDayBannerProps = {
    meetingShortId: string
    responsesLength: number
    selectedPerson: Person | null
    best: BestResult | null
}

export const BestDayBanner = ({
    meetingShortId,
    responsesLength,
    selectedPerson,
    best,
}: BestDayBannerProps) => {
    const hasResponses = responsesLength > 0 && !!best

    return (
        <div
            className="bg-white border-brutal flex items-center gap-4 px-5 py-4"
            style={{ boxShadow: 'var(--b-shadow) #C5AC6A' }}
        >
            {hasResponses ? (
                <BestDayBannerWithResponses
                    responsesLength={responsesLength}
                    selectedPerson={selectedPerson}
                    best={best}
                />
            ) : (
                <BestDayBannerNoResponses meetingShortId={meetingShortId} />
            )}
        </div>
    )
}

const BestDayBannerNoResponses = ({ meetingShortId }: { meetingShortId: string }) => {
    return (
        <>
            <div className="flex-1 flex flex-col items-start gap-2">
                <div className="bg-ink text-paper-2 px-2.5 py-1.5 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em]">
                    NO RESPONSES YET
                </div>
                <div className="font-sans text-[22px] font-bold leading-tight">
                    Be the first one to respond.
                </div>
            </div>
            <Link href={`/m/${meetingShortId}/respond`}>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-sm font-sans text-[13px] font-bold uppercase tracking-[0.08em] press-effect-mocha">
                    <span className="inline-flex items-center justify-center w-[18px] h-[18px] border border-paper-2 font-mono text-[12px] leading-none">
                        +
                    </span>
                    ADD YOUR RESPONSE
                </button>
            </Link>
            <span className="font-mono text-[20px] text-ink/30">↗</span>
        </>
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
            <div className="bg-ink text-paper-2 px-2.5 py-1.5 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em]">
                {selectedPerson !== null ? 'SOLO' : 'BEST'}
            </div>
            <div className="flex-1">
                {selectedPerson !== null ? (
                    <>
                        <div className="font-sans text-[22px] font-bold leading-tight uppercase">
                            {selectedPerson.name} is available
                        </div>
                        <div className="font-mono text-[11px] text-ink/60 mt-0.5 uppercase tracking-[0.08em]">
                            {selectedPerson.daysCount} DAYS SELECTED
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-sans text-[22px] font-bold leading-tight">
                            {formatDateMedium(best.range![0])} — {formatDateMedium(best.range![1])}
                        </div>
                        <div className="font-mono text-[11px] text-ink/60 mt-0.5">
                            ALL {best.max}/{responsesLength} FREE ·{' '}
                            {daysBetweenInclusive(best.range![0], best.range![1])} CONSECUTIVE DAYS
                        </div>
                    </>
                )}
            </div>
            <span className="font-mono text-[20px] text-ink/30">↘</span>
        </>
    )
}

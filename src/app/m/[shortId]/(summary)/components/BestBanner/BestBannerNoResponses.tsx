import Link from 'next/link'

export const BestBannerNoResponses = ({ meetingShortId }: { meetingShortId: string }) => {
    return (
        <>
            <div className="bg-ink text-paper-2 px-2 py-1.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.12em] shrink-0">
                NO RESPONSES
            </div>
            <div className="flex-1 min-w-0 font-sans text-[15px] lg:text-[18px] font-bold leading-tight truncate">
                Be the first to respond.
            </div>
            <Link href={`/m/${meetingShortId}/respond`}>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-sm font-sans text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.08em] press-effect-mocha shrink-0">
                    <span className="inline-flex items-center justify-center w-4 h-4 border border-paper-2 font-mono text-[11px] leading-none">
                        +
                    </span>
                    ADD RESPONSE
                </button>
            </Link>
            <span className="font-mono text-[16px] lg:text-[20px] text-ink/30 hidden lg:inline">
                ↗
            </span>
        </>
    )
}

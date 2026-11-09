import Link from 'next/link'

type PanelHeaderProps = {
    meetingShortId: string
}

export const PanelHeader = ({ meetingShortId }: PanelHeaderProps) => (
    <div className="flex items-center justify-between px-4 py-3 border-b-[1.5px] border-ink">
        <span className="font-sans text-[18px] font-bold tracking-[-0.01em]">WHO&apos;S IN</span>
        <Link
            href={`/m/${meetingShortId}/respond`}
            aria-label="Add your availability"
            className="inline-flex items-center justify-center size-7  bg-ink text-paper-2 border-brutal shadow-brutal-mocha-xs font-sans text-[16px] font-bold leading-none press-effect-mocha"
        >
            <span aria-hidden="true">+</span>
        </Link>
    </div>
)

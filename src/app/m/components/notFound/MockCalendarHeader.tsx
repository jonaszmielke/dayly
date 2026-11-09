export const MockCalendarHeader = () => (
    <div className="px-4 lg:px-5 pt-6 pb-[14px] border-b-2 border-ink bg-white flex items-baseline justify-between">
        <div className="font-sans text-[22px] lg:text-[26px] font-extrabold tracking-[-0.03em] leading-none text-ink/35">
            —{' '}
            <span className="font-mono text-[12px] lg:text-[14px] font-medium tracking-[-0.01em] text-ink/30 ml-1">
                —
            </span>
        </div>
        <div className="font-mono text-[9px] lg:text-[10px] uppercase tracking-widest text-ink/35 flex items-center gap-2 lg:gap-3">
            <MockStat value="—" label="PEOPLE" />
            <MockStat value="—" label="DAYS" />
            <MockStat value="NO DATA" />
        </div>
    </div>
)

type MockStatProps = {
    value: string
    label?: string
}

const MockStat = ({ value, label }: MockStatProps) => (
    <span>
        <b className="text-ink/50 font-bold">{value}</b>
        {label && ` ${label}`}
    </span>
)

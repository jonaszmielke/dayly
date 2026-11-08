type QuickPickType = 'weekends' | 'weekdays'

const QUICK_PICKS: { type: QuickPickType; label: string }[] = [
    { type: 'weekends', label: 'Weekends' },
    { type: 'weekdays', label: 'Weekdays' },
]

type QuickPicksProps = {
    onPick: (type: QuickPickType) => void
}

export const QuickPicks = ({ onPick }: QuickPicksProps) => (
    <div className="bg-white border-brutal shadow-brutal-sm p-3">
        <div className="font-mono text-[11px] uppercase tracking-widest text-mocha/70 mb-2">
            Quick Picks
        </div>
        <div className="grid grid-cols-2 gap-2">
            {QUICK_PICKS.map(({ type, label }) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => onPick(type)}
                    className="py-1.5 bg-paper border-thin font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-mocha hover:text-paper-2 hover:border-mocha transition-colors"
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
)

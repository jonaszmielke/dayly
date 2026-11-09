import { cn } from '@/lib/utils'

type ModeCardState = 'active' | 'disabled' | 'idle'

const CARD_STATE_CLASSES: Record<ModeCardState, string> = {
    active: 'bg-ink text-paper-2 shadow-brutal-mocha',
    disabled: 'bg-paper-2 opacity-60 cursor-not-allowed shadow-brutal-xs',
    idle: 'bg-white shadow-brutal hover:shadow-brutal-sm press-effect',
}

const getCardState = (active: boolean, disabled?: boolean): ModeCardState => {
    if (active) return 'active'
    if (disabled) return 'disabled'
    return 'idle'
}

type ModeCardProps = {
    active: boolean
    disabled?: boolean
    onClick: () => void
    title: string
    desc: string
    badge?: string
    /** Indexes (0–13) of the highlighted squares in the 7×2 preview glyph. */
    glyphCells: number[]
}

export const ModeCard = ({
    active,
    disabled,
    onClick,
    title,
    desc,
    badge,
    glyphCells,
}: ModeCardProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'grid items-start text-left p-4 border-brutal transition-[background-color,color,box-shadow,opacity]',
            'grid-cols-[24px_1fr] lg:grid-cols-[24px_1fr_auto]',
            CARD_STATE_CLASSES[getCardState(active, disabled)]
        )}
    >
        <span className="font-mono text-[22px] leading-none mt-0.5">{active ? '■' : '□'}</span>
        <div>
            <div className="font-sans text-[16px] font-bold">{title}</div>
            <div
                className={cn(
                    'font-sans text-[13px] mt-0.5',
                    active ? 'text-paper-2/70' : 'text-ink/60'
                )}
            >
                {desc}
            </div>
            <Badge text={badge} />
        </div>
        <div className="col-start-2 mt-2 lg:col-start-auto lg:mt-0 lg:pt-1">
            <ModeGlyph cells={glyphCells} active={active} />
        </div>
    </button>
)

const Badge = ({ text }: { text?: string }) => {
    if (!text) return null
    return (
        <span className="inline-block mt-2 bg-ink/10 font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5">
            {text}
        </span>
    )
}

const GLYPH_SIZE = 14

const GLYPH_COLORS = {
    highlighted: '#7E6038',
    onActiveCard: 'rgba(236,226,203,0.4)',
    onIdleCard: 'rgba(22,21,20,0.2)',
}

const getDotColor = (highlighted: boolean, active: boolean): string => {
    if (highlighted) return GLYPH_COLORS.highlighted
    if (active) return GLYPH_COLORS.onActiveCard
    return GLYPH_COLORS.onIdleCard
}

/** Tiny 7×2 calendar preview; `cells` are the highlighted squares. */
const ModeGlyph = ({ cells, active }: { cells: number[]; active: boolean }) => (
    <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: GLYPH_SIZE }, (_, i) => (
            <div
                key={i}
                className="w-[6px] h-[6px]"
                style={{ backgroundColor: getDotColor(cells.includes(i), active) }}
            />
        ))}
    </div>
)

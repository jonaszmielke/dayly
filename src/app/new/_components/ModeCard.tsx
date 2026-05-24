import { cn } from '@/lib/utils'

export const ModeCard = ({
    active,
    disabled,
    onClick,
    title,
    desc,
    badge,
    glyph,
}: {
    active: boolean
    disabled?: boolean
    onClick: () => void
    title: string
    desc: string
    badge?: string
    glyph: React.ReactNode
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'grid items-start text-left p-4 border-brutal transition-all',
                active
                    ? 'bg-ink text-paper-2 shadow-brutal-mocha'
                    : disabled
                      ? 'bg-paper-2 opacity-60 cursor-not-allowed shadow-brutal-xs'
                      : 'bg-white shadow-brutal hover:shadow-brutal-sm press-effect'
            )}
            style={{ gridTemplateColumns: '24px 1fr auto' }}
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
                {badge && (
                    <span className="inline-block mt-2 bg-ink/10 font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5">
                        {badge}
                    </span>
                )}
            </div>
            <div className="pt-1">{glyph}</div>
        </button>
    )
}

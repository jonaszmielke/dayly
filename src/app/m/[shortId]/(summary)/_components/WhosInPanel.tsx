import { Person } from '../../types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type WhosInPanelProps = {
    meetingShortId: string
    people: Person[]
    selectedPersonId: number | null
    onPersonClick: (id: number) => void
    onClearSelection: () => void
}

export const WhosInPanel = ({
    meetingShortId,
    people,
    selectedPersonId,
    onPersonClick,
    onClearSelection,
}: WhosInPanelProps) => {
    return (
        <div className="bg-white border-brutal shadow-brutal">
            <div className="flex items-center justify-between px-4 py-3 border-b-[1.5px] border-ink">
                <span className="font-sans text-[18px] font-bold tracking-[-0.01em]">
                    WHO&apos;S IN
                </span>
                <Link
                    href={`/m/${meetingShortId}/respond`}
                    className="inline-flex items-center justify-center w-7 h-7 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-xs font-sans text-[16px] font-bold leading-none press-effect-mocha"
                >
                    +
                </Link>
            </div>
            <div className="px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink/55 border-b border-ink/10">
                {selectedPersonId !== null ? 'CLICK SAME NAME TO CLEAR' : 'CLICK A NAME TO ISOLATE'}
            </div>
            <div>
                {people.map((p, i) => (
                    <button
                        key={p.id}
                        onClick={() => onPersonClick(p.id)}
                        className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                            i > 0 && 'border-t border-ink/10',
                            selectedPersonId === p.id ? 'bg-ink text-paper-2' : 'hover:bg-paper-3'
                        )}
                    >
                        <span
                            className={cn(
                                'text-[16px]',
                                selectedPersonId === p.id ? 'text-mocha-pale' : 'text-ink/40'
                            )}
                        >
                            {selectedPersonId === p.id ? '●' : '○'}
                        </span>
                        <span className="flex-1 font-sans text-[14px] font-semibold">{p.name}</span>
                        <span className="font-mono text-[11px]">
                            {p.daysCount}
                            <span className="text-ink/40">d</span>
                        </span>
                    </button>
                ))}
            </div>
            {selectedPersonId !== null && (
                <div className="p-3 border-t border-ink/20 flex flex-col gap-2">
                    {(() => {
                        const selectedName = people.find((p) => p.id === selectedPersonId)?.name
                        return (
                            <Link
                                href={`/m/${meetingShortId}/respond?edit=${encodeURIComponent(selectedName ?? '')}`}
                                className="w-full py-2.5 px-3 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-sm font-sans text-[12px] font-bold uppercase tracking-[0.08em] press-effect-mocha text-center"
                            >
                                ✎ Edit {selectedName}&apos;s availability
                            </Link>
                        )
                    })()}
                    <button
                        onClick={onClearSelection}
                        className="w-full py-2 px-3 border-thin font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 hover:text-ink hover:border-ink transition-colors"
                        style={{
                            borderStyle: 'dashed',
                        }}
                    >
                        ← Back to heatmap
                    </button>
                </div>
            )}
        </div>
    )
}

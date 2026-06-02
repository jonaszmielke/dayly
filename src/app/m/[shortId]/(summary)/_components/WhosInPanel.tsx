import { Person } from '../../types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type WhosInPanelProps = {
    meetingShortId: string
    people: Person[]
    selectedPersonId: number | null
    onPersonClick: (id: number) => void
    onClearSelection: () => void
    countUnit?: string
    isLoading?: boolean
}

export const WhosInPanel = ({
    meetingShortId,
    people,
    selectedPersonId,
    onPersonClick,
    onClearSelection,
    countUnit = 'd',
    isLoading = false,
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
                {!isLoading ? (
                    people.map((person, i) => (
                        <PersonOption
                            key={person.id}
                            index={i}
                            person={person}
                            onPersonClick={onPersonClick}
                            selectedPersonId={selectedPersonId}
                            countUnit={countUnit}
                        />
                    ))
                ) : (
                    <PersonOptionSkeleton />
                )}
            </div>
            {!isLoading && selectedPersonId !== null && (
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

type PersonOptionProps = {
    index: number
    person: Person
    onPersonClick: (id: number) => void
    selectedPersonId: number | null
    countUnit: string
}

const PersonOption = ({
    index,
    person,
    onPersonClick,
    selectedPersonId,
    countUnit,
}: PersonOptionProps) => {
    return (
        <button
            onClick={() => onPersonClick(person.id)}
            className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                index > 0 && 'border-t border-ink/10',
                selectedPersonId === person.id ? 'bg-ink text-paper-2' : 'hover:bg-paper-3'
            )}
        >
            <span
                className={cn(
                    'text-[16px]',
                    selectedPersonId === person.id ? 'text-mocha-pale' : 'text-ink/40'
                )}
            >
                {selectedPersonId === person.id ? '●' : '○'}
            </span>
            <span className="flex-1 font-sans text-[14px] font-semibold">{person.name}</span>
            <span className="font-mono text-[11px]">
                {person.daysCount}
                <span className="text-ink/40">{countUnit}</span>
            </span>
        </button>
    )
}

const PersonOptionSkeleton = () => (
    <button
        key="person-skeleton"
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
        disabled
    >
        <span className="text-[16px]">○</span>
        <span className="flex-1 h-[14px] rounded bg-ink/10 animate-pulse" />
    </button>
)

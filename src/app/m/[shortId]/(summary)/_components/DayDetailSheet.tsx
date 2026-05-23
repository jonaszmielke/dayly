'use client'

import { formatDateMedium } from '@/lib/dates'
import { cn } from '@/lib/utils'

type DayDetailPerson = {
    name: string
    available: boolean
}

type DayDetailSheetProps = {
    iso: string | null
    people: DayDetailPerson[]
    onClose: () => void
}

export const DayDetailSheet = ({ iso, people, onClose }: DayDetailSheetProps) => {
    if (!iso) return null

    const freeCount = people.filter((p) => p.available).length
    const total = people.length

    return (
        <div
            className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-[430px] bg-white border-t-[2.5px] border-x-[2.5px] border-ink p-3"
            style={{
                boxShadow: '0 -4px 0 -1px rgba(22,21,20,.08)',
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
            }}
        >
            {/* Head: date + count + close */}
            <div className="flex items-start justify-between pb-2 border-b-[1.5px] border-ink mb-2.5">
                <div>
                    <div className="font-sans text-[18px] font-extrabold leading-none tracking-[-0.01em]">
                        {formatDateMedium(iso)}
                    </div>
                    <div className="font-mono text-[11px] text-mocha font-semibold tracking-[0.06em] mt-1">
                        {freeCount}/{total} FREE
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-[30px] h-[30px] flex items-center justify-center bg-paper border-[1.5px] border-ink font-sans text-[20px] font-bold leading-none"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            {/* People pills */}
            <div className="flex flex-wrap gap-1.5">
                {people.map((p) => (
                    <div
                        key={p.name}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] font-sans text-[12px] font-semibold',
                            p.available
                                ? 'border-ink bg-paper-range text-ink'
                                : 'border-ink/20 bg-paper-2 text-ink/40 line-through'
                        )}
                    >
                        <span className="font-mono text-[11px]">{p.available ? '■' : '□'}</span>
                        {p.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

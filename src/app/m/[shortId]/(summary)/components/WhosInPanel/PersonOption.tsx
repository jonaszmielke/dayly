import { type Person } from '../../../types'
import { cn } from '@/lib/utils'

type PersonOptionState = 'selected' | 'idle'

type PersonOptionStyle = {
    row: string
    marker: string
    glyph: string
}

const PERSON_OPTION_STYLES: Record<PersonOptionState, PersonOptionStyle> = {
    selected: { row: 'bg-ink text-paper-2', marker: 'text-mocha-pale', glyph: '●' },
    idle: { row: 'hover:bg-paper-3', marker: 'text-ink/40', glyph: '○' },
}

type PersonOptionProps = {
    person: Person
    isSelected: boolean
    onPersonClick: (id: number) => void
    countUnit: string
}

export const PersonOption = ({
    person,
    isSelected,
    onPersonClick,
    countUnit,
}: PersonOptionProps) => {
    const style = PERSON_OPTION_STYLES[isSelected ? 'selected' : 'idle']

    return (
        <button
            type="button"
            aria-pressed={isSelected}
            onClick={() => onPersonClick(person.id)}
            className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                style.row
            )}
        >
            <span aria-hidden="true" className={cn('text-[16px]', style.marker)}>
                {style.glyph}
            </span>
            <span className="flex-1 font-sans text-[14px] font-semibold">{person.name}</span>
            <span className="font-mono text-[11px]">
                {person.daysCount}
                <span className="text-ink/40">{countUnit}</span>
            </span>
        </button>
    )
}

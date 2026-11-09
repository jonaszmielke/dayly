import { MAX_NAME } from '../../constants'
import { CreateSection } from '../CreateSection'
import { cn } from '@/lib/utils'
import { useId } from 'react'

type NameSectionProps = {
    name: string
    onNameChange: (value: string) => void
}

export const NameSection = ({ name, onNameChange }: NameSectionProps) => {
    const titleId = useId()
    const counter = `${name.length}/${MAX_NAME}`

    return (
        <CreateSection number="01" title="Meeting Name" titleId={titleId} hint={counter}>
            <div className="relative">
                <input
                    type="text"
                    aria-labelledby={titleId}
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="NAME YOUR MEETING"
                    maxLength={MAX_NAME}
                    className={cn(
                        'w-full bg-white border-brutal shadow-brutal px-4 py-4.5 pr-20',
                        'font-sans text-[18px] sm:text-[28px] font-bold uppercase',
                        'placeholder:text-ink/30 text-ink',
                        'outline-none focus:shadow-brutal-mocha',
                        'transition-shadow'
                    )}
                />
                <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 font-mono text-[11px] text-ink/40"
                >
                    {counter}
                </span>
            </div>
        </CreateSection>
    )
}

import { type Person } from '../../../types'
import { PersonOption } from './PersonOption'
import { PersonOptionSkeleton } from './PersonOptionSkeleton'

type PeopleListProps = {
    people: Person[]
    selectedPersonId: number | null
    onPersonClick: (id: number) => void
    countUnit: string
    isLoading: boolean
}

export const PeopleList = ({
    people,
    selectedPersonId,
    onPersonClick,
    countUnit,
    isLoading,
}: PeopleListProps) => {
    if (isLoading) return <PersonOptionSkeleton />

    return (
        <div className="divide-y divide-ink/10">
            {people.map((person) => (
                <PersonOption
                    key={person.id}
                    person={person}
                    isSelected={person.id === selectedPersonId}
                    onPersonClick={onPersonClick}
                    countUnit={countUnit}
                />
            ))}
        </div>
    )
}

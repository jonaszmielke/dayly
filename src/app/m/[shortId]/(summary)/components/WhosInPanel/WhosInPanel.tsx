import { type Person } from '../../../types'
import { PanelHeader } from './PanelHeader'
import { PanelHint } from './PanelHint'
import { PeopleList } from './PeopleList'
import { SelectionActions } from './SelectionActions'

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
    const selectedPerson = people.find((person) => person.id === selectedPersonId)

    return (
        <div className="bg-white border-brutal shadow-brutal">
            <PanelHeader meetingShortId={meetingShortId} />
            <PanelHint hasSelection={selectedPersonId !== null} />
            <PeopleList
                people={people}
                selectedPersonId={selectedPersonId}
                onPersonClick={onPersonClick}
                countUnit={countUnit}
                isLoading={isLoading}
            />
            {!isLoading && selectedPerson && (
                <SelectionActions
                    meetingShortId={meetingShortId}
                    personName={selectedPerson.name}
                    onClearSelection={onClearSelection}
                />
            )}
        </div>
    )
}

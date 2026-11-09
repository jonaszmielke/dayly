import { CreateSection } from '../CreateSection'
import { SingleDatePicker } from '@/components/calendar/pickers/SingleDatePicker'

type DeadlineSectionProps = {
    number: string
    deadline: string | null
    onDeadlineChange: (deadline: string | null) => void
    minDate?: string
}

export const DeadlineSection = ({
    number,
    deadline,
    onDeadlineChange,
    minDate,
}: DeadlineSectionProps) => (
    <CreateSection
        number={number}
        title="Response Deadline"
        hint="OPTIONAL · BY WHEN SHOULD PEOPLE RESPOND?"
    >
        <SingleDatePicker
            value={deadline}
            onChange={onDeadlineChange}
            placeholder="SELECT DEADLINE"
            minDate={minDate}
            label="DEADLINE"
        />
    </CreateSection>
)

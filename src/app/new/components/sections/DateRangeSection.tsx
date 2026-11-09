import { CreateSection } from '../CreateSection'
import { DateRangePicker, type DateRangeValue } from '@/components/calendar/pickers/DateRangePicker'

type DateRangeSectionProps = {
    value: DateRangeValue
    onChange: (value: DateRangeValue) => void
    minDate?: string
    maxDays: number
}

export const DateRangeSection = ({ value, onChange, minDate, maxDays }: DateRangeSectionProps) => (
    <CreateSection number="03" title="Date Range" hint="When could the meeting happen?">
        <DateRangePicker value={value} onChange={onChange} minDate={minDate} maxDays={maxDays} />
    </CreateSection>
)

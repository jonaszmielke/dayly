import { CreateSection } from '../CreateSection'
import { HourSelect } from '../HourSelect'
import { cn } from '@/lib/utils'

type HoursSectionProps = {
    startHour: number
    endHour: number
    onStartHourChange: (hour: number) => void
    onEndHourChange: (hour: number) => void
}

export const HoursSection = ({
    startHour,
    endHour,
    onStartHourChange,
    onEndHourChange,
}: HoursSectionProps) => (
    <CreateSection number="04" title="Suitable Hours" hint="Which part of the day?">
        <div className="flex flex-col gap-4">
            <div className="flex gap-6">
                <HourSelect label="FROM" value={startHour} onChange={onStartHourChange} />
                <HourSelect
                    label="TO"
                    value={endHour}
                    onChange={onEndHourChange}
                    fromHour={startHour}
                />
            </div>
            <HoursSummary startHour={startHour} endHour={endHour} />
        </div>
    </CreateSection>
)

const SUMMARY_CLASSES = 'font-mono text-[11px] tracking-widest uppercase'

type HoursSummaryProps = {
    startHour: number
    endHour: number
}

const HoursSummary = ({ startHour, endHour }: HoursSummaryProps) => {
    if (endHour <= startHour)
        return <div className={cn(SUMMARY_CLASSES, 'text-red-600')}>END MUST BE AFTER START</div>

    return (
        <div className={cn(SUMMARY_CLASSES, 'text-ink/50')}>{endHour - startHour} HOURS / DAY</div>
    )
}

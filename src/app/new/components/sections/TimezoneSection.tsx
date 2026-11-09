import { CreateSection } from '../CreateSection'
import { timezones } from '@/lib/slots'
import { useId } from 'react'

const SORTED_TIMEZONES = [...timezones].sort()

type TimezoneSectionProps = {
    timezone: string
    isDetected: boolean
    onTimezoneChange: (timezone: string) => void
}

export const TimezoneSection = ({
    timezone,
    isDetected,
    onTimezoneChange,
}: TimezoneSectionProps) => {
    const titleId = useId()
    const hint = isDetected ? 'AUTO-DETECTED' : 'CUSTOM'

    return (
        <CreateSection number="05" title="Timezone" titleId={titleId} hint={hint}>
            <div className="relative border-brutal shadow-brutal bg-white">
                <select
                    aria-labelledby={titleId}
                    value={timezone}
                    onChange={(e) => onTimezoneChange(e.target.value)}
                    className="w-full appearance-none bg-transparent font-sans font-bold text-[22px] uppercase text-ink outline-none cursor-pointer"
                    style={{ padding: '18px 48px 18px 16px' }}
                >
                    {SORTED_TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
                <span
                    aria-hidden="true"
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-ink/50"
                >
                    ▾
                </span>
            </div>
        </CreateSection>
    )
}

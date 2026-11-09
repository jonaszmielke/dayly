import { MEDIA_QUERIES, useMediaQuery } from '@/hooks/useMediaQuery'
import { formatHour } from '@/lib/slots'
import { cn } from '@/lib/utils'
import { useId } from 'react'

type Viewport = 'mobile' | 'desktop'

type ViewportStyle = {
    text: string
    padding: string
    formatOption: (hour: number) => string
}

const VIEWPORT_STYLES: Record<Viewport, ViewportStyle> = {
    mobile: { text: 'text-[16px]', padding: '18px 28px 18px 16px', formatOption: String },
    desktop: { text: 'text-[22px]', padding: '18px 40px 18px 16px', formatOption: formatHour },
}

/** All 24 start hours, or the end hours after `fromHour` (up to 24). */
const getHourOptions = (fromHour?: number): number[] => {
    if (fromHour === undefined) return Array.from({ length: 24 }, (_, i) => i)
    return Array.from({ length: 24 - fromHour }, (_, i) => fromHour + 1 + i)
}

type HourSelectProps = {
    label: string
    value: number
    onChange: (value: number) => void
    fromHour?: number
}

export const HourSelect = ({ label, value, onChange, fromHour }: HourSelectProps) => {
    const isMobile = useMediaQuery(MEDIA_QUERIES.mobile)
    const style = VIEWPORT_STYLES[isMobile ? 'mobile' : 'desktop']
    const selectId = useId()

    return (
        <div className="flex border-brutal shadow-brutal flex-1 overflow-hidden">
            <label
                htmlFor={selectId}
                className="bg-ink text-paper-2 w-16 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold tracking-widest"
            >
                {label}
            </label>
            <div className="relative flex-1">
                <select
                    id={selectId}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={cn(
                        'size-full  appearance-none bg-white px-4 pr-10 font-sans font-bold uppercase text-ink outline-none cursor-pointer',
                        style.text
                    )}
                    style={{ padding: style.padding }}
                >
                    {getHourOptions(fromHour).map((hour) => (
                        <option key={hour} value={hour}>
                            {style.formatOption(hour)}
                        </option>
                    ))}
                </select>
                <span
                    aria-hidden="true"
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-ink/50"
                >
                    ▾
                </span>
            </div>
        </div>
    )
}

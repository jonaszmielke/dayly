import { formatHour } from '@/lib/dates'
import { useIsMobile } from '@/lib/useIsMobile'

type HourSelectProps = {
    label: string
    value: number
    onChange: (value: number) => void
    fromHour?: number
}

export const HourSelect = ({ label, value, onChange, fromHour }: HourSelectProps) => {
    const isMobile = useIsMobile()
    const hourArrayLength = fromHour ? 24 - fromHour : 24

    return (
        <div className="flex border-brutal shadow-brutal flex-1 overflow-hidden">
            <div className="bg-ink text-paper-2 w-16 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold tracking-widest">
                {label}
            </div>
            <div className="relative flex-1">
                <select
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full h-full appearance-none bg-white px-4 pr-10 font-sans font-bold text-[22px] uppercase text-ink outline-none cursor-pointer ${isMobile ? 'text-center' : ''}`}
                    style={{ padding: isMobile ? '18px 40px' : '18px 40px 18px 16px' }}
                >
                    {Array.from({ length: hourArrayLength }).map((_, i) => {
                        const hour = fromHour ? i + fromHour + 1 : i
                        return (
                            <option key={hour} value={hour}>
                                {isMobile ? String(hour) : formatHour(hour)}
                            </option>
                        )
                    })}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-ink/50">
                    ▾
                </span>
            </div>
        </div>
    )
}

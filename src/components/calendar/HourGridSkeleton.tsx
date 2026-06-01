import { formatHour, MONTH_ABBREVIATIONS, WeekCell } from '@/lib/dates'
import { cn } from '@/lib/utils'

type HourGridSkeletonProps = {
    week: WeekCell[]
    hours: number[]
}

const monthAbbr = (iso: string) => MONTH_ABBREVIATIONS[Number(iso.slice(5, 7)) - 1]
const pad = (n: number) => String(n).padStart(2, '0')

const weekLabel = (week: WeekCell[]): string => {
    const first = week[0]
    const last = week[week.length - 1]
    const firstMon = monthAbbr(first.date)
    const lastMon = monthAbbr(last.date)
    return firstMon === lastMon
        ? `${pad(first.dom)}–${pad(last.dom)} ${firstMon}`
        : `${pad(first.dom)} ${firstMon} – ${pad(last.dom)} ${lastMon}`
}

export const HourGridSkeleton = ({ week, hours }: HourGridSkeletonProps) => {
    const gridTemplateColumns = '64px repeat(7, minmax(0, 1fr))'

    return (
        <div className="bg-white border-brutal shadow-brutal" aria-hidden="true">
            {/* Week head */}
            <div className="flex items-baseline justify-between px-3 py-3 lg:px-5 lg:py-4 border-b-2 border-ink">
                <span className="font-sans text-[20px] lg:text-[26px] font-extrabold leading-none tracking-[-0.03em] text-ink/30">
                    {weekLabel(week)}
                </span>
                <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-widest text-ink/55">
                    {hours.length} HRS/DAY
                </span>
            </div>

            <div className="grid" style={{ gridTemplateColumns }}>
                {/* Header row */}
                <div className="flex items-center justify-center bg-paper border-r-[1.5px] border-b-[1.5px] border-ink font-mono text-[9px] lg:text-[10px] uppercase tracking-[0.04em] text-ink/45">
                    HR
                </div>
                {week.map((c, i) => {
                    const last = i === week.length - 1
                    const dowLabel = (
                        <>
                            {c.dow.slice(0, 1)}
                            <span className="hidden lg:inline">{c.dow.slice(1)}</span>
                        </>
                    )
                    return (
                        <div
                            key={c.date}
                            className={cn(
                                'bg-paper border-b-[1.5px] border-ink py-1.5 text-center',
                                !last && 'border-r-[1.5px]',
                                !c.inRange && 'opacity-40'
                            )}
                        >
                            <div className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.04em] text-ink/55">
                                {dowLabel}
                            </div>
                            <div className="font-sans text-[12px] lg:text-[13px] font-bold text-ink/40">
                                {pad(c.dom)}
                            </div>
                        </div>
                    )
                })}

                {/* Body rows */}
                {hours.map((h, ri) => {
                    const lastRow = ri === hours.length - 1
                    const labelClass = cn(
                        'flex items-center justify-center bg-paper border-r-[1.5px] border-ink font-mono text-[11px] lg:text-[12px] text-ink/70',
                        !lastRow && 'border-b-[1.5px]'
                    )
                    return (
                        <div key={h} className="contents">
                            <div className={labelClass}>{formatHour(h)}</div>
                            {week.map((c, ci) => {
                                const lastCol = ci === week.length - 1
                                return (
                                    <div
                                        key={c.date}
                                        className={cn(
                                            'min-h-[40px] lg:min-h-[44px] border-ink',
                                            !lastCol && 'border-r-[1.5px]',
                                            !lastRow && 'border-b-[1.5px]',
                                            !c.inRange && 'bg-hatch opacity-40'
                                        )}
                                    >
                                        {c.inRange && (
                                            <div className="flex h-full items-center justify-center p-1.5">
                                                <div className="h-full w-full bg-mocha-light/60 animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

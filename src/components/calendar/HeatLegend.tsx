import { HEAT_PALETTE, pickFg } from '@/lib/heat'
import { cn } from '@/lib/utils'

interface HeatLegendProps {
    total: number
    className?: string
}

export function HeatLegend({ total, className }: HeatLegendProps) {
    return (
        <div className={cn('bg-white border-brutal shadow-brutal-sm px-4 pt-3.5 pb-3', className)}>
            <div className="font-sans text-[12px] font-bold tracking-[0.06em] pb-2 mb-2.5 border-b-[1.5px] border-ink">
                HEAT
            </div>
            <div className="grid grid-cols-6 border-[1.5px] border-ink">
                {HEAT_PALETTE.map((color, i) => (
                    <div
                        key={color}
                        className="h-[30px] flex items-center justify-center font-mono text-[11px] font-semibold border-r-[1.5px] border-ink last:border-r-0"
                        style={{ backgroundColor: color, color: pickFg(color) }}
                    >
                        {i}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1.5">
                <span className="font-mono text-[9.5px] tracking-[0.06em] text-ink/55">0 FREE</span>
                <span className="font-mono text-[9.5px] tracking-[0.06em] text-ink/55">{total} FREE</span>
            </div>
        </div>
    )
}

import { HEAT_PALETTE } from '@/lib/heat'
import { cn } from '@/lib/utils'

interface HeatLegendProps {
    total: number
    className?: string
}

export function HeatLegend({ total, className }: HeatLegendProps) {
    return (
        <div className={cn('bg-white border-brutal shadow-brutal-sm', className)}>
            <div className="grid grid-cols-6">
                {HEAT_PALETTE.map((color, i) => (
                    <div
                        key={color}
                        className="h-6 border-r border-ink/10 last:border-r-0"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            <div className="flex justify-between px-2 py-1 border-t border-ink/10">
                <span className="font-mono text-[10px] text-ink/50">0 FREE</span>
                <span className="font-mono text-[10px] text-ink/50">{total} FREE</span>
            </div>
        </div>
    )
}

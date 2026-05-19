import { cn } from '@/lib/utils'

interface StatRow {
    label: string
    value: string
}

interface StatCardProps {
    rows: StatRow[]
    className?: string
}

export function StatCard({ rows, className }: StatCardProps) {
    return (
        <div className={cn('bg-white border-brutal shadow-brutal-sm py-1', className)}>
            {rows.map((row, i) => (
                <div
                    key={row.label}
                    className={cn(
                        'flex items-center justify-between px-4 py-2.5',
                        i > 0 && 'border-t border-ink/10',
                    )}
                >
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/55">
                        {row.label}
                    </span>
                    <span className="font-mono text-[11px] font-bold font-tabular text-ink">
                        {row.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

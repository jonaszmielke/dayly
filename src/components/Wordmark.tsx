import { cn } from '@/lib/utils'

export const Wordmark = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'inline-flex items-baseline gap-[6px] px-3 py-[6px] bg-ink text-paper-2 shadow-brutal-mocha-sm select-none',
                className
            )}
        >
            <span className="font-mono text-[16px] font-normal leading-none tracking-tight">
                ▮▯
            </span>
            <span className="font-sans text-[22px] font-bold leading-none tracking-[-0.02em]">
                DAYLY
            </span>
        </div>
    )
}

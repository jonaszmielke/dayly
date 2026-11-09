import { Separator } from './Separator'
import { type TopBarSize, textSize } from './size'
import { cn } from '@/lib/utils'

type MetaPillsProps = {
    meta?: readonly string[]
    size?: TopBarSize
    className?: string
}

export const MetaPills = ({ meta, size = 'md', className }: MetaPillsProps) => {
    if (!meta || meta.length === 0) return null

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {meta.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                    <Separator index={index} size={size} symbol="•" />
                    <span
                        className={cn(
                            'bg-white border border-ink px-2 py-0.5 font-mono uppercase tracking-widest',
                            textSize[size]
                        )}
                    >
                        {item}
                    </span>
                </span>
            ))}
        </div>
    )
}

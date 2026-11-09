import { type TopBarSize, textSize } from './size'
import { cn } from '@/lib/utils'

type SeparatorProps = {
    index: number
    size: TopBarSize
    symbol: string
}

export const Separator = ({ index, size, symbol }: SeparatorProps) => {
    if (index === 0) return null

    return <span className={cn('font-mono text-ink/40', textSize[size])}>{symbol}</span>
}

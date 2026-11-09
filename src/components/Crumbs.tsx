import { Separator } from './topbar/Separator'
import { type TopBarSize, textSize } from './topbar/size'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export type Crumb = {
    label: string
    href?: string
    tone?: 'danger'
}

type CrumbState = 'link' | 'danger' | 'current' | 'plain'

const CRUMB_STATE_CLASSES: Record<CrumbState, string> = {
    link: 'text-ink/55 hover:text-ink',
    danger: 'text-danger',
    current: 'font-bold text-ink',
    plain: 'text-ink/55',
}

const getCrumbState = (crumb: Crumb, isLast: boolean): CrumbState => {
    if (crumb.href) return 'link'
    if (crumb.tone === 'danger') return 'danger'
    if (isLast) return 'current'
    return 'plain'
}

type CrumbsProps = {
    crumbs?: readonly Crumb[]
    size?: TopBarSize
    className?: string
}

export const Crumbs = ({ crumbs, size = 'md', className }: CrumbsProps) => {
    if (!crumbs || crumbs.length === 0) return null

    return (
        <nav className={cn('flex items-center gap-1', className)}>
            {crumbs.map((crumb, index) => (
                <span key={crumb.href ?? crumb.label} className="flex items-center gap-1">
                    <Separator index={index} size={size} symbol="/" />
                    <CrumbContent
                        crumb={crumb}
                        state={getCrumbState(crumb, index === crumbs.length - 1)}
                        size={size}
                    />
                </span>
            ))}
        </nav>
    )
}

type CrumbContentProps = {
    crumb: Crumb
    state: CrumbState
    size: TopBarSize
}

const CrumbContent = ({ crumb, state, size }: CrumbContentProps) => {
    const className = cn(
        'font-mono uppercase tracking-widest',
        textSize[size],
        CRUMB_STATE_CLASSES[state]
    )

    if (crumb.href)
        return (
            <Link href={crumb.href} className={className}>
                {crumb.label}
            </Link>
        )

    return <span className={className}>{crumb.label}</span>
}

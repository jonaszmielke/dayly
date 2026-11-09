import { Separator } from './Separator'
import { type TopBarSize, textSize } from './size'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export type Crumb = {
    label: string
    href?: string
}

type CrumbsProps = {
    crumbs?: readonly Crumb[]
    size?: TopBarSize
}

export const Crumbs = ({ crumbs, size = 'md' }: CrumbsProps) => {
    if (!crumbs || crumbs.length === 0) return null

    return (
        <nav className="flex items-center gap-1">
            {crumbs.map((crumb, index) => (
                <span key={crumb.href ?? crumb.label} className="flex items-center gap-1">
                    <Separator index={index} size={size} symbol="/" />
                    <CrumbContent label={crumb.label} href={crumb.href} size={size} />
                </span>
            ))}
        </nav>
    )
}

type CrumbContentProps = Crumb & { size: TopBarSize }

const CrumbContent = ({ label, href, size }: CrumbContentProps) => {
    if (href)
        return (
            <Link
                href={href}
                className={cn(
                    'font-mono uppercase tracking-widest text-ink/55 hover:text-ink',
                    textSize[size]
                )}
            >
                {label}
            </Link>
        )

    return (
        <span
            className={cn('font-mono uppercase tracking-widest font-bold text-ink', textSize[size])}
        >
            {label}
        </span>
    )
}

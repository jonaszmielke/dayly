import { Crumbs, type Crumb } from '../Crumbs'
import { Wordmark } from '../Wordmark'
import { MetaPills } from './MetaPills'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { type ReactNode } from 'react'
import Link from 'next/link'

const mobileLayout = cva('lg:hidden flex flex-col gap-4 px-4', {
    variants: { compact: { true: 'pt-3 pb-4', false: 'pt-4 pb-5' } },
    defaultVariants: { compact: false },
})

const desktopLayout = cva('hidden lg:grid grid-cols-[1fr_auto_1fr] gap-8 items-center px-6', {
    variants: { compact: { true: 'py-3', false: 'py-5' } },
    defaultVariants: { compact: false },
})

const desktopLeft = cva('flex flex-col', {
    variants: { compact: { true: 'gap-5', false: 'gap-10' } },
    defaultVariants: { compact: false },
})

const desktopTitle = cva(
    'font-sans font-extrabold whitespace-nowrap tracking-[-0.035em] leading-none',
    {
        variants: {
            compact: {
                true: 'text-[length:calc(var(--b-title)*0.75)]',
                false: 'text-(length:--b-title)',
            },
        },
        defaultVariants: { compact: false },
    }
)

type TopBarProps = {
    crumbs?: readonly Crumb[]
    title: string
    meta?: readonly string[]
    right?: ReactNode
    mobileRight?: ReactNode
    mobileAction?: ReactNode
    className?: string
    compact?: boolean
}

export const TopBar = ({
    crumbs,
    title,
    meta,
    right,
    mobileRight,
    mobileAction,
    className,
    compact,
}: TopBarProps) => {
    return (
        <header
            className={cn('relative border-b-2 border-ink', className)}
            style={{ borderBottomWidth: 'var(--b-border)' }}
        >
            {/* ── Mobile layout (default, hidden lg+) ── */}
            <div className={mobileLayout({ compact })}>
                {/* Row 1: wordmark + mobile action */}
                <div className="flex items-center justify-between">
                    <HomeLink />
                    {mobileRight}
                </div>

                <Crumbs crumbs={crumbs} size="sm" />

                <h1
                    className="font-sans font-extrabold tracking-[-0.045em] leading-[0.86] wrap-break-word"
                    style={{ fontSize: 'clamp(36px, 11vw, 52px)' }}
                >
                    {title}
                </h1>

                <MobileFooter meta={meta} mobileAction={mobileAction} />
            </div>

            {/* ── Desktop layout (lg+) ── */}
            <div className={desktopLayout({ compact })}>
                {/* Left: wordmark + crumbs */}
                <div className={desktopLeft({ compact })}>
                    <HomeLink />
                    <Crumbs crumbs={crumbs} />
                </div>

                {/* Center: title + meta pills */}
                <div className="flex flex-col items-center gap-2">
                    <h1 className={desktopTitle({ compact })}>{title}</h1>
                    <MetaPills meta={meta} />
                </div>

                {/* Right slot */}
                <div className="flex justify-end">{right}</div>
            </div>
        </header>
    )
}

const HomeLink = () => (
    <Link href="/">
        <Wordmark />
    </Link>
)

type MobileFooterProps = Pick<TopBarProps, 'meta' | 'mobileAction'>

const MobileFooter = ({ meta, mobileAction }: MobileFooterProps) => {
    if (mobileAction) return <div className="flex justify-end">{mobileAction}</div>

    return <MetaPills meta={meta} size="sm" className="flex-wrap" />
}

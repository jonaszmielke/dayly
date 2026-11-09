import { appVersion, cn } from '@/lib/utils'
import { type CSSProperties } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'GitHub', href: 'https://github.com/jonaszmielke/dayly' },
]

const SMALL_CAPS = 'font-mono text-[11px] uppercase tracking-[0.08em]'

export const Footer = () => (
    <footer className="mt-8 border-t border-ink/30">
        {/* Mobile */}
        <div className="lg:hidden max-w-360 mx-auto p-4  flex items-center justify-between">
            <span className={cn(SMALL_CAPS, 'text-ink/55')}>DAYLY · {appVersion()}</span>
            <FooterNav className="gap-3" />
        </div>

        {/* Desktop — 3 column grid */}
        <div
            className="hidden lg:grid max-w-345 mx-auto px-6 py-4 items-center"
            style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >
            <span className={cn(SMALL_CAPS, 'text-ink/55 text-right')}>DAYLY</span>
            <FooterNav
                className="gap-6 justify-center"
                style={{ width: 'clamp(200px, 50vw, 1400px)' }}
            />
            <span className={cn(SMALL_CAPS, 'text-ink/40')}>{appVersion()}</span>
        </div>
    </footer>
)

const FooterNav = ({ className, style }: { className?: string; style?: CSSProperties }) => (
    <nav className={cn('flex items-center', className)} style={style}>
        {NAV_LINKS.map((l) => (
            <Link
                key={l.href}
                href={l.href}
                className={cn(SMALL_CAPS, 'text-ink/40 hover:text-ink')}
            >
                {l.label}
            </Link>
        ))}
    </nav>
)

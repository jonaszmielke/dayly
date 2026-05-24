import { appVersion } from '@/lib/utils'
import Link from 'next/link'

const NAV_LINKS = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
]

export const Footer = () => (
    <footer className="mt-8 border-t border-ink/30">
        {/* Mobile */}
        <div className="lg:hidden max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">
                DAYLY · {appVersion()}
            </span>
            <nav className="flex items-center gap-3">
                {NAV_LINKS.map((l) => (
                    <Link
                        key={l.href}
                        href={l.href}
                        className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40 hover:text-ink"
                    >
                        {l.label}
                    </Link>
                ))}
            </nav>
        </div>

        {/* Desktop — 3 column grid */}
        <div
            className="hidden lg:grid max-w-[1380px] mx-auto px-6 py-4 items-center"
            style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 text-right">
                DAYLY
            </span>

            <nav
                className="flex items-center gap-6 justify-center"
                style={{ width: 'clamp(200px, 50vw, 1400px)' }}
            >
                {NAV_LINKS.map((l) => (
                    <Link
                        key={l.href}
                        href={l.href}
                        className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40 hover:text-ink"
                    >
                        {l.label}
                    </Link>
                ))}
            </nav>

            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                {appVersion()}
            </span>
        </div>
    </footer>
)

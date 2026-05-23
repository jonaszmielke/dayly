import { appVersion, cn } from '@/lib/utils'
import Link from 'next/link'

type FooterLink = {
    label: string
    href: string
}

type FooterProps = {
    links?: FooterLink[]
    className?: string
}

export const Footer = ({ links, className }: FooterProps) => {
    return (
        <footer className={cn('mt-8 border-t border-ink/30', className)}>
            <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
                {/* Mobile: single combined span. Desktop: separate DAYLY + version */}
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 lg:hidden">
                    DAYLY · {appVersion()}
                </span>
                <span className="hidden lg:inline font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">
                    DAYLY
                </span>
                {links && links.length > 0 && (
                    <nav className="hidden lg:flex items-center gap-4">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 hover:text-ink"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                )}
                <span className="hidden lg:inline font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                    {appVersion()}
                </span>
            </div>
        </footer>
    )
}

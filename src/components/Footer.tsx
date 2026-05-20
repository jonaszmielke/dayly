import { cn } from '@/lib/utils'
import Link from 'next/link'

type FooterLink = {
    label: string
    href: string
}

type FooterProps = {
    links?: FooterLink[]
    version?: string
    className?: string
}

export const Footer = ({ links, version = 'v0.1', className }: FooterProps) => {
    return (
        <footer
            className={cn(
                'flex items-center justify-between px-6 py-4 mt-8 border-t border-ink/30',
                className
            )}
        >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">
                DAYLY — Find the days that work for everyone
            </span>
            {links && links.length > 0 && (
                <nav className="flex items-center gap-4">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                {version}
            </span>
        </footer>
    )
}

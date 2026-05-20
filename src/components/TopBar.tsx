import { Wordmark } from './Wordmark'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import Link from 'next/link'

type TopBarProps = {
    crumbs?: { label: string; href?: string }[]
    title: string
    meta?: string[]
    right?: ReactNode
    className?: string
}

export const TopBar = ({ crumbs, title, meta, right, className }: TopBarProps) => {
    return (
        <header
            className={cn('relative border-b-2 border-ink', className)}
            style={{ borderBottomWidth: 'var(--b-border)' }}
        >
            {/* double rule */}
            <div className="absolute bottom-[-10px] left-0 right-0 h-px bg-ink/30" aria-hidden />
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center px-6 py-5">
                {/* Left: wordmark + crumbs */}
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Wordmark />
                    </Link>
                    {crumbs && crumbs.length > 0 && (
                        <nav className="flex items-center gap-1">
                            {crumbs.map((c, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    {i > 0 && (
                                        <span className="font-mono text-[11px] text-ink/40">/</span>
                                    )}
                                    {c.href ? (
                                        <Link
                                            href={c.href}
                                            className="font-mono text-[11px] uppercase tracking-widest text-ink/55 hover:text-ink"
                                        >
                                            {c.label}
                                        </Link>
                                    ) : (
                                        <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-ink">
                                            {c.label}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Center: title + meta pills */}
                <div className="flex flex-col items-center gap-1">
                    <h1
                        className="font-sans font-extrabold whitespace-nowrap tracking-[-0.035em] leading-none"
                        style={{ fontSize: 'var(--b-title)' }}
                    >
                        {title}
                    </h1>
                    {meta && meta.length > 0 && (
                        <div className="flex items-center gap-2">
                            {meta.map((m, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    {i > 0 && (
                                        <span className="font-mono text-[11px] text-ink/40">•</span>
                                    )}
                                    <span className="bg-white border border-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest">
                                        {m}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right slot */}
                <div className="flex justify-end">{right}</div>
            </div>
        </header>
    )
}

import { Wordmark } from './Wordmark'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import Link from 'next/link'

type TopBarProps = {
    crumbs?: { label: string; href?: string }[]
    title: string
    meta?: string[]
    right?: ReactNode
    mobileRight?: ReactNode
    className?: string
    compact?: boolean
}

export const TopBar = ({ crumbs, title, meta, right, mobileRight, className, compact }: TopBarProps) => {
    return (
        <header
            className={cn('relative border-b-2 border-ink', className)}
            style={{ borderBottomWidth: 'var(--b-border)' }}
        >
            {/* ── Mobile layout (default, hidden lg+) ── */}
            <div className={cn('lg:hidden flex flex-col gap-2 px-4', compact ? 'pt-3 pb-4' : 'pt-4 pb-5')}>
                {/* Row 1: wordmark + mobile action */}
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Wordmark />
                    </Link>
                    {mobileRight}
                </div>

                {/* Crumbs */}
                {crumbs && crumbs.length > 0 && (
                    <nav className="flex items-center gap-1">
                        {crumbs.map((c, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && (
                                    <span className="font-mono text-[10px] text-ink/40">/</span>
                                )}
                                {c.href ? (
                                    <Link
                                        href={c.href}
                                        className="font-mono text-[10px] uppercase tracking-widest text-ink/55 hover:text-ink"
                                    >
                                        {c.label}
                                    </Link>
                                ) : (
                                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-ink">
                                        {c.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}

                {/* Title */}
                <h1
                    className="font-sans font-extrabold tracking-[-0.045em] leading-[0.86] break-words"
                    style={{ fontSize: 'clamp(36px, 11vw, 52px)' }}
                >
                    {title}
                </h1>

                {/* Meta pills */}
                {meta && meta.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {meta.map((m, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && (
                                    <span className="font-mono text-[10px] text-ink/40">•</span>
                                )}
                                <span className="bg-white border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                                    {m}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Desktop layout (lg+) ── */}
            <div
                className={cn(
                    'hidden lg:grid grid-cols-[1fr_auto_1fr] gap-8 items-center px-6',
                    compact ? 'py-3' : 'py-5'
                )}
            >
                {/* Left: wordmark + crumbs */}
                <div className={cn('flex flex-col', compact ? 'gap-5' : 'gap-10')}>
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
                <div className="flex flex-col items-center gap-2">
                    <h1
                        className="font-sans font-extrabold whitespace-nowrap tracking-[-0.035em] leading-none"
                        style={{ fontSize: compact ? 'calc(var(--b-title) * 0.75)' : 'var(--b-title)' }}
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

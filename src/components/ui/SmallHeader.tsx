'use client'

import { Wordmark } from '../Wordmark'
import Link from 'next/link'
import { useState } from 'react'

export const SmallHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <nav className="sticky top-0 bg-paper border-b-2 border-ink z-50">
                <div
                    className="max-w-[1440px] mx-auto px-4 lg:px-10 py-3 lg:py-3.5 grid items-center gap-4 lg:gap-8"
                    style={{ gridTemplateColumns: 'auto 1fr auto' }}
                >
                    <Link href="/">
                        <Wordmark />
                    </Link>
                    <div />
                    <Link
                        href="/new"
                        className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper-2 border-2 border-ink font-sans text-[13px] font-extrabold uppercase tracking-[0.06em] press-effect transition-all"
                        style={{ boxShadow: '3px 3px 0 #7e6038' }}
                    >
                        Start a survey →
                    </Link>
                    <button
                        className="lg:hidden flex items-center justify-center w-9 h-9 bg-white border-2 border-ink font-sans text-[20px] font-bold leading-none"
                        style={{ boxShadow: '3px 3px 0 #161514' }}
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        ≡
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-[2px]"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-paper border-t-[2.5px] border-x-[2.5px] border-ink p-4 flex flex-col gap-4 max-w-[430px] mx-auto"
                        style={{ boxShadow: '0 -8px 0 #161514' }}
                    >
                        <div className="flex justify-between items-center pb-3 border-b-2 border-ink">
                            <span className="font-sans text-[14px] font-extrabold uppercase tracking-[0.08em]">
                                MENU
                            </span>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center bg-white border-2 border-ink font-sans text-[20px] font-bold"
                                style={{ boxShadow: '2px 2px 0 #161514' }}
                                aria-label="Close menu"
                            >
                                ×
                            </button>
                        </div>
                        <Link
                            href="/new"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center gap-2 px-4 py-4 bg-mocha text-paper-2 border-brutal font-sans text-[14px] font-extrabold uppercase tracking-[0.06em] press-effect-mocha"
                            style={{ boxShadow: '4px 4px 0 #161514' }}
                        >
                            Start a survey →
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

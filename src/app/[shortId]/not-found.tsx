'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import { Footer } from '@/components/Footer'

const MeetingNotFoundPage = () => {
    const router = useRouter()
    const [code, setCode] = useState('')

    const handleFind = (e: React.FormEvent) => {
        e.preventDefault()
        if (code.trim()) router.push(`/${code.trim().toLowerCase()}`)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Nav */}
            <nav className="sticky top-0 z-10 bg-paper border-b-2 border-ink px-6 py-4 flex items-center justify-between">
                <Link href="/">
                    <Wordmark />
                </Link>
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/65 hover:text-ink transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/create"
                        className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/65 hover:text-ink transition-colors"
                    >
                        New Survey
                    </Link>
                </div>
                <Link
                    href="/create"
                    className="bg-ink text-paper-2 border-brutal shadow-brutal-sm press-effect px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em]"
                >
                    Start a survey →
                </Link>
            </nav>

            {/* Content */}
            <section className="flex-1 max-w-[1440px] mx-auto w-full px-10 py-14">
                {/* Crumbs */}
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55 mb-10 flex items-center gap-1">
                    <Link href="/" className="hover:text-ink">DAYLY</Link>
                    <span className="text-ink/30">/</span>
                    <span>ROOM</span>
                    <span className="text-ink/30">/</span>
                    <span className="text-danger">404 · NOT FOUND</span>
                </div>

                <div className="grid gap-14" style={{ gridTemplateColumns: 'minmax(0,560px) minmax(0,1fr)' }}>
                    {/* Left copy */}
                    <div className="flex flex-col gap-6">
                        <h1
                            className="font-sans font-extrabold leading-[0.86] tracking-[-0.045em]"
                            style={{ fontSize: '88px' }}
                        >
                            No such<br />
                            <em className="not-italic text-danger">room.</em>
                        </h1>

                        <p className="font-sans text-[18px] font-medium max-w-[460px] text-ink/80">
                            This survey link doesn&apos;t exist or may have been removed.
                        </p>

                        {/* Rejoin card */}
                        <div className="bg-white border-2 border-ink shadow-brutal-sm">
                            <div className="px-4 py-3 border-b border-ink/10">
                                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/55">
                                    01 · Try the code again
                                </span>
                            </div>
                            <form onSubmit={handleFind} className="flex items-stretch p-3 gap-2">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="q7-MOCHA-42"
                                    className="flex-1 bg-paper border-thin px-3 py-2 font-mono text-[20px] uppercase tracking-[0.16em] placeholder:text-ink/25 outline-none focus:bg-white"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-ink text-paper-2 border-brutal shadow-brutal-sm font-mono text-[12px] uppercase tracking-[0.08em] press-effect whitespace-nowrap"
                                >
                                    Find →
                                </button>
                            </form>
                            <div className="px-4 pb-3 font-mono text-[10px] text-ink/45">
                                Codes look like <code className="text-ink/70">q7-mocha-42</code>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/create"
                                className="px-5 py-3 bg-mocha text-paper-2 border-brutal shadow-brutal press-effect-mocha font-sans text-[14px] font-bold uppercase tracking-[0.06em]"
                            >
                                Start a new survey
                            </Link>
                            <Link
                                href="/"
                                className="px-5 py-3 bg-white border-brutal shadow-brutal-sm press-effect font-sans text-[14px] font-bold uppercase tracking-[0.06em]"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>

                    {/* Right visual — mock card with stamp */}
                    <div className="relative flex items-start justify-center pt-4">
                        <div
                            className="relative bg-white border-2 border-ink w-full max-w-[400px]"
                            style={{
                                transform: 'rotate(0.4deg)',
                                boxShadow: '10px 10px 0 #161514',
                            }}
                        >
                            {/* Tape */}
                            <div
                                className="absolute -top-4 -left-2 bg-paper-shade border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 z-10"
                                style={{ transform: 'rotate(-2deg)' }}
                            >
                                DAYLY · ROOM /r/not-found
                            </div>

                            {/* Mock header */}
                            <div className="px-4 py-3 border-b-2 border-ink">
                                <div className="font-sans text-[20px] font-extrabold uppercase tracking-[-0.02em] text-ink/30">
                                    — — — — — —
                                </div>
                                <div className="font-mono text-[11px] text-ink/25 mt-1">
                                    NO DATA
                                </div>
                            </div>

                            {/* Mock grid */}
                            <div className="p-2 grid grid-cols-5 gap-1">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-hatch h-[74px] flex items-center justify-center font-mono text-[12px] text-ink/20"
                                    >
                                        ·
                                    </div>
                                ))}
                            </div>

                            {/* 404 stamp */}
                            <div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <div
                                    className="bg-danger text-paper-2 border-2 border-ink px-6 py-4 text-center"
                                    style={{
                                        transform: 'rotate(-6deg)',
                                        boxShadow: '6px 6px 0 #161514',
                                    }}
                                >
                                    <div className="font-sans text-[44px] font-extrabold leading-none">
                                        404
                                    </div>
                                    <div className="font-mono text-[12px] uppercase tracking-[0.24em] mt-1">
                                        NO SUCH ROOM
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reasons 3-up */}
                <div className="mt-16 bg-white border-2 border-ink shadow-brutal-sm">
                    <div className="grid grid-cols-3 divide-x-2 divide-ink">
                        {[
                            { num: '01', title: 'Mistyped link', body: 'Double-check the code you received. Codes are case-insensitive.' },
                            { num: '02', title: 'Survey deleted', body: 'The survey organizer may have removed this room.' },
                            { num: '03', title: 'Expired room', body: 'Rooms may expire after the deadline has passed.' },
                        ].map((item) => (
                            <div key={item.num} className="p-5">
                                <div className="flex items-center justify-center w-11 h-11 bg-ink mb-3">
                                    <span className="font-mono text-[13px] text-paper-2">{item.num}</span>
                                </div>
                                <div className="font-sans text-[20px] font-bold mb-2">
                                    <b className="text-danger">{item.num} · </b>{item.title}
                                </div>
                                <div className="font-sans text-[14px] text-ink/72">
                                    {item.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default MeetingNotFoundPage

import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/ui/SmallHeader'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const findRoom = async (formData: FormData) => {
    'use server'
    const code = String(formData.get('code') ?? '')
        .trim()
        .toLowerCase()
    if (code) redirect(`/m/${code}`)
}

const MeetingNotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Nav */}
            <SmallHeader />

            {/* Content */}
            <section className="flex-1 max-w-[1440px] mx-auto w-full px-10 py-14">
                {/* Crumbs */}
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55 mb-10 flex items-center gap-1">
                    <Link href="/" className="hover:text-ink">
                        DAYLY
                    </Link>
                    <span className="text-ink/30">/</span>
                    <span>ROOM</span>
                    <span className="text-ink/30">/</span>
                    <span className="text-danger">404 · NOT FOUND</span>
                </div>

                <div
                    className="grid gap-24"
                    style={{ gridTemplateColumns: 'minmax(0,560px) minmax(0,1fr)' }}
                >
                    {/* Left copy */}
                    <div className="flex flex-col gap-6">
                        <h1
                            className="font-sans font-extrabold leading-[0.86] tracking-[-0.045em] mb-2"
                            style={{ fontSize: '88px' }}
                        >
                            Nothing on the <em className="not-italic text-danger">calendar</em>{' '}
                            here.
                        </h1>

                        <p className="font-sans text-[18px] font-medium max-w-[460px] text-ink/72 leading-[1.4]">
                            We couldn&apos;t find the survey you were looking for. The code might be
                            mistyped, or the room may have expired.
                        </p>

                        {/* Rejoin card */}
                        <div
                            className="bg-white border-2 border-ink p-[22px]"
                            style={{ boxShadow: '6px 6px 0 #161514' }}
                        >
                            <div className="mb-[14px] flex items-center gap-[10px]">
                                <span className="inline-flex items-center justify-center bg-ink text-paper-2 font-mono text-[11px] font-semibold tracking-[0.04em] px-2 py-[3px] leading-none">
                                    01
                                </span>
                                <span className="font-sans text-[16px] font-extrabold tracking-[-0.005em]">
                                    Try the code again
                                </span>
                            </div>
                            <form
                                action={findRoom}
                                className="grid gap-[10px]"
                                style={{ gridTemplateColumns: '1fr auto' }}
                            >
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="ROOM-CODE"
                                    className="bg-paper border-thin border-ink px-4 py-[14px] font-mono text-[20px] font-semibold uppercase tracking-[0.16em] placeholder:text-ink/35 placeholder:font-medium outline-none focus:bg-white min-w-0"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-[22px] bg-ink text-paper-2 border-thin border-ink shadow-brutal-sm press-effect font-sans text-[14px] font-extrabold tracking-[0.08em] inline-flex items-center gap-2"
                                >
                                    <span>Find</span>
                                    <span aria-hidden>→</span>
                                </button>
                            </form>
                            <div className="mt-3 font-mono text-[10.5px] tracking-[0.08em] text-ink/55">
                                <b className="text-ink font-bold">Tip.</b> Meetings have 8 character
                                alpha-numeric codes <code className="text-ink/70">AB12DE34</code>.
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-[14px] mt-2">
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-3 px-6 py-4 bg-mocha text-paper-2 border-brutal shadow-brutal-sm press-effect-mocha font-sans text-[16px] font-extrabold tracking-[0.06em]"
                            >
                                <span>Start a new survey</span>
                                <span aria-hidden className="text-[20px] leading-none">
                                    →
                                </span>
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center px-5 py-[14px] bg-white border-brutal shadow-brutal-sm press-effect font-sans text-[13px] font-bold tracking-[0.06em]"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>

                    {/* Right visual — mock card with stamp */}
                    <div className="relative self-stretch">
                        <div
                            className="relative bg-white border-2 border-ink w-full"
                            style={{
                                transform: 'rotate(0.4deg)',
                                boxShadow: '10px 10px 0 #161514',
                            }}
                        >
                            {/* Tape */}
                            <div
                                className="absolute -top-4 left-7 bg-ink text-paper font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] px-3 py-[6px] z-2"
                                style={{
                                    transform: 'rotate(-2deg)',
                                    boxShadow: '3px 3px 0 #7e6038',
                                }}
                            >
                                DAYLY · ROOM · not found
                            </div>

                            {/* Mock header */}
                            <div className="px-5 pt-4 pb-[14px] border-b-2 border-ink bg-white flex items-baseline justify-between">
                                <div className="font-sans text-[26px] font-extrabold tracking-[-0.03em] leading-none text-ink/35">
                                    —{' '}
                                    <span className="font-mono text-[14px] font-medium tracking-[-0.01em] text-ink/30 ml-1">
                                        —
                                    </span>
                                </div>
                                <div className="font-mono text-[10px] uppercase tracking-widest text-ink/35 flex items-center gap-3">
                                    <span>
                                        <b className="text-ink/50 font-bold">—</b> PEOPLE
                                    </span>
                                    <span>
                                        <b className="text-ink/50 font-bold">—</b> DAYS
                                    </span>
                                    <span>
                                        <b className="text-ink/50 font-bold">NO DATA</b>
                                    </span>
                                </div>
                            </div>

                            {/* Day-of-week header */}
                            <div className="grid grid-cols-7 bg-paper border-b-2 border-ink">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
                                    <div
                                        key={d}
                                        className={`px-[10px] py-[7px] font-sans text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/55 ${
                                            i < 6 ? 'border-r-[1.5px] border-ink' : ''
                                        }`}
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Mock grid */}
                            <div className="grid grid-cols-7 relative">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`bg-hatch h-[74px] px-[9px] py-[7px] relative ${
                                            i % 7 < 6 ? 'border-r-[1.5px] border-ink' : ''
                                        } ${i < 28 ? 'border-b-[1.5px] border-ink' : ''}`}
                                    >
                                        <span className="font-mono text-[11px] font-medium text-ink/30">
                                            ·
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* 404 stamp */}
                            <div
                                className="absolute pointer-events-none whitespace-nowrap text-center bg-danger text-paper border-[3px] border-ink"
                                style={{
                                    top: '38%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-6deg)',
                                    padding: '16px 28px 18px',
                                    boxShadow: '6px 6px 0 #161514',
                                }}
                            >
                                <div className="font-sans text-[44px] font-extrabold leading-[0.9] tracking-[0.04em]">
                                    404
                                </div>
                                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] mt-[6px] text-paper/80">
                                    NO SUCH ROOM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default MeetingNotFoundPage

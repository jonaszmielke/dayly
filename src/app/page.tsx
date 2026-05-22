import { HeroCell } from '@/components/calendar/HeroCell'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/ui/SmallHeader'
import { ymd } from '@/lib/dates'
import Link from 'next/link'

const HERO_TOTAL = 5

const heroFreeCount = (dom: number): number => {
    const n = (dom * 9301 + 49297) % 233280
    return Math.floor((n / 233280) * (HERO_TOTAL + 1))
}

const HomePage = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const monthStart = ymd(new Date(year, month, 1))
    const monthEnd = ymd(new Date(year, month + 1, 0))

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">
                {/* Nav */}

                <SmallHeader />

                {/* Hero */}
                <section className="max-w-[1440px] mx-auto w-full px-10 py-14">
                    <div
                        className="grid gap-12 items-start"
                        style={{ gridTemplateColumns: 'minmax(0,1fr) 420px' }}
                    >
                        {/* Left: mini calendar */}
                        <div className="w-full">
                            <MonthGrid
                                year={year}
                                month={month}
                                rangeStart={monthStart}
                                rangeEnd={monthEnd}
                                cellRenderer={(cell, inRange) => (
                                    <HeroCell
                                        cell={cell}
                                        inRange={inRange}
                                        freeCount={heroFreeCount(cell.dom)}
                                        totalCount={HERO_TOTAL}
                                    />
                                )}
                            />
                        </div>

                        {/* Right: copy */}
                        <div className="flex flex-col gap-6 pt-2">
                            <h1
                                className="font-sans font-extrabold leading-[0.86] tracking-[-0.045em]"
                                style={{ fontSize: '76px' }}
                            >
                                Find the
                                <br />
                                <em className="not-italic text-mocha">days</em> that
                                <br />
                                work.
                            </h1>

                            <p className="font-sans text-[18px] font-medium max-w-[380px] text-ink/80 leading-snug">
                                Share a link. Everyone picks their free days. Dayly shows you where
                                they overlap.
                            </p>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/new"
                                    className="px-5 py-3 bg-mocha text-paper-2 border-brutal shadow-brutal-sm press-effect-mocha font-sans text-[15px] font-bold uppercase tracking-[0.04em]"
                                >
                                    Create a survey
                                </Link>
                                {/* <Link
                                href="/mock"
                                className="px-5 py-3 bg-white border-brutal shadow-brutal-sm press-effect font-sans text-[15px] font-bold uppercase tracking-[0.04em]"
                            >
                                See example
                            </Link> */}
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                {[
                                    '/ No account needed',
                                    '/ Works for any group size',
                                    '/ Free forever',
                                ].map((b) => (
                                    <div
                                        key={b}
                                        className="font-mono text-[11px] text-ink/55 uppercase tracking-[0.06em]"
                                    >
                                        {b}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="max-w-[1440px] mx-auto w-full px-10 pb-16">
                    <div className="bg-white border-2 border-ink shadow-brutal">
                        <div className="grid grid-cols-3 divide-x-2 divide-ink">
                            {[
                                {
                                    num: '01',
                                    title: 'Create a survey',
                                    body: 'Name your meeting, pick a date range, and set a response deadline. Done in under a minute.',
                                },
                                {
                                    num: '02',
                                    title: 'Share the link',
                                    body: 'Send the link to everyone. They tap their free days — no login, no app download required.',
                                },
                                {
                                    num: '03',
                                    title: 'Find the overlap',
                                    body: 'The heatmap shows which days work for the most people. Pick the best slot instantly.',
                                },
                            ].map((f) => (
                                <div key={f.num} className="p-7">
                                    <div
                                        className="flex items-center justify-center w-11 h-11 bg-ink mb-4"
                                        style={{ boxShadow: '3px 3px 0 #7E6038' }}
                                    >
                                        <span className="font-mono text-[13px] font-bold text-paper-2">
                                            {f.num}
                                        </span>
                                    </div>
                                    <h3 className="font-sans text-[20px] font-bold mb-2">
                                        {f.title}
                                    </h3>
                                    <p className="font-sans text-[14px] text-ink/72 leading-relaxed">
                                        {f.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default HomePage

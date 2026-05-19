import { MonthGrid } from '@/components/calendar/MonthGrid'
import { SummaryCell } from '@/components/calendar/SummaryCell'
import { Footer } from '@/components/Footer'
import { Wordmark } from '@/components/Wordmark'
import Link from 'next/link'

// Static hero mock data for landing calendar — June 2026
const HERO_PEOPLE = [
    {
        id: 1,
        name: 'Alice',
        availSet: new Set([
            '2026-06-13',
            '2026-06-14',
            '2026-06-15',
            '2026-06-16',
            '2026-06-20',
            '2026-06-21',
            '2026-06-22',
        ]),
    },
    {
        id: 2,
        name: 'Bob',
        availSet: new Set([
            '2026-06-14',
            '2026-06-15',
            '2026-06-20',
            '2026-06-21',
            '2026-06-27',
            '2026-06-28',
        ]),
    },
    {
        id: 3,
        name: 'Carla',
        availSet: new Set([
            '2026-06-13',
            '2026-06-14',
            '2026-06-20',
            '2026-06-21',
            '2026-06-22',
            '2026-06-23',
        ]),
    },
    {
        id: 4,
        name: 'Daniel',
        availSet: new Set([
            '2026-06-20',
            '2026-06-21',
            '2026-06-22',
            '2026-06-24',
            '2026-06-27',
            '2026-06-28',
        ]),
    },
    {
        id: 5,
        name: 'Erin',
        availSet: new Set([
            '2026-06-14',
            '2026-06-20',
            '2026-06-21',
            '2026-06-22',
            '2026-06-28',
            '2026-06-29',
        ]),
    },
]

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Nav */}
            <nav className="sticky top-0 z-10 bg-paper border-b-2 border-ink">
                <div
                    className="max-w-[1440px] mx-auto px-10 py-3.5 grid items-center gap-8"
                    style={{ gridTemplateColumns: 'auto 1fr auto' }}
                >
                    <Link href="/">
                        <Wordmark />
                    </Link>
                    <div className="flex items-center justify-center gap-6" />
                    {/* {[
                            { label: 'How it works', href: '#how' },
                            { label: 'Features', href: '#features' },
                            { label: 'Example', href: '/mock' },
                        ].map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/65 hover:text-ink transition-colors pb-0.5 border-b border-transparent hover:border-mocha"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div> */}
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper-2 border-2 border-ink font-sans text-[13px] font-extrabold uppercase tracking-[0.06em] press-effect transition-all"
                        style={{ boxShadow: '3px 3px 0 #7e6038' }}
                    >
                        Start a survey →
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-[1440px] mx-auto w-full px-10 py-14">
                <div
                    className="grid gap-12 items-start"
                    style={{ gridTemplateColumns: 'minmax(0,1fr) 420px' }}
                >
                    {/* Left: mini calendar */}
                    <div className="w-full">
                        <MonthGrid
                            year={2026}
                            month={5}
                            rangeStart="2026-06-12"
                            rangeEnd="2026-06-29"
                            daysInRange={18}
                            cellRenderer={(cell, inRange) => (
                                <SummaryCell
                                    cell={cell}
                                    inRange={inRange}
                                    people={HERO_PEOPLE}
                                    selectedPersonId={null}
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
                            Share a link. Everyone picks their free days. Dayly shows you where they
                            overlap.
                        </p>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/create"
                                className="px-5 py-3 bg-mocha text-paper-2 border-brutal shadow-brutal press-effect-mocha font-sans text-[15px] font-bold uppercase tracking-[0.04em]"
                            >
                                Create a survey
                            </Link>
                            <Link
                                href="/mock"
                                className="px-5 py-3 bg-white border-brutal shadow-brutal-sm press-effect font-sans text-[15px] font-bold uppercase tracking-[0.04em]"
                            >
                                See example
                            </Link>
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
                                <h3 className="font-sans text-[20px] font-bold mb-2">{f.title}</h3>
                                <p className="font-sans text-[14px] text-ink/72 leading-relaxed">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer
                links={[
                    { label: 'Create survey', href: '/create' },
                    { label: 'Example', href: '/mock' },
                ]}
            />
        </div>
    )
}

export default HomePage

import { Wordmark } from '../Wordmark'
import Link from 'next/link'

export const SmallHeader = () => {
    return (
        <nav className="sticky top-0 bg-paper border-b-2 border-ink z-50">
            <div
                className="max-w-[1440px] mx-auto px-10 py-3.5 grid items-center gap-8"
                style={{ gridTemplateColumns: 'auto 1fr auto' }}
            >
                <Link href="/">
                    <Wordmark />
                </Link>
                <div className="flex items-center justify-center gap-6" />
                <Link
                    href="/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-paper-2 border-2 border-ink font-sans text-[13px] font-extrabold uppercase tracking-[0.06em] press-effect transition-all"
                    style={{ boxShadow: '3px 3px 0 #7e6038' }}
                >
                    Start a survey →
                </Link>
            </div>
        </nav>
    )
}

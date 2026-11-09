import Link from 'next/link'

export const NotFoundActions = () => (
    <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center gap-3 lg:gap-[14px] mt-2">
        <Link
            href="/new"
            className="inline-flex items-center gap-3 px-6 py-4 bg-mocha text-paper-2 border-brutal shadow-brutal-sm press-effect-mocha font-sans text-[15px] lg:text-[16px] font-extrabold tracking-[0.06em]"
        >
            <span>Start a new survey</span>
            <span aria-hidden="true" className="text-[20px] leading-none">
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
)

export const BestBannerLoading = () => (
    <div
        className="bg-white border-brutal flex items-center gap-3 lg:gap-4 px-3 lg:px-5 py-3 lg:py-4"
        style={{ boxShadow: 'var(--b-shadow-sm) #C5AC6A' }}
    >
        <div className="bg-ink text-paper-2 px-2 py-1.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.12em] shrink-0">
            BEST
        </div>
        <div className="flex-1 min-w-0">
            <div className="h-[17px] lg:h-[22px] w-3/5 rounded bg-ink/10 animate-pulse" />
            <div className="h-[10px] lg:h-[11px] w-2/5 rounded bg-ink/10 animate-pulse mt-1.5" />
        </div>
        <span className="font-mono text-[16px] lg:text-[20px] text-ink/30">↘</span>
    </div>
)

export const PersonOptionSkeleton = () => (
    <output className="flex items-center gap-3 px-4 py-2.5">
        <span aria-hidden="true" className="text-[16px]">
            ○
        </span>
        <span aria-hidden="true" className="flex-1 h-3.5 rounded bg-ink/10 animate-pulse" />
        <span className="sr-only">Loading people</span>
    </output>
)

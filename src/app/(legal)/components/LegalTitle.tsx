export const LegalTitle = ({ title, updatedAt }: { title: string; updatedAt: string }) => {
    return (
        <div className="mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                Legal
            </span>
            <h1 className="font-sans font-extrabold text-[36px] lg:text-[48px] leading-[0.9] tracking-[-0.03em] mt-2">
                {title}
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40 mt-3">
                Last updated: {updatedAt}
            </p>
        </div>
    )
}

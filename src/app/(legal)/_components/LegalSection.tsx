export const LegalSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b-2 border-ink/20 pb-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-mocha mb-3">
            {title}
        </h2>
        <div className="font-sans text-[15px] text-ink/80 leading-relaxed space-y-2">
            {children}
        </div>
    </div>
)

type CreateSectionProps = {
    number: string
    title: string
    hint?: string
    children: React.ReactNode
}

export const CreateSection = ({ number, title, hint, children }: CreateSectionProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-ink text-paper-2 w-7 h-7 flex items-center justify-center font-mono text-[12px]">
                        {number}
                    </div>
                    <h2 className="font-sans text-[22px] font-bold">{title}</h2>
                </div>
                {hint && (
                    <span className="self-end lg:self-auto font-mono text-[11px] text-ink/45 uppercase tracking-[0.08em]">
                        {hint}
                    </span>
                )}
            </div>
            {children}
        </div>
    )
}

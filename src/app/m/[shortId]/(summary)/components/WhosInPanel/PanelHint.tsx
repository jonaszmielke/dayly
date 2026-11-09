type PanelHintProps = {
    hasSelection: boolean
}

export const PanelHint = ({ hasSelection }: PanelHintProps) => {
    const hint = hasSelection ? 'CLICK SAME NAME TO CLEAR' : 'CLICK A NAME TO ISOLATE'

    return (
        <div className="px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink/55 border-b border-ink/10">
            {hint}
        </div>
    )
}

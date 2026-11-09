import Link from 'next/link'

type SelectionActionsProps = {
    meetingShortId: string
    personName: string
    onClearSelection: () => void
}

export const SelectionActions = ({
    meetingShortId,
    personName,
    onClearSelection,
}: SelectionActionsProps) => (
    <div className="p-3 border-t border-ink/20 flex flex-col gap-2">
        <Link
            href={`/m/${meetingShortId}/respond?edit=${encodeURIComponent(personName)}`}
            className="w-full py-2.5 px-3 bg-ink text-paper-2 border-brutal shadow-brutal-mocha-sm font-sans text-[12px] font-bold uppercase tracking-[0.08em] press-effect-mocha text-center"
        >
            ✎ Edit {personName}&apos;s availability
        </Link>
        <button
            type="button"
            onClick={onClearSelection}
            className="w-full py-2 px-3 border-thin font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55 hover:text-ink hover:border-ink transition-colors"
            style={{ borderStyle: 'dashed' }}
        >
            ← Back to heatmap
        </button>
    </div>
)

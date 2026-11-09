import { appShortUrl } from '@/lib/utils'

export const DraftBadge = () => (
    <div className="flex flex-col items-end gap-1">
        <div className="bg-ink text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest">
            DRAFT
        </div>
        <span className="font-mono text-[11px] text-ink/50">{appShortUrl()}/new</span>
    </div>
)

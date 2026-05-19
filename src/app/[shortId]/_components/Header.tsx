import { Meeting } from '@prisma/client'
import { TopBar } from '@/components/TopBar'
import { CopyButton } from '@/components/CopyButton'
import { formatDate } from '@/lib/dates'

const MONTH_ABBR = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

function fmtDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')} ${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`
}

const MeetingHeader = ({ meeting }: { meeting: Meeting }) => {
    const dateRange = `${fmtDate(meeting.startDate)} — ${fmtDate(meeting.endDate)}`
    const mode = meeting.mode === 'DAYS' ? 'DAY MODE' : 'HOUR MODE'

    return (
        <TopBar
            crumbs={[
                { label: 'Surveys', href: '/' },
                { label: meeting.name },
            ]}
            title={meeting.name}
            meta={[dateRange, mode]}
            right={
                <div className="flex flex-col items-end gap-1">
                    <CopyButton text={`dayly.cz/s/${meeting.shortId}`} />
                    <span className="font-mono text-[11px] text-ink/50 tracking-[0.04em]">
                        dayly.cz/s/{meeting.shortId}
                    </span>
                </div>
            }
        />
    )
}

export default MeetingHeader

'use client'

import { CopyButton } from '@/components/CopyButton'
import { TopBar } from '@/components/TopBar'
import { MONTH_ABBREVIATIONS } from '@/lib/dates'
import { appUrl } from '@/lib/utils'
import { Meeting, MeetingMode } from '@prisma/client'
import { ReactNode } from 'react'

const fmtDate = (d: Date): string => {
    return `${String(d.getDate()).padStart(2, '0')} ${MONTH_ABBREVIATIONS[d.getMonth()]} ${d.getFullYear()}`
}

type MeetingHeaderProps = {
    meeting: Meeting
    mobileRight?: ReactNode
}

const MeetingHeader = ({ meeting, mobileRight }: MeetingHeaderProps) => {
    const dateRange = `${fmtDate(meeting.startDate)} — ${fmtDate(meeting.endDate)}`
    const mode = meeting.mode === MeetingMode.DAYS ? 'DAY MODE' : 'HOUR MODE'

    const link = `${appUrl()}/m/${meeting.shortId}`

    return (
        <TopBar
            compact
            crumbs={[{ label: 'Surveys', href: '/' }, { label: meeting.name }]}
            title={meeting.name}
            meta={[dateRange, mode]}
            mobileRight={mobileRight}
            right={
                <div className="flex flex-col items-end gap-2">
                    <CopyButton text={link} />
                    <span className="font-mono text-[11px] text-ink/50 tracking-[0.04em]">
                        {link}
                    </span>
                </div>
            }
        />
    )
}

export default MeetingHeader

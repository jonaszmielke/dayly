'use client'

import { CopyButton } from '@/components/CopyButton'
import { TopBar } from '@/components/TopBar'
import { MONTH_ABBREVIATIONS } from '@/lib/dates'
import { appShortUrl, appUrl } from '@/lib/utils'
import { Meeting, MeetingMode } from '@prisma/client'
import { ReactNode } from 'react'
import Link from 'next/link'

const fmtDate = (d: Date): string => {
    return `${String(d.getDate()).padStart(2, '0')} ${MONTH_ABBREVIATIONS[d.getMonth()]} ${d.getFullYear()}`
}

type MeetingHeaderProps = {
    meeting: Meeting
    mobileRight?: ReactNode
    showMobileAddResponseButton?: boolean
}

const MeetingHeader = ({
    meeting,
    mobileRight,
    showMobileAddResponseButton = false,
}: MeetingHeaderProps) => {
    const dateRange = `${fmtDate(meeting.startDate)} — ${fmtDate(meeting.endDate)}`
    const mode = meeting.mode === MeetingMode.DAYS ? 'DAY MODE' : 'HOUR MODE'

    const addResponseButton = showMobileAddResponseButton ? (
        <Link
            href={`/m/${meeting.shortId}/respond`}
            className="flex items-center gap-2 px-3 py-2 bg-ink press-effect text-paper-2 font-sans text-[11px] font-bold uppercase tracking-[0.06em]"
            style={{ boxShadow: '3px 3px 0 #C5AC6A' }}
        >
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-paper-2 font-mono text-[10px] leading-none">
                +
            </span>
            ADD RESPONSE
        </Link>
    ) : undefined

    return (
        <TopBar
            compact
            crumbs={[{ label: 'Surveys', href: '/' }, { label: meeting.name }]}
            title={meeting.name}
            meta={[dateRange, mode]}
            mobileRight={mobileRight}
            mobileAction={addResponseButton}
            right={
                <div className="flex flex-col items-end gap-2">
                    <CopyButton text={`${appUrl()}/m/${meeting.shortId}`} />
                    <span className="font-mono text-[11px] text-ink/50 tracking-[0.04em]">
                        {`${appShortUrl()}/m/${meeting.shortId}`}
                    </span>
                </div>
            }
        />
    )
}

export default MeetingHeader

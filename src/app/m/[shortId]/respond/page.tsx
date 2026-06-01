import { getMeeting } from '../_actions/getMeeting'
import { RespondDaysClient } from './_components/RespondDaysClient'
import { RespondHoursClient } from './_components/RespondHoursClient'
import { MeetingMode } from '@/generated/prisma/enums'
import { Metadata } from 'next'

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ shortId: string }>
}): Promise<Metadata> => {
    const { shortId } = await params
    const meeting = await getMeeting(shortId)
    return {
        title: `Respond to ${meeting.name} · Dayly`,
    }
}

const RespondPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
    const { shortId } = await params

    const meeting = await getMeeting(shortId)

    return meeting.mode === MeetingMode.HOURS ? (
        <RespondHoursClient meeting={meeting} />
    ) : (
        <RespondDaysClient meeting={meeting} />
    )
}

export default RespondPage

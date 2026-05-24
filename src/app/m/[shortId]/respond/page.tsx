import { getMeeting } from '../_actions/getMeeting'
import { RespondPageClient } from './_components/RespondPageClient'
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

    return <RespondPageClient meeting={meeting} />
}

export default RespondPage

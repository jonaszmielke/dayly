import { getMeeting } from '../_actions/getMeeting'
import { SummaryPageClient } from './_components/SummaryPageClient'
import { Metadata } from 'next'

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ shortId: string }>
}): Promise<Metadata> => {
    const { shortId } = await params
    const meeting = await getMeeting(shortId)
    return {
        title: `${meeting.name} · Dayly`,
    }
}

const SummaryPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
    const { shortId } = await params

    const meeting = await getMeeting(shortId)

    return <SummaryPageClient meeting={meeting} />
}

export default SummaryPage

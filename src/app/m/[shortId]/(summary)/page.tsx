import { getMeeting } from '../_actions/getMeeting'
import { SummaryPageClient } from './_components/SummaryPageClient'

const SummaryPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
    const { shortId } = await params

    const meeting = await getMeeting(shortId)

    return <SummaryPageClient meeting={meeting} />
}

export default SummaryPage

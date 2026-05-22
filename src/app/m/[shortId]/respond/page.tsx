import { getMeeting } from '../_actions/getMeeting'
import { RespondPageClient } from './_components/RespondPageClient'

const RespondPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
    const { shortId } = await params

    const meeting = await getMeeting(shortId)

    return <RespondPageClient meeting={meeting} />
}

export default RespondPage

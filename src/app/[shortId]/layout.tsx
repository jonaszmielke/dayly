import { getMeeting } from './_actions/getMeeting'
import MeetingHeader from './_components/Header'

const MeetingLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ shortId: string }>
}) => {
    const { shortId } = await params

    const meeting = await getMeeting(shortId)

    return (
        <div>
            <MeetingHeader meeting={meeting} />
            {children}
        </div>
    )
}

export default MeetingLayout

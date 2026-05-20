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
        <div className="min-h-screen flex flex-col">
            <MeetingHeader meeting={meeting} />
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default MeetingLayout

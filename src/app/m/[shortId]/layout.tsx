import { getMeeting } from './_actions/getMeeting'
import MeetingHeader from './_components/Header'
import { Footer } from '@/components/Footer'

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
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">
                <MeetingHeader meeting={meeting} />
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    )
}

export default MeetingLayout

import { Footer } from '@/components/Footer'

const MeetingLayout = ({
    children,
}: {
    children: React.ReactNode
    params: Promise<{ shortId: string }>
}) => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">{children}</div>
            <Footer />
        </div>
    )
}

export default MeetingLayout

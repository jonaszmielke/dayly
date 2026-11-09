import { MockCalendarCard } from './components/notFound/MockCalendarCard'
import { NotFoundActions } from './components/notFound/NotFoundActions'
import { NotFoundIntro } from './components/notFound/NotFoundIntro'
import { RoomCodeCard } from './components/notFound/RoomCodeCard'
import { type Crumb, Crumbs } from '@/components/Crumbs'
import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/SmallHeader'

const NOT_FOUND_CRUMBS: Crumb[] = [
    { label: 'DAYLY', href: '/' },
    { label: 'ROOM' },
    { label: '404 · NOT FOUND', tone: 'danger' },
]

const MeetingNotFoundPage = () => (
    <div className="min-h-screen flex flex-col">
        <SmallHeader />

        <section className="flex-1 max-w-360 mx-auto w-full px-4 lg:px-10 py-10 lg:py-14">
            <Crumbs crumbs={NOT_FOUND_CRUMBS} className="mb-8 lg:mb-10" />

            <div className="grid gap-10 lg:gap-24 grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
                <div className="flex flex-col gap-6">
                    <NotFoundIntro />
                    <RoomCodeCard />
                    <NotFoundActions />
                </div>
                <MockCalendarCard />
            </div>
        </section>

        <Footer />
    </div>
)

export default MeetingNotFoundPage

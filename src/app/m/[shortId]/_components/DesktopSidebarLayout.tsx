import { type ReactNode } from 'react'

type DesktopSidebarLayoutProps = {
    /** Left column; sticks to the top while the main column scrolls. */
    sidebar: ReactNode
    children: ReactNode
}

/** Desktop-only (lg+) page frame of the meeting pages: sticky sidebar plus a main column. */
export const DesktopSidebarLayout = ({ sidebar, children }: DesktopSidebarLayoutProps) => (
    <div className="hidden lg:block py-8">
        <div className="mx-auto w-full max-w-[1600px] px-6 xl:px-10">
            <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
                <aside className="flex flex-col gap-4 sticky top-6 self-start">{sidebar}</aside>
                <main className="flex flex-col gap-6">{children}</main>
            </div>
        </div>
    </div>
)

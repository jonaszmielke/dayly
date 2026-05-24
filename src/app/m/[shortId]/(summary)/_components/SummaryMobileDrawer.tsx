'use client'

import { Person } from '../../types'
import { WhosInPanel } from './WhosInPanel'
import { CopyButton } from '@/components/CopyButton'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
} from '@/components/ui/drawer'
import { appShortUrl } from '@/lib/utils'
import Link from 'next/link'

type SummaryMobileDrawerProps = {
    open: boolean
    onClose: () => void
    meetingShortId: string
    meta?: string
    people: Person[]
    selectedPersonId: number | null
    onPersonClick: (id: number) => void
    onClearSelection: () => void
}

export const SummaryMobileDrawer = ({
    open,
    onClose,
    meetingShortId,
    meta,
    people,
    selectedPersonId,
    onPersonClick,
    onClearSelection,
}: SummaryMobileDrawerProps) => {
    return (
        <Drawer
            direction="right"
            open={open}
            onOpenChange={(o) => {
                if (!o) onClose()
            }}
        >
            <DrawerContent
                className="lg:hidden bg-paper border-l-[2.5px] border-ink rounded-none sm:max-w-[420px] h-full overflow-y-auto p-4 gap-4"
                aria-describedby={undefined}
            >
                <DrawerTitle className="sr-only">Menu</DrawerTitle>
                <DrawerDescription className="sr-only">
                    Share link, add response, who&apos;s in
                </DrawerDescription>

                <div className="flex justify-end">
                    <DrawerClose
                        aria-label="Close menu"
                        className="flex items-center justify-center w-9 h-9 bg-white border-2 border-ink font-sans text-[20px] font-bold leading-none"
                        style={{ boxShadow: '3px 3px 0 #161514' }}
                    >
                        ×
                    </DrawerClose>
                </div>

                {/* Share section */}
                <div className="grid grid-cols-2 gap-2.5">
                    <CopyButton
                        text={`${appShortUrl()}/m/${meetingShortId}`}
                        className="w-full h-12 justify-center px-2 text-[12px] whitespace-nowrap"
                    />
                    <Link
                        href={`/m/${meetingShortId}/respond`}
                        onClick={onClose}
                        className="flex items-center justify-center gap-1.5 h-12 px-2 bg-ink text-paper-2 border-brutal font-sans text-[12px] font-bold uppercase tracking-[0.06em] whitespace-nowrap press-effect"
                        style={{ boxShadow: '4px 4px 0 #C5AC6A' }}
                    >
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-paper-2 font-mono text-[10px] leading-none">
                            +
                        </span>
                        ADD RESPONSE
                    </Link>
                </div>

                {meta && (
                    <div className="flex items-center justify-center w-full">
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/55">
                            {meta}
                        </p>
                    </div>
                )}

                {/* Who's in */}
                <div className="flex flex-col mt-2">
                    <WhosInPanel
                        meetingShortId={meetingShortId}
                        people={people}
                        selectedPersonId={selectedPersonId}
                        onPersonClick={(id) => {
                            onPersonClick(id)
                            onClose()
                        }}
                        onClearSelection={() => {
                            onClearSelection()
                            onClose()
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

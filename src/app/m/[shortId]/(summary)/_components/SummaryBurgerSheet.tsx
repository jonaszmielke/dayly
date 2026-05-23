'use client'

import { Person } from '../../types'
import { WhosInPanel } from './WhosInPanel'
import { CopyButton } from '@/components/CopyButton'
import { appUrl } from '@/lib/utils'
import { useEffect } from 'react'
import Link from 'next/link'

type SummaryBurgerSheetProps = {
    open: boolean
    onClose: () => void
    meetingShortId: string
    people: Person[]
    selectedPersonId: number | null
    onPersonClick: (id: number) => void
    onClearSelection: () => void
}

export const SummaryBurgerSheet = ({
    open,
    onClose,
    meetingShortId,
    people,
    selectedPersonId,
    onPersonClick,
    onClearSelection,
}: SummaryBurgerSheetProps) => {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    return (
        <div
            className="fixed inset-0 z-50 pointer-events-none lg:hidden"
            aria-hidden={!open}
            data-open={open}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-ink/55 backdrop-blur-[2px] transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`absolute left-0 right-0 bottom-0 mx-auto max-w-[430px] max-h-[88vh] overflow-y-auto bg-paper border-t-[2.5px] border-x-[2.5px] border-ink flex flex-col gap-4 p-4 transition-transform duration-220 ease-[cubic-bezier(.2,.8,.2,1)] pointer-events-auto ${open ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ boxShadow: '0 -10px 0 #161514, 0 -14px 0 -2px #C5AC6A' }}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-1 pb-2">
                    <div className="w-12 h-[5px] bg-ink" />
                </div>

                {/* Share section */}
                <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/55 px-0.5">
                        SHARE
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex items-center justify-center">
                            <CopyButton
                                text={`${appUrl()}/m/${meetingShortId}`}
                                className="w-full justify-center py-3.5 text-[12px]"
                            />
                        </div>
                        <Link
                            href={`/m/${meetingShortId}/respond`}
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 px-3 py-3.5 bg-ink text-paper-2 border-brutal font-sans text-[12px] font-bold uppercase tracking-[0.06em]"
                            style={{ boxShadow: '4px 4px 0 #C5AC6A' }}
                        >
                            <span className="inline-flex items-center justify-center w-4 h-4 border border-paper-2 font-mono text-[11px] leading-none">
                                +
                            </span>
                            ADD RESPONSE
                        </Link>
                    </div>
                </div>

                {/* Who's in */}
                <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/55 px-0.5">
                        WHO&apos;S IN
                    </span>
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
            </div>
        </div>
    )
}

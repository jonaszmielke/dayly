'use client'

import { DesktopSidebarLayout } from '../../components/DesktopSidebarLayout'
import { MeetingHeader } from '../../components/MeetingHeader'
import { type MeetingClean } from '../../types'
import { type RespondForm } from '../hooks/useRespondForm'
import { MobileActionBar } from './MobileActionBar'
import { NamePanel } from './NamePanel'
import { type StatRow, StatCard } from '@/components/StatCard'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

/** Mode-specific wording; everything else in the layout is shared. */
export type RespondCopy = {
    title: string
    desktopSubtitle: string
    mobileHelp: string
    desktopHelp: string[]
    /** Two lines next to the big counter, e.g. ['DAYS', 'SELECTED']. */
    counterLabel: [string, string]
    mobileCountLabel?: string
}

type RespondLayoutProps = {
    meeting: MeetingClean
    copy: RespondCopy
    editOriginalName?: string
    form: RespondForm
    selectedCount: number
    onReset: () => void
    statRows: StatRow[]
    /** Rendered under the name panel, e.g. quick picks. */
    sidebarExtra?: ReactNode
    grids: ReactNode
    /** Shown instead of the page while the edited response loads. */
    isLoading: boolean
    skeleton: ReactNode
}

export const RespondLayout = ({
    meeting,
    copy,
    editOriginalName,
    form,
    selectedCount,
    onReset,
    statRows,
    sidebarExtra,
    grids,
    isLoading,
    skeleton,
}: RespondLayoutProps) => {
    if (isLoading) {
        return (
            <>
                <MeetingHeader meeting={meeting} />
                <div className="flex flex-col gap-4 px-4 py-6 lg:py-8">
                    <div className="mx-auto flex w-full max-w-225 flex-col gap-4">{skeleton}</div>
                </div>
            </>
        )
    }

    return (
        <>
            <MeetingHeader meeting={meeting} />

            {/* ── Mobile layout ── */}
            <div className="flex flex-col gap-4 px-4 py-6 pb-32.5 lg:hidden">
                <MobileBanner title={copy.title} editOriginalName={editOriginalName} />
                <NamePanel
                    name={form.name}
                    onNameChange={form.setName}
                    editOriginalName={editOriginalName}
                />
                {sidebarExtra}
                {grids}
                <HelpLines lines={[copy.mobileHelp]} />
                <StatCard rows={statRows} />
            </div>

            {/* ── Desktop layout ── */}
            <DesktopSidebarLayout
                sidebar={
                    <>
                        <NamePanel
                            name={form.name}
                            onNameChange={form.setName}
                            editOriginalName={editOriginalName}
                        />
                        {sidebarExtra}
                        <StatCard rows={statRows} />
                        <SelectionCounter count={selectedCount} label={copy.counterLabel} />
                        <DesktopActions form={form} onReset={onReset} />
                        <HelpLines lines={copy.desktopHelp} />
                    </>
                }
            >
                <DesktopBanner title={copy.title} subtitle={copy.desktopSubtitle} />
                {grids}
            </DesktopSidebarLayout>

            <MobileActionBar
                count={selectedCount}
                onReset={onReset}
                onSave={form.handleSave}
                saveLabel={form.saveLabel}
                canReset={selectedCount > 0}
                canSave={form.canSave}
                saveState={form.saveState}
                countLabel={copy.mobileCountLabel}
            />
        </>
    )
}

const BADGE_CLASSES =
    'bg-mocha text-paper-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]'

const MobileBanner = ({
    title,
    editOriginalName,
}: {
    title: string
    editOriginalName?: string
}) => {
    const badge = editOriginalName ? 'EDIT' : 'PICK'
    const heading = editOriginalName ? `Editing ${editOriginalName}'s response` : title

    return (
        <div className="bg-white border-brutal shadow-brutal flex items-center gap-3 p-3 ">
            <div className={cn(BADGE_CLASSES, 'shrink-0')}>{badge}</div>
            <div className="flex-1 min-w-0">
                <div className="font-sans text-[17px] font-bold leading-tight">{heading}</div>
                <div className="font-mono text-[10px] text-ink/55 mt-0.5">
                    TAP · DRAG TO PAINT MANY
                </div>
            </div>
        </div>
    )
}

const DesktopBanner = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="bg-white border-brutal shadow-brutal flex items-center gap-4 px-5 py-4">
        <div className={BADGE_CLASSES}>PICK</div>
        <div className="flex-1">
            <div className="font-sans text-[22px] font-bold leading-tight">{title}</div>
            <div className="font-mono text-[11px] text-ink/55 mt-0.5">{subtitle}</div>
        </div>
        <span className="font-mono text-[20px] text-ink/30">↗</span>
    </div>
)

const COUNTER_LABEL_CLASSES =
    'font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-paper/70'

const SelectionCounter = ({ count, label }: { count: number; label: [string, string] }) => (
    <div className="bg-ink text-paper-2 border-brutal shadow-brutal-mocha grid grid-cols-[auto_1fr] items-center gap-4 px-5 py-4">
        <span className="font-sans font-extrabold leading-none tracking-tighter text-[56px]">
            {String(count).padStart(2, '0')}
        </span>
        <div>
            <div className={COUNTER_LABEL_CLASSES}>{label[0]}</div>
            <div className={COUNTER_LABEL_CLASSES}>{label[1]}</div>
        </div>
    </div>
)

const ACTION_BUTTON_CLASSES =
    'py-3 border-brutal font-sans text-[13px] font-bold uppercase tracking-[0.08em] press-effect'

const SAVE_BUTTON_STATE_CLASSES = {
    saved: 'bg-mocha-dark text-paper-2 shadow-brutal',
    default: 'bg-mocha text-paper-2 shadow-brutal disabled:opacity-40 disabled:cursor-not-allowed',
}

const DesktopActions = ({ form, onReset }: { form: RespondForm; onReset: () => void }) => {
    const saveStateClasses =
        form.saveState === 'success'
            ? SAVE_BUTTON_STATE_CLASSES.saved
            : SAVE_BUTTON_STATE_CLASSES.default

    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={form.handleSave}
                disabled={!form.canSave}
                className={cn(ACTION_BUTTON_CLASSES, saveStateClasses)}
            >
                {form.saveLabel}
            </button>
            <button
                type="button"
                onClick={onReset}
                className={cn(
                    ACTION_BUTTON_CLASSES,
                    'bg-white shadow-brutal-sm hover:bg-paper transition-colors'
                )}
            >
                Reset
            </button>
        </div>
    )
}

const HelpLines = ({ lines }: { lines: string[] }) => (
    <div className="font-mono text-[10px] text-ink/45 space-y-0.5">
        {lines.map((line) => (
            <div key={line}>{line}</div>
        ))}
    </div>
)

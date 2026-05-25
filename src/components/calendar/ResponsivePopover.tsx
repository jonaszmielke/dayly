'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useIsMobile } from '@/lib/useIsMobile'
import { cn } from '@/lib/utils'
import { Popover } from '@base-ui/react/popover'
import { CSSProperties, ReactNode } from 'react'

type ResponsivePopoverProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    trigger: ReactNode
    triggerClassName?: string
    triggerStyle?: CSSProperties
    subtext: ReactNode
    children: ReactNode
}

const SUBTEXT_CLASS = 'mt-1 pl-2 font-mono text-[11px] text-ink/55 uppercase tracking-[0.08em]'
const PANEL_CLASS = 'bg-white border-brutal shadow-brutal'

export const ResponsivePopover = ({
    open,
    onOpenChange,
    trigger,
    triggerClassName,
    triggerStyle,
    subtext,
    children,
}: ResponsivePopoverProps) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger className={triggerClassName} style={triggerStyle}>
                    {trigger}
                </DialogTrigger>
                <div className={SUBTEXT_CLASS}>{subtext}</div>
                <DialogContent
                    showCloseButton={false}
                    className={cn(
                        PANEL_CLASS,
                        'rounded-none p-0 gap-0 ring-0',
                        'w-[min(540px,calc(100vw-1.5rem))] max-w-none sm:max-w-none',
                        'max-h-[90dvh] overflow-y-auto'
                    )}
                >
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger className={triggerClassName} style={triggerStyle}>
                {trigger}
            </Popover.Trigger>
            <div className={SUBTEXT_CLASS}>{subtext}</div>
            <Popover.Portal>
                <Popover.Positioner align="center" sideOffset={10}>
                    <Popover.Popup
                        className={cn('z-50 w-[min(540px,calc(100vw-1rem))]', PANEL_CLASS)}
                    >
                        {children}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}

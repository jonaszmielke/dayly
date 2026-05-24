'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

type CopyButtonProps = {
    text: string
    className?: string
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
    const [copied, setCopied] = useState<boolean>(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
        })
    }

    return (
        <button
            onClick={handleCopy}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em]',
                'border-brutal shadow-brutal-sm press-effect transition-all',
                copied ? 'bg-ink text-paper-2' : 'bg-white text-ink',
                className
            )}
        >
            <span>{copied ? '✓' : '⎘'}</span>
            <span>Copy Link</span>
        </button>
    )
}

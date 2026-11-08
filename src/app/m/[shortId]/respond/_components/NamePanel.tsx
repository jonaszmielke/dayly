'use client'

import { cn } from '@/lib/utils'
import { useId } from 'react'

const MAX_NAME_LENGTH = 32

type NamePanelProps = {
    name: string
    onNameChange: (name: string) => void
    /** Set when editing an existing response. */
    editOriginalName?: string
}

const getNameStatus = (name: string, editOriginalName?: string): string => {
    if (!editOriginalName) return 'Your Name'
    if (name === editOriginalName) return 'Keeping the same name'
    return 'Changing name'
}

export const NamePanel = ({ name, onNameChange, editOriginalName }: NamePanelProps) => {
    const statusId = useId()
    // The status only adds information in edit mode; otherwise it would repeat the label.
    const describedBy = editOriginalName ? statusId : undefined

    return (
        <div className="bg-white border-brutal shadow-brutal">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/20">
                <span
                    id={statusId}
                    className="font-sans text-[13px] font-bold uppercase tracking-[0.08em]"
                >
                    {getNameStatus(name, editOriginalName)}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mocha">
                    Required
                </span>
            </div>
            <div className="p-3">
                <input
                    type="text"
                    aria-label="Your name"
                    aria-describedby={describedBy}
                    required
                    value={name}
                    onChange={(e) =>
                        onNameChange(e.target.value.toUpperCase().slice(0, MAX_NAME_LENGTH))
                    }
                    placeholder="YOUR NAME"
                    minLength={3}
                    maxLength={MAX_NAME_LENGTH}
                    className={cn(
                        'w-full bg-paper border-thin px-3 py-3',
                        'font-sans text-[22px] font-bold uppercase',
                        'placeholder:text-ink/30 text-ink',
                        'outline-none focus:bg-white'
                    )}
                    style={{ caretColor: '#7E6038' }}
                />
            </div>
        </div>
    )
}

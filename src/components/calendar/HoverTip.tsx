'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDateLong } from '@/lib/dates'

interface Person {
    name: string
    available: boolean
}

interface HoverTipProps {
    iso: string
    people: Person[]
    freeCount: number
    totalCount: number
    anchorEl: HTMLElement | null
}

export function HoverTip({ iso, people, freeCount, totalCount, anchorEl }: HoverTipProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const el = ref.current
            if (!el) return
            const vw = window.innerWidth
            const vh = window.innerHeight
            let x = e.clientX + 16
            let y = e.clientY + 16
            const w = el.offsetWidth || 220
            const h = el.offsetHeight || 120
            if (x + w > vw - 8) x = e.clientX - w - 8
            if (y + h > vh - 8) y = e.clientY - h - 8
            setPos({ x, y })
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    return (
        <div
            ref={ref}
            className="fixed z-50 bg-white border-brutal shadow-brutal-sm min-w-[200px] pointer-events-none"
            style={{ left: pos.x, top: pos.y }}
        >
            <div className="px-3 py-2 border-b border-ink/10">
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]">
                    {formatDateLong(iso)}
                </div>
                <div className="font-mono text-[11px] text-ink/55 mt-0.5">
                    {freeCount}/{totalCount} FREE
                </div>
            </div>
            <div className="py-1">
                {people.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center gap-2 px-3 py-1"
                    >
                        <span className={p.available ? 'text-ink' : 'text-ink/35'}>
                            {p.available ? '■' : '□'}
                        </span>
                        <span
                            className={`font-sans text-[12px] font-medium ${p.available ? '' : 'line-through text-ink/35'}`}
                        >
                            {p.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

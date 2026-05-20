'use client'

import { formatDateLong } from '@/lib/dates'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Person = {
    name: string
    available: boolean
}

type HoverTipProps = {
    iso: string
    people: Person[]
    freeCount: number
    totalCount: number
    anchorEl: HTMLElement | null
    initialMouseX: number
    initialMouseY: number
}

const calcPos = (mouseX: number, mouseY: number, el: HTMLElement | null) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    let x = mouseX + 16
    let y = mouseY + 16
    const w = el?.offsetWidth || 220
    const h = el?.offsetHeight || 120
    if (x + w > vw - 8) x = mouseX - w - 8
    if (y + h > vh - 8) y = mouseY - h - 8
    return { x, y }
}

export const HoverTip = ({
    iso,
    people,
    freeCount,
    totalCount,
    initialMouseX,
    initialMouseY,
}: HoverTipProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

    useLayoutEffect(() => {
        setPos(calcPos(initialMouseX, initialMouseY, ref.current))
    }, [initialMouseX, initialMouseY])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            setPos(calcPos(e.clientX, e.clientY, ref.current))
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    return (
        <div
            ref={ref}
            className="fixed z-50 bg-white border-brutal shadow-brutal-sm pointer-events-none"
            style={{
                left: pos?.x ?? 0,
                top: pos?.y ?? 0,
                visibility: pos ? 'visible' : 'hidden',
                minWidth: '12vw',
            }}
        >
            <div className="border-b border-ink/10" style={{ padding: '0.55vw 0.7vw' }}>
                <div
                    className="font-mono font-bold uppercase tracking-[0.08em]"
                    style={{ fontSize: '0.65vw' }}
                >
                    {formatDateLong(iso)}
                </div>
                <div className="font-mono text-ink/55 mt-0.5" style={{ fontSize: '0.6vw' }}>
                    {freeCount}/{totalCount} FREE
                </div>
            </div>
            <div style={{ padding: '0.3vw 0' }}>
                {people.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center"
                        style={{ gap: '0.4vw', padding: '0.2vw 0.7vw' }}
                    >
                        <span
                            className={p.available ? 'text-ink' : 'text-ink/35'}
                            style={{ fontSize: '0.72vw' }}
                        >
                            {p.available ? '■' : '□'}
                        </span>
                        <span
                            className={`font-sans font-medium ${p.available ? '' : 'line-through text-ink/35'}`}
                            style={{ fontSize: '0.72vw' }}
                        >
                            {p.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

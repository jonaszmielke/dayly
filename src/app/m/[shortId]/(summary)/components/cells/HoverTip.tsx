'use client'

import { formatDateLong } from '@/lib/dates'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Person = {
    name: string
    available: boolean
}

export type HoverPos = { x: number; y: number }

type HoverTipCardProps = {
    iso: string
    people: Person[]
    freeCount: number
    totalCount: number
    heading?: string
    /** Mouse position when the hover started; later moves are tracked internally. */
    hoverPos: HoverPos
}

type HoverTipProps = Omit<HoverTipCardProps, 'hoverPos'> & {
    /** Renders nothing when absent. */
    hoverPos?: HoverPos | null
}

/** Scales with the viewport but never below `minPx` or above `maxPx`. */
const fluid = (minPx: number, vw: number, maxPx: number): string =>
    `clamp(${minPx}px, ${vw}vw, ${maxPx}px)`

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

export const HoverTip = ({ hoverPos, ...cardProps }: HoverTipProps) => {
    if (!hoverPos) return null
    return <HoverTipCard hoverPos={hoverPos} {...cardProps} />
}

const HoverTipCard = ({
    iso,
    people,
    freeCount,
    totalCount,
    heading,
    hoverPos,
}: HoverTipCardProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState<HoverPos | null>(null)

    useLayoutEffect(() => {
        setPos(calcPos(hoverPos.x, hoverPos.y, ref.current))
    }, [hoverPos.x, hoverPos.y])

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
                minWidth: fluid(210, 12, 280),
            }}
        >
            <div
                className="border-b border-ink/10"
                style={{ padding: `${fluid(10, 0.55, 13)} ${fluid(12, 0.7, 15)}` }}
            >
                <div
                    className="font-mono font-bold uppercase tracking-[0.08em]"
                    style={{ fontSize: fluid(13, 0.65, 15) }}
                >
                    {heading ?? formatDateLong(iso)}
                </div>
                <div
                    className="font-mono text-ink/55 mt-0.5"
                    style={{ fontSize: fluid(12, 0.6, 14) }}
                >
                    {freeCount}/{totalCount} FREE
                </div>
            </div>
            <div style={{ padding: `${fluid(5, 0.3, 7)} 0` }}>
                {people.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center"
                        style={{
                            gap: fluid(7, 0.4, 9),
                            padding: `${fluid(4, 0.2, 6)} ${fluid(12, 0.7, 15)}`,
                        }}
                    >
                        <span
                            className={p.available ? 'text-ink' : 'text-ink/35'}
                            style={{ fontSize: fluid(14, 0.72, 16) }}
                        >
                            {p.available ? '■' : '□'}
                        </span>
                        <span
                            className={`font-sans font-medium ${p.available ? '' : 'line-through text-ink/35'}`}
                            style={{ fontSize: fluid(14, 0.72, 16) }}
                        >
                            {p.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

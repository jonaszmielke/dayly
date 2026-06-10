'use client'

import { useEffect, useState } from 'react'

export const useIsTouchDevice = () => {
    const [isTouch, setIsTouch] = useState<boolean>(false)

    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)')
        const update = () => setIsTouch(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    return isTouch
}

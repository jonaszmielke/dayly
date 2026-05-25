'use client'

import { useEffect, useState } from 'react'

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)')
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    return isMobile
}

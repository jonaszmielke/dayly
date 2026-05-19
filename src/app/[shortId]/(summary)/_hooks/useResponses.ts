'use client'

import { Response } from '@prisma/client'
import { useMemo } from 'react'

export const useResponses = () => {
    // mock responses here
    const responses = useMemo<Response[]>(() => [], [])

    return { responses }
}

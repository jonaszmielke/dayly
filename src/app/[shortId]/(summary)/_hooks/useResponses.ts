'use client'

import { Response } from '@prisma/client'
import { useMemo } from 'react'
import { MOCK_RESPONSES } from '@/lib/mock'

export const useResponses = () => {
    // TODO: replace with useQuery when API is ready
    const responses = useMemo<Response[]>(() => MOCK_RESPONSES as Response[], [])
    return { responses }
}

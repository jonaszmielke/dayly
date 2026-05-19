'use client'

import { useResponses } from './_hooks/useResponses'

const SummaryPage = () => {
    const { responses } = useResponses()

    return <div>{responses.length} responses</div>
}

export default SummaryPage

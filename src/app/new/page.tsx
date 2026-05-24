import CreatePageClient from './_components/CreatePageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'New meeting · Dayly',
}

const CreatePage = () => {
    return <CreatePageClient />
}

export default CreatePage

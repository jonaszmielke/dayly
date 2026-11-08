import CreatePageClient from './components/CreatePageClient'
import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'New meeting · Dayly',
}

const CreatePage = () => {
    return <CreatePageClient />
}

export default CreatePage

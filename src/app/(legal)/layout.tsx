import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/ui/SmallHeader'

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div>
                <SmallHeader />
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default LegalLayout

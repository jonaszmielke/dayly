import { LegalSection } from '../_components/LegalSection'
import { LegalTitle } from '../_components/LegalTitle'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Use · Dayly',
}

const TermsPage = () => (
    <main className="max-w-[720px] mx-auto px-4 lg:px-10 py-10 lg:py-16">
        <LegalTitle title="Terms of Use" updatedAt="May 2026" />

        <div className="flex flex-col gap-6">
            <LegalSection title="Use of the service">
                <p>
                    Dayly is a free scheduling tool. Use it to coordinate availability with others.
                </p>
                <p>No account is required. By using Dayly you agree to these terms.</p>
            </LegalSection>

            <LegalSection title="Acceptable use">
                <p>
                    Do not use Dayly to collect others&apos; personal data without their knowledge.
                </p>
                <p>Do not abuse the service through automated spam or mass meeting creation.</p>
            </LegalSection>

            <LegalSection title="No guarantees">
                <p>
                    Dayly is provided as-is. We make no guarantees about uptime, data durability, or
                    fitness for any particular purpose.
                </p>
            </LegalSection>

            <LegalSection title="Data">
                <p>
                    See our{' '}
                    <a href="/privacy" className="text-mocha underline underline-offset-2">
                        Privacy Policy
                    </a>{' '}
                    for details on what we collect and how to request deletion.
                </p>
            </LegalSection>

            <LegalSection title="Changes">
                <p>
                    We may update these terms at any time. Continued use of Dayly after changes
                    constitutes acceptance.
                </p>
            </LegalSection>
        </div>
    </main>
)

export default TermsPage

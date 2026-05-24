import { LegalSection } from '../_components/LegalSection'
import { LegalTitle } from '../_components/LegalTitle'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy · Dayly',
}

const PrivacyPage = () => (
    <main className="max-w-[720px] mx-auto px-4 lg:px-10 py-10 lg:py-16">
        <LegalTitle title="Privacy Policy" updatedAt="May 2026" />

        <div className="flex flex-col gap-6">
            <LegalSection title="What we collect">
                <p>When you create a meeting, we store: meeting name, date range, and deadline.</p>
                <p>
                    When you respond to a meeting, we store: the name you enter and the dates you
                    select.
                </p>
                <p>We do not collect email addresses, passwords, or any account information.</p>
            </LegalSection>

            <LegalSection title="Why we collect it">
                <p>
                    Solely to operate the scheduling feature — show availability overlap to meeting
                    participants.
                </p>
            </LegalSection>

            <LegalSection title="Analytics">
                <p>
                    We use self-hosted, privacy-first analytics to count page views and understand
                    general usage. No cookies are set. No personal data is sent to third parties. IP
                    addresses are never stored.
                </p>
            </LegalSection>

            <LegalSection title="Data retention">
                <p>
                    Meetings and all responses are automatically deleted one month after the meeting
                    date range ends.
                </p>
            </LegalSection>

            <LegalSection title="Your rights">
                <p>
                    You can request deletion of any data tied to your name at any time. Email us at{' '}
                    <a
                        href="mailto:jonasz.mielke@gmail.com"
                        className="text-mocha underline underline-offset-2"
                    >
                        jonasz.mielke@gmail.com
                    </a>{' '}
                    and we will remove it promptly.
                </p>
            </LegalSection>

            <LegalSection title="Third parties">
                <p>We do not sell, share, or transfer your data to any third party.</p>
            </LegalSection>
        </div>
    </main>
)

export default PrivacyPage

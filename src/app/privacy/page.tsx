import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/ui/SmallHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy · Dayly',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b-2 border-ink/20 pb-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-mocha mb-3">{title}</h2>
        <div className="font-sans text-[15px] text-ink/80 leading-relaxed space-y-2">{children}</div>
    </div>
)

const PrivacyPage = () => (
    <div className="min-h-screen flex flex-col justify-between">
        <div>
            <SmallHeader />
            <main className="max-w-[720px] mx-auto px-4 lg:px-10 py-10 lg:py-16">
                <div className="mb-10">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">Legal</span>
                    <h1 className="font-sans font-extrabold text-[36px] lg:text-[48px] leading-[0.9] tracking-[-0.03em] mt-2">
                        Privacy Policy
                    </h1>
                    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40 mt-3">
                        Last updated: May 2025
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <Section title="What we collect">
                        <p>When you create a meeting, we store: meeting name, date range, and deadline.</p>
                        <p>When you respond to a meeting, we store: the name you enter and the dates you select.</p>
                        <p>We do not collect email addresses, passwords, or any account information.</p>
                    </Section>

                    <Section title="Why we collect it">
                        <p>Solely to operate the scheduling feature — show availability overlap to meeting participants.</p>
                    </Section>

                    <Section title="Analytics">
                        <p>
                            We use self-hosted, privacy-first analytics to count page views and understand general usage.
                            No cookies are set. No personal data is sent to third parties. IP addresses are never stored.
                        </p>
                    </Section>

                    <Section title="Data retention">
                        <p>Meeting data is automatically deleted a short period after the meeting deadline passes.</p>
                    </Section>

                    <Section title="Your rights">
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
                    </Section>

                    <Section title="Third parties">
                        <p>We do not sell, share, or transfer your data to any third party.</p>
                    </Section>
                </div>
            </main>
        </div>
        <Footer />
    </div>
)

export default PrivacyPage

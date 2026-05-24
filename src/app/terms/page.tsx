import { Footer } from '@/components/Footer'
import { SmallHeader } from '@/components/ui/SmallHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Use · Dayly',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b-2 border-ink/20 pb-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-mocha mb-3">{title}</h2>
        <div className="font-sans text-[15px] text-ink/80 leading-relaxed space-y-2">{children}</div>
    </div>
)

const TermsPage = () => (
    <div className="min-h-screen flex flex-col justify-between">
        <div>
            <SmallHeader />
            <main className="max-w-[720px] mx-auto px-4 lg:px-10 py-10 lg:py-16">
                <div className="mb-10">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">Legal</span>
                    <h1 className="font-sans font-extrabold text-[36px] lg:text-[48px] leading-[0.9] tracking-[-0.03em] mt-2">
                        Terms of Use
                    </h1>
                    <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40 mt-3">
                        Last updated: May 2025
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <Section title="Use of the service">
                        <p>Dayly is a free scheduling tool. Use it to coordinate availability with others.</p>
                        <p>No account is required. By using Dayly you agree to these terms.</p>
                    </Section>

                    <Section title="Acceptable use">
                        <p>Do not use Dayly to collect others&apos; personal data without their knowledge.</p>
                        <p>Do not abuse the service through automated spam or mass meeting creation.</p>
                    </Section>

                    <Section title="No guarantees">
                        <p>
                            Dayly is provided as-is. We make no guarantees about uptime, data durability, or fitness
                            for any particular purpose.
                        </p>
                    </Section>

                    <Section title="Data">
                        <p>
                            See our{' '}
                            <a href="/privacy" className="text-mocha underline underline-offset-2">
                                Privacy Policy
                            </a>{' '}
                            for details on what we collect and how to request deletion.
                        </p>
                    </Section>

                    <Section title="Changes">
                        <p>
                            We may update these terms at any time. Continued use of Dayly after changes constitutes
                            acceptance.
                        </p>
                    </Section>
                </div>
            </main>
        </div>
        <Footer />
    </div>
)

export default TermsPage

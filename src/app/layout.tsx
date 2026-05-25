import type { Metadata } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/QueryProvider'
import { appUrl } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin'],
    weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
    title: 'Dayly',
    description: 'Find the days that work for everyone',
    metadataBase: new URL(appUrl()),
    openGraph: {
        title: 'Dayly',
        description: 'Find the days that work for everyone',
        images: ['/og.png'],
    },
}

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <html
            lang="en"
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <QueryProvider>
                <body className="min-h-full flex flex-col">{children}</body>
            </QueryProvider>
        </html>
    )
}

export default RootLayout

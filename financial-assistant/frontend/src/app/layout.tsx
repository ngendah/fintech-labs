'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Lato } from 'next/font/google'
import './globals.css'
import { WebSocketProvider } from '@/components/web-socket'

const lato = Lato({ subsets: ['latin'], weight: '400' })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`text-base ${lato} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <WebSocketProvider>{children}</WebSocketProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

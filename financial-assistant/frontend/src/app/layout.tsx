'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { WebSocketProvider } from '@/components/web-socket'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
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

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { UserProvider } from '@/context/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'PolicyGuard: Financial AI Governance',
    description: 'Enterprise Governance for Autonomous Financial Decision Agents.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </AuthProvider>
            </body>
        </html>
    )
}

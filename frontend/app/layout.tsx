import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { UserProvider } from '@/context/UserContext'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'PolicyGuard AI',
    description: 'Enterprise AI Policy Governance & Guardrails',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <AuthProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </AuthProvider>
            </body>
        </html>
    )
}

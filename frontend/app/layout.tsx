import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { UserProvider } from '@/context/UserContext'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast-context'

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
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased" suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <UserProvider>
                            <ToastProvider>
                                {children}
                            </ToastProvider>
                        </UserProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

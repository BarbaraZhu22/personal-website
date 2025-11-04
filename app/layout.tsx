'use client'

import { useEffect } from 'react'
import '../styles/globals.css'
import { useThemeStore } from '@/store'
import { applyTheme } from '@/lib/theme'
import { Header } from '@/layouts'
import Footer from '@/layouts/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { mode, colorScheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount and when theme changes
    applyTheme(mode, colorScheme)
  }, [mode, colorScheme])

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

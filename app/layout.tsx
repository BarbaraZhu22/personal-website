'use client'

import { useEffect } from 'react'
import '../styles/globals.css'
import { useThemeStore } from '@/store'
import { applyTheme } from '@/lib/theme'

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
      <body>{children}</body>
    </html>
  )
}

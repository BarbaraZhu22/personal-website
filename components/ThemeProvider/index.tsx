'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store'
import { applyTheme } from '@/lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, colorScheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount and when theme changes
    applyTheme(mode, colorScheme)
  }, [mode, colorScheme])

  return <>{children}</>
}


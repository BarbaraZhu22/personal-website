'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store'
import { applyTheme, watchSystemTheme } from '@/lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, colorScheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount and when theme changes
    applyTheme(mode, colorScheme)

    // Watch for system theme changes if mode is set to 'system'
    if (mode === 'system') {
      const cleanup = watchSystemTheme(() => {
        applyTheme('system', colorScheme)
      })
      return cleanup
    }
  }, [mode, colorScheme])

  return <>{children}</>
}

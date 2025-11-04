'use client'

import { useThemeStore } from '@/store/themeStore'
import { themeColors } from '@/lib/theme'

/**
 * Central hook for components to reactively subscribe to theme changes
 * Returns current theme state and reactive color values
 * 
 * This is the primary API for accessing theme state - prefer this over useThemeStore
 */
export function useTheme() {
  const { mode, colorScheme, theme, setMode, setColorScheme, setTheme } = useThemeStore()
  
  // Get current theme colors reactively
  const colors = themeColors[colorScheme][mode]
  
  return {
    mode,
    colorScheme,
    theme,
    colors,
    setMode,
    setColorScheme,
    setTheme,
    // Helper to check if dark mode
    isDark: mode === 'dark',
    // Helper to check if light mode
    isLight: mode === 'light',
  }
}

/**
 * Hook that returns only the theme colors reactively
 * Useful when you only need colors and not theme controls
 * 
 * This is optimized to only subscribe to colorScheme changes
 */
export function useThemeColors() {
  // Only subscribe to colorScheme and mode changes for better performance
  const colorScheme = useThemeStore((state) => state.colorScheme)
  const mode = useThemeStore((state) => state.mode)
  return themeColors[colorScheme][mode]
}


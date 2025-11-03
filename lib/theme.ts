import { ThemeMode, ColorScheme, themeColors } from './themes'

export const applyTheme = (mode: ThemeMode, colorScheme: ColorScheme) => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  // Apply dark/light mode
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', mode === 'dark')
  }
  
  // Remove all color scheme classes
  root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-pink', 'theme-indigo')
  
  // Add current color scheme
  root.classList.add(`theme-${colorScheme}`)
  
  // Apply CSS variables for color scheme
  const effectiveMode = mode === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode
  
  const colors = themeColors[colorScheme][effectiveMode]
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
}

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void) => {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches ? 'dark' : 'light')
  }
  
  mediaQuery.addEventListener('change', handleChange)
  handleChange(mediaQuery)
  
  return () => mediaQuery.removeEventListener('change', handleChange)
}

// Legacy function for backward compatibility
export const applyLegacyTheme = (theme: 'light' | 'dark' | 'system') => {
  applyTheme(theme, 'blue')
}

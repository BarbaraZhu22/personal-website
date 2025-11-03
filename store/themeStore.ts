import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeMode, ColorScheme, ThemeConfig, CombinedTheme, parseCombinedTheme, combineTheme } from '@/lib/themes'

export type Theme = ThemeMode

interface ThemeState {
  mode: ThemeMode
  colorScheme: ColorScheme
  theme: CombinedTheme // Combined theme string
  setMode: (mode: ThemeMode) => void
  setColorScheme: (colorScheme: ColorScheme) => void
  setTheme: (theme: CombinedTheme | ThemeConfig) => void
  getEffectiveMode: () => 'light' | 'dark'
  getTheme: () => ThemeConfig
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      colorScheme: 'blue',
      theme: 'system-blue',
      setMode: (mode) => {
        const { colorScheme } = get()
        set({ mode, theme: combineTheme(mode, colorScheme) })
      },
      setColorScheme: (colorScheme) => {
        const { mode } = get()
        set({ colorScheme, theme: combineTheme(mode, colorScheme) })
      },
      setTheme: (themeOrConfig) => {
        let config: ThemeConfig
        if (typeof themeOrConfig === 'string') {
          config = parseCombinedTheme(themeOrConfig)
        } else {
          config = themeOrConfig
        }
        set({
          mode: config.mode,
          colorScheme: config.colorScheme,
          theme: combineTheme(config.mode, config.colorScheme),
        })
      },
      getEffectiveMode: () => {
        const { mode } = get()
        if (mode === 'system') {
          if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
          }
          return 'light' // Default for SSR
        }
        return mode
      },
      getTheme: () => {
        const { mode, colorScheme } = get()
        return { mode, colorScheme }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeMode, ColorScheme, ThemeConfig, CombinedTheme, parseCombinedTheme, combineTheme } from '@/lib/theme'

export type Theme = ThemeMode

interface ThemeState {
  mode: ThemeMode
  colorScheme: ColorScheme
  theme: CombinedTheme // Combined theme string
  setMode: (mode: ThemeMode) => void
  setColorScheme: (colorScheme: ColorScheme) => void
  setTheme: (theme: CombinedTheme | ThemeConfig) => void
  getTheme: () => ThemeConfig
}

/**
 * Internal theme store - use useTheme() hook instead for components
 * @internal
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set: (partial: Partial<ThemeState>) => void, get: () => ThemeState) => ({
      mode: 'light',
      colorScheme: 'blue',
      theme: 'light-blue',
      setMode: (mode:ThemeMode) => {
        const { colorScheme } = get()
        set({ mode, theme: combineTheme(mode, colorScheme) })
      },
      setColorScheme: (colorScheme:ColorScheme) => {
        const { mode } = get()
        set({ colorScheme, theme: combineTheme(mode, colorScheme) })
      },
      setTheme: (themeOrConfig:CombinedTheme | ThemeConfig) => {
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

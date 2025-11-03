export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  colorScheme: ColorScheme
}

// Combined theme presets
export type CombinedTheme = 
  | 'light-blue' | 'light-green' | 'light-purple' | 'light-orange' | 'light-pink' | 'light-indigo'
  | 'dark-blue' | 'dark-green' | 'dark-purple' | 'dark-orange' | 'dark-pink' | 'dark-indigo'
  | 'system-blue' | 'system-green' | 'system-purple' | 'system-orange' | 'system-pink' | 'system-indigo'

export const colorSchemes: Record<ColorScheme, { name: string; light: string; dark: string }> = {
  blue: {
    name: 'Blue',
    light: '#0070f3',
    dark: '#0070f3',
  },
  green: {
    name: 'Green',
    light: '#00c853',
    dark: '#00e676',
  },
  purple: {
    name: 'Purple',
    light: '#7928ca',
    dark: '#a855f7',
  },
  orange: {
    name: 'Orange',
    light: '#ff6b35',
    dark: '#ff8c42',
  },
  pink: {
    name: 'Pink',
    light: '#f81ce5',
    dark: '#ff17e1',
  },
  indigo: {
    name: 'Indigo',
    light: '#6366f1',
    dark: '#818cf8',
  },
}

// Color palette for each scheme
export const themeColors: Record<ColorScheme, {
  light: {
    primary: string
    secondary: string
    accent: string
  }
  dark: {
    primary: string
    secondary: string
    accent: string
  }
}> = {
  blue: {
    light: {
      primary: '#0070f3',
      secondary: '#0051cc',
      accent: '#0066e6',
    },
    dark: {
      primary: '#0070f3',
      secondary: '#3291ff',
      accent: '#0051cc',
    },
  },
  green: {
    light: {
      primary: '#00c853',
      secondary: '#00a843',
      accent: '#00d963',
    },
    dark: {
      primary: '#00e676',
      secondary: '#4caf50',
      accent: '#00c853',
    },
  },
  purple: {
    light: {
      primary: '#7928ca',
      secondary: '#5e1fa5',
      accent: '#9333ea',
    },
    dark: {
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#9333ea',
    },
  },
  orange: {
    light: {
      primary: '#ff6b35',
      secondary: '#e55a2b',
      accent: '#ff7f4d',
    },
    dark: {
      primary: '#ff8c42',
      secondary: '#ffa366',
      accent: '#ff6b35',
    },
  },
  pink: {
    light: {
      primary: '#f81ce5',
      secondary: '#d414c1',
      accent: '#ff2ff2',
    },
    dark: {
      primary: '#ff17e1',
      secondary: '#ff4dec',
      accent: '#f81ce5',
    },
  },
  indigo: {
    light: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
    },
    dark: {
      primary: '#818cf8',
      secondary: '#a5b4fc',
      accent: '#6366f1',
    },
  },
}

// Helper functions to parse and combine themes
export function parseCombinedTheme(theme: CombinedTheme): ThemeConfig {
  const [mode, colorScheme] = theme.split('-') as [ThemeMode, ColorScheme]
  return { mode, colorScheme }
}

export function combineTheme(mode: ThemeMode, colorScheme: ColorScheme): CombinedTheme {
  return `${mode}-${colorScheme}` as CombinedTheme
}

// All available theme combinations
export const allThemes: CombinedTheme[] = [
  'light-blue', 'light-green', 'light-purple', 'light-orange', 'light-pink', 'light-indigo',
  'dark-blue', 'dark-green', 'dark-purple', 'dark-orange', 'dark-pink', 'dark-indigo',
  'system-blue', 'system-green', 'system-purple', 'system-orange', 'system-pink', 'system-indigo',
]
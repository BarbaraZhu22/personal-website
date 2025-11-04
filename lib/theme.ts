// ============================================================================
// THEME TYPES & CONFIGURATION
// ============================================================================

export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  mode: ThemeMode
  colorScheme: ColorScheme
}

// Combined theme presets
export type CombinedTheme = 
  | 'light-blue' | 'light-green' | 'light-purple' | 'light-orange' | 'light-pink' | 'light-indigo'
  | 'dark-blue' | 'dark-green' | 'dark-purple' | 'dark-orange' | 'dark-pink' | 'dark-indigo'

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

// Gradient definitions for each color scheme
export const themeGradients: Record<ColorScheme, {
  light: {
    gradientStart: string
    gradientEnd: string
    gradientMid?: string
  }
  dark: {
    gradientStart: string
    gradientEnd: string
    gradientMid?: string
  }
}> = {
  blue: {
    light: {
      gradientStart: '#e6f2ff',
      gradientEnd: '#ffffff',
      gradientMid: '#cce6ff',
    },
    dark: {
      gradientStart: '#001122',
      gradientEnd: '#000000',
      gradientMid: '#002244',
    },
  },
  green: {
    light: {
      gradientStart: '#e8f5e9',
      gradientEnd: '#ffffff',
      gradientMid: '#c8e6c9',
    },
    dark: {
      gradientStart: '#0a1a0a',
      gradientEnd: '#000000',
      gradientMid: '#1a3a1a',
    },
  },
  purple: {
    light: {
      gradientStart: '#f3e8ff',
      gradientEnd: '#ffffff',
      gradientMid: '#e9d5ff',
    },
    dark: {
      gradientStart: '#1a0a2e',
      gradientEnd: '#000000',
      gradientMid: '#2d1b4e',
    },
  },
  orange: {
    light: {
      gradientStart: '#fff3e0',
      gradientEnd: '#ffffff',
      gradientMid: '#ffe0b2',
    },
    dark: {
      gradientStart: '#2e1400',
      gradientEnd: '#000000',
      gradientMid: '#4a2100',
    },
  },
  pink: {
    light: {
      gradientStart: '#fce4ec',
      gradientEnd: '#ffffff',
      gradientMid: '#f8bbd0',
    },
    dark: {
      gradientStart: '#2a0a1e',
      gradientEnd: '#000000',
      gradientMid: '#4a1a3e',
    },
  },
  indigo: {
    light: {
      gradientStart: '#eef2ff',
      gradientEnd: '#ffffff',
      gradientMid: '#e0e7ff',
    },
    dark: {
      gradientStart: '#0f0a1f',
      gradientEnd: '#000000',
      gradientMid: '#1f1a3f',
    },
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
]

// ============================================================================
// THEME DOM UTILITIES (Browser-side functions)
// ============================================================================

/**
 * Applies the theme to the DOM by setting CSS variables and classes
 * @param mode - Theme mode (light/dark)
 * @param colorScheme - Color scheme to apply
 */
export const applyTheme = (mode: ThemeMode, colorScheme: ColorScheme) => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  // Apply dark/light mode
  root.classList.toggle('dark', mode === 'dark')
  
  // Remove all color scheme classes
  root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-pink', 'theme-indigo')
  
  // Add current color scheme
  root.classList.add(`theme-${colorScheme}`)
  
  // Apply CSS variables for color scheme
  const colors = themeColors[colorScheme][mode]
  const gradients = themeGradients[colorScheme][mode]
  
  // Set all theme color CSS variables for reactive updates
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  
  // Set gradient CSS variables
  root.style.setProperty('--gradient-start', gradients.gradientStart)
  root.style.setProperty('--gradient-end', gradients.gradientEnd)
  if (gradients.gradientMid) {
    root.style.setProperty('--gradient-mid', gradients.gradientMid)
  }
  
  // Create gradient string for background
  const gradientString = gradients.gradientMid
    ? `linear-gradient(135deg, ${gradients.gradientStart} 0%, ${gradients.gradientMid} 50%, ${gradients.gradientEnd} 100%)`
    : `linear-gradient(135deg, ${gradients.gradientStart} 0%, ${gradients.gradientEnd} 100%)`
  root.style.setProperty('--gradient-background', gradientString)
  
  // Also set data attributes for easier CSS targeting if needed
  root.setAttribute('data-theme-mode', mode)
  root.setAttribute('data-color-scheme', colorScheme)
}

// Legacy function for backward compatibility
export const applyLegacyTheme = (theme: 'light' | 'dark') => {
  applyTheme(theme, 'blue')
}

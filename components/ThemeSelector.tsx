'use client'

import { useThemeStore } from '@/store'
import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'
import { colorSchemes, CombinedTheme, allThemes, parseCombinedTheme } from '@/lib/themes'

export default function ThemeSelector() {
  const { theme, setTheme } = useThemeStore()
  const { language } = useLanguageStore()

  const handleThemeChange = (newTheme: CombinedTheme) => {
    setTheme(newTheme)
  }

  // Group themes by mode
  const themesByMode = {
    light: allThemes.filter(t => t.startsWith('light-')),
    dark: allThemes.filter(t => t.startsWith('dark-')),
    system: allThemes.filter(t => t.startsWith('system-')),
  }

  const modeLabels = {
    light: t('light', language),
    dark: t('dark', language),
    system: t('system', language),
  }

  return (
    <div className="flex flex-col gap-3 min-w-[280px]">
      <label className="text-sm font-medium">
        {t('theme', language)}:
      </label>
      
      {/* Grouped by Mode */}
      <div className="flex flex-col gap-3">
        {(Object.entries(themesByMode) as [keyof typeof themesByMode, CombinedTheme[]][]).map(([mode, themes]) => (
          <div key={mode} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              {modeLabels[mode]}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {themes.map((themeOption) => {
                const config = parseCombinedTheme(themeOption)
                const scheme = colorSchemes[config.colorScheme]
                const isActive = theme === themeOption
                
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`
                      flex-1 min-w-[70px] px-2.5 py-1.5 rounded-md border-2 transition-all text-xs font-medium
                      ${isActive 
                        ? 'border-primary bg-primary text-white scale-105 shadow-md ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50 hover:bg-muted hover:scale-[1.02]'
                      }
                    `}
                    style={isActive ? {} : {
                      color: scheme.light,
                      borderColor: scheme.light + '40',
                      backgroundColor: mode === 'dark' ? scheme.dark + '15' : scheme.light + '10',
                    }}
                    title={`${scheme.name} - ${modeLabels[mode]}`}
                  >
                    {scheme.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

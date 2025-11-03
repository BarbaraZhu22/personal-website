'use client'

import { useThemeStore } from '@/store'
import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'
import { colorSchemes, CombinedTheme, allThemes, parseCombinedTheme } from '@/lib/themes'
import styles from './ThemeSelector.module.css'

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
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {t('theme', language)}:
      </label>
      
      {/* Grouped by Mode */}
      <div className={styles.groupContainer}>
        {(Object.entries(themesByMode) as [keyof typeof themesByMode, CombinedTheme[]][]).map(([mode, themes]) => (
          <div key={mode} className={styles.modeGroup}>
            <span className={styles.modeLabel}>
              {modeLabels[mode]}
            </span>
            <div className={styles.buttons}>
              {themes.map((themeOption) => {
                const config = parseCombinedTheme(themeOption)
                const scheme = colorSchemes[config.colorScheme]
                const isActive = theme === themeOption
                
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`${styles.themeButton} ${isActive ? styles.themeButtonActive : styles.themeButtonInactive}`}
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

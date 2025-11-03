'use client'

import { useThemeStore } from '@/store'
import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'
import { colorSchemes, ColorScheme, ThemeMode } from '@/lib/themes'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { mode, colorScheme, setMode, setColorScheme } = useThemeStore()
  const { language } = useLanguageStore()

  const modes: ThemeMode[] = ['light', 'dark', 'system']
  const modeLabels = {
    light: t('light', language),
    dark: t('dark', language),
    system: t('system', language),
  }

  return (
    <div className={styles.container}>
      {/* Theme Mode Section */}
      <div className={styles.section}>
        <label className={styles.label}>{t('theme', language)}:</label>
        <div className={styles.buttonGroup}>
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`${styles.modeButton} ${mode === m ? styles.active : ''}`}
              title={modeLabels[m]}
              aria-label={`Set theme to ${modeLabels[m]}`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme Section */}
      <div className={styles.section}>
        <label className={styles.label}>{t('color', language)}:</label>
        <div className={styles.colorPicker}>
          {Object.entries(colorSchemes).map(([key, scheme]) => {
            const isActive = key === colorScheme
            return (
              <button
                key={key}
                onClick={() => setColorScheme(key as ColorScheme)}
                className={`${styles.colorButton} ${isActive ? styles.colorActive : ''}`}
                style={{
                  backgroundColor: scheme.light,
                }}
                title={scheme.name}
                aria-label={`Select ${scheme.name} color theme`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

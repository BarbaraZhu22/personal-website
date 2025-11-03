'use client'

import { useThemeStore } from '@/store'
import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'
import { colorSchemes, ColorScheme } from '@/lib/themes'

export default function ThemeToggle() {
  const { mode, colorScheme, setMode, setColorScheme } = useThemeStore()
  const { language } = useLanguageStore()

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">{t('mode', language)}:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}
          className="input w-auto text-sm"
        >
          <option value="light">{t('light', language)}</option>
          <option value="dark">{t('dark', language)}</option>
          <option value="system">{t('system', language)}</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">{t('color', language)}:</label>
        <select
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
          className="input w-auto text-sm"
        >
          {Object.entries(colorSchemes).map(([key, scheme]) => (
            <option key={key} value={key}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

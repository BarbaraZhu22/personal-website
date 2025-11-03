'use client'

import { useLanguageStore, Language } from '@/store'
import { t } from '@/lib/i18n'

const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
}

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">{t('language', language)}:</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="input w-auto"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

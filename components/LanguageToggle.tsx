'use client'

import { useLanguageStore, Language } from '@/store'
import { t } from '@/lib/i18n'
import styles from './LanguageToggle.module.css'

const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
}

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{t('language', language)}:</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={`input ${styles.select}`}
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

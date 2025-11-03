import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'

export const useTranslation = () => {
  const { language } = useLanguageStore()
  
  return {
    t: (key: string) => t(key, language),
    language,
  }
}

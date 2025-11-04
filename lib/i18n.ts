import { Language } from '@/store'

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  welcome: {
    en: 'Welcome',
    zh: '欢迎',
    es: 'Bienvenido',
    fr: 'Bienvenue',
  },
  theme: {
    en: 'Theme',
    zh: '主题',
    es: 'Tema',
    fr: 'Thème',
  },
  language: {
    en: 'Language',
    zh: '语言',
    es: 'Idioma',
    fr: 'Langue',
  },
  light: {
    en: 'Light',
    zh: '浅色',
    es: 'Claro',
    fr: 'Clair',
  },
  dark: {
    en: 'Dark',
    zh: '深色',
    es: 'Oscuro',
    fr: 'Sombre',
  },
  color: {
    en: 'Color',
    zh: '颜色',
    es: 'Color',
    fr: 'Couleur',
  },
}

export const t = (key: string, language: Language): string => {
  return translations[key]?.[language] || key
}

// Server-side translation function
export const getTranslations = (language: string) => {
  return (key: string): string => {
    return translations[key]?.[language as Language] || key
  }
}

export { translations }

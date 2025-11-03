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
  system: {
    en: 'System',
    zh: '系统',
    es: 'Sistema',
    fr: 'Système',
  },
  mode: {
    en: 'Mode',
    zh: '模式',
    es: 'Modo',
    fr: 'Mode',
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

export { translations }

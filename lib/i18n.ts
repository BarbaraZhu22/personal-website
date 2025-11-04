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
  home: {
    en: 'Home',
    zh: '首页',
    es: 'Inicio',
    fr: 'Accueil',
  },
  about: {
    en: 'About',
    zh: '关于',
    es: 'Acerca',
    fr: 'À propos',
  },
  work: {
    en: 'Work',
    zh: '作品',
    es: 'Trabajo',
    fr: 'Travail',
  },
  contact: {
    en: 'Contact',
    zh: '联系',
    es: 'Contacto',
    fr: 'Contact',
  },
  yourName: {
    en: 'Frontend Developer',
    zh: '前端开发者',
    es: 'Desarrollador Frontend',
    fr: 'Développeur Frontend',
  },
  rightsReserved: {
    en: 'All rights reserved.',
    zh: '保留所有权利。',
    es: 'Todos los derechos reservados.',
    fr: 'Tous droits réservés.',
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

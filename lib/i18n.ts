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
    es: 'Bienvenida',
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
    es: 'Desarrolladora Frontend',
    fr: 'Développeuse Frontend',
  },
  rightsReserved: {
    en: 'All rights reserved.',
    zh: '保留所有权利。',
    es: 'Todos los derechos reservados.',
    fr: 'Tous droits réservés.',
  },
  welcomeGreeting: {
    en: 'Hi! Welcome to my website',
    zh: '嗨！欢迎来到我的网站',
    es: '¡Hola! Bienvenida a mi sitio web',
    fr: 'Salut! Bienvenue sur mon site web',
  },
  profileFrontend: {
    en: 'Frontend Development',
    zh: '前端开发',
    es: 'Desarrollo Frontend',
    fr: 'Développement Frontend',
  },
  profileExperience: {
    en: '5 Years Experience',
    zh: '工作经验5年',
    es: '5 Años de Experiencia',
    fr: '5 Ans d\'Expérience',
  },
  profile3D: {
    en: '3D Development',
    zh: '3D开发',
    es: 'Desarrollo 3D',
    fr: 'Développement 3D',
  },
  profileTypeScript: {
    en: 'TypeScript',
    zh: 'TypeScript',
    es: 'TypeScript',
    fr: 'TypeScript',
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

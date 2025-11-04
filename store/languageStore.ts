import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'zh' | 'es' | 'fr'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set: (partial: Partial<LanguageState>) => void) => ({
      language: 'zh',
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
)

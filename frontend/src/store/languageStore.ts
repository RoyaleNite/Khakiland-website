import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'af' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'af', // Afrikaans as default
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);

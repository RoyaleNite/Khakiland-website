import { useLanguageStore } from '../store/languageStore';
import { af } from '../translations/af';
import { en } from '../translations/en';

const translations = {
  af,
  en,
};

export function useTranslation() {
  const { language } = useLanguageStore();

  return {
    t: translations[language],
    language,
  };
}

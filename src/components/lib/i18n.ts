import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonDE from '../locales/de/common.json';
import commonEN from '../locales/en/common.json';

// Define resources
const resources = {
  de: {
    common: commonDE,
  },
  en: {
    common: commonEN,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'de',
    defaultNS: 'common',
    ns: ['common'],
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      // Order of detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language
      caches: ['localStorage'],
      // LocalStorage key
      lookupLocalStorage: 'xrisk-language',
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en_translation from "./languages/en/translation.json";
import de_translation from "./languages/de/translation.json";


const resources = {
  en: {
    translation: en_translation
    },
  de: {
    translation: de_translation
  }
}
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'de',
    lng: 'de',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: resources
  });

export default i18n;
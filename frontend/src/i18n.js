import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import ar from "./locales/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    ar: { translation: ar },
  },
  lng: "ar", // varsayılan dil
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

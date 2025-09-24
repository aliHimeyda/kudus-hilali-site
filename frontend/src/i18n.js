import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import tr from "./locales/tr.json";
import ar from "./locales/ar.json";

const isLocalhost = /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ÖNEMLİ: translation namespace ile sar
    resources: {
      en: { translation: en },
      tr: { translation: tr },
      ar: { translation: ar },
    },
    fallbackLng: "tr",
    supportedLngs: ["en", "tr", "ar"],
    // JSON içinde array/object döndürmek için ekstra ayar gerekmiyor;
    // t(key, { returnObjects: true }) ile alabilirsin.
    detection: {
      order: ["querystring", "cookie", "localStorage", "htmlTag", "navigator"],
      caches: ["localStorage", "cookie"],
      lookupCookie: "i18nextLng",
      lookupLocalStorage: "i18nextLng",
      // localhost'ta domain set etme
      cookieDomain: isLocalhost ? undefined : "." + window.location.hostname,
    },
    interpolation: { escapeValue: false },
    // react: { useSuspense: false }, // SSR veya eski setuplarda gerekebilir
    debug: false,
  });

export default i18n;

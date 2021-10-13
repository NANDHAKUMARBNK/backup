import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// import languageEN from "./en/translate.json";
// import languageMX from "./mx/translate.json";
var mexico = JSON.parse(localStorage.getItem("Mexico"));
var english = JSON.parse(localStorage.getItem("English"));
var defaultLang = localStorage.getItem("i18nextLng");
var lang = localStorage.getItem("langCode");
var submit = localStorage.getItem("submit");
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources: {
    //    en: languageEN,
    //    mx: languageMX,
    // },
    resources: {
      en: english,
      es: mexico,
    },
    /* default language when load the website in browser */
    lng: defaultLang ? defaultLang : lang ? lang : submit ? submit : "en",
    /* When react i18next not finding any language to as default in borwser */
    fallbackLng: "en",
    /* debugger For Development environment */
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    // keySeparator: ".",
    nsSeparator: ":::",
    keySeparator: "::",
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
      bindI18n: "languageChanged loaded",
      bindStore: "added removed",
      nsMode: "default",
    },
  });

export default i18n;

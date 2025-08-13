import { createI18n } from "vue-i18n";

export const SUPPORT_LOCALES = ["de", "ru"] as const;
export type AvailableLocale = (typeof SUPPORT_LOCALES)[number];

export const DEFAULT_LOCALE: AvailableLocale = "de";

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {}, // изначально пусто
  globalInjection: true,
});

export async function loadLocaleMessages(locale: AvailableLocale) {
  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
}

export async function setLocale(locale: AvailableLocale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale);
  }
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
}

export default i18n;

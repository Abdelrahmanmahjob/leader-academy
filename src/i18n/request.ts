import { getRequestConfig } from "next-intl/server";
import { isLocale, routing, type Locale } from "./routing";

const loadMessages = {
  ar: () => import("../../messages/ar.json").then((module) => module.default),
  en: () => import("../../messages/en.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<Record<string, unknown>>>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale: Locale =
    requestedLocale && isLocale(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages[locale](),
  };
});

"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border px-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-hover"
      aria-label={`${t("languageSwitch")}: ${nextLocale === "ar" ? "العربية" : "English"}`}
    >
      {nextLocale === "ar" ? "ع" : "EN"}
    </Link>
  );
}

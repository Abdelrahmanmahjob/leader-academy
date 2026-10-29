import type { Metadata } from "next";
import { Cairo, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { isLocale, routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import "../globals.css";
import { CtaSection } from "@/components/sections/home/CtaSection";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Leader Academy",
    template: "%s | Leader Academy",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${montserrat.variable} ${cairo.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full bg-background text-foreground ${
          locale === "ar" ? "font-arabic" : "font-sans"
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <a
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:text-foreground"
            href="#main-content"
          >
            {messages.common.skipToContent}
          </a>
          <div className="relative isolate min-h-screen">
            <StripedPattern
              width={18}
              height={18}
              className="z-0 text-white/[0.035] [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
            />
            <div className="relative z-20 flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <CtaSection />
              <Footer />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

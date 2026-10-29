import Image from "next/image";
import { useTranslations } from "next-intl";
import { AboutSection } from "./AboutSection";
import { SectionHeading } from "./SectionHeading";

export function AboutHero() {
  const t = useTranslations("home.about");

  return (
    <AboutSection
      aria-labelledby="about-hero-title"
      className="pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40"
      containerClassName="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14"
    >
      <SectionHeading
        as="h1"
        size="hero"
        id="about-hero-title"
        eyebrow={t("eyebrow")}
        title={t("introTitle")}
        description={t("introDescription")}
        reveal="start"
        className="order-2 lg:order-1"
      />

      <div
        data-reveal="end"
        className="relative order-1 min-h-[390px] overflow-hidden rounded-[28px] border border-border lg:order-2 lg:min-h-[520px]"
      >
        <Image
          src="/images/about-page/about1.jpeg"
          alt={t("heroImageAlt")}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain object-top"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/55 via-transparent to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--la-foreground)_20%,transparent)]"
        />
      </div>
    </AboutSection>
  );
}

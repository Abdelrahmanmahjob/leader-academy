import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { AboutSection } from "./AboutSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "./SectionHeading";
import type { AboutExpert } from "@/types/types";

const cardSize = "min-h-[430px] sm:min-h-[500px]";

export function AboutExperts() {
  const t = useTranslations("home.about");
  const experts: AboutExpert[] = t.raw("experts");

  return (
    <AboutSection aria-labelledby="about-experts-title" glow="start">
      <SectionHeading
        id="about-experts-title"
        eyebrow={t("coachesEyebrow")}
        title={t("expertsTitle")}
        description={t("expertsDescription")}
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {experts.map((expert, index) => (
          <li
            key={expert.name}
            data-reveal=""
            className={`group relative overflow-hidden rounded-[24px] border border-border bg-surface ${cardSize}`}
          >
            <Image
              src={expert.image}
              alt={expert.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />

            <GlassCard className="absolute inset-x-3 bottom-3 rounded-[18px] p-4 transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none">
              <p className="text-xs font-bold tracking-[.16em] text-accent rtl:tracking-normal">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1.5 text-xl font-extrabold">{expert.name}</h3>
              <p className="mt-1 text-sm text-foreground/70">{expert.role}</p>
            </GlassCard>
          </li>
        ))}

        <li
          data-reveal=""
          className={`flex flex-col justify-between rounded-[24px] border border-accent/35 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--la-accent)_12%,var(--la-surface)),var(--la-surface))] p-6 ${cardSize}`}
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            {/* Directional arrow: mirrored in RTL */}
            <ArrowUpRight
              className="size-6 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </span>
          <div>
            <h3 className="text-2xl font-extrabold">{t("ctaTitle")}</h3>
            <p className="mt-3 leading-7 text-foreground/70">
              {t("ctaDescription")}
            </p>
            <Link
              href="/trainers"
              className={buttonVariants({
                variant: "glass-accent",
                size: "lg",
                className: "mt-6 min-h-12 rounded-full! px-7!",
              })}
            >
              {t("seeMore")}
            </Link>
          </div>
        </li>
      </ul>
    </AboutSection>
  );
}

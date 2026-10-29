"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export function ClassesSection() {
  const t = useTranslations("classesPage");
  const classes = [
    {
      image: "/images/home-page/our-paths/our-paths1.webp",
      name: t("strength.name"),
      text: t("strength.text"),
    },
    {
      image: "/images/home-page/our-paths/our-paths2.webp",
      name: t("cardio.name"),
      text: t("cardio.text"),
    },
    {
      image: "/images/home-page/our-paths/our-paths3.webp",
      name: t("mobility.name"),
      text: t("mobility.text"),
    },
    {
      image: "/images/home-page/our-paths/our-paths4.webp",
      name: t("football.name"),
      text: t("football.text"),
    },
  ];
  return (
    <Section className="pt-32">
      <Container>
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h1 className="text-section-heading font-extrabold uppercase">
            {t("title")}
          </h1>
          <p className="mt-5 text-lg text-muted">{t("description")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {classes.map((item, index) => (
            <article
              key={item.name}
              className="group relative min-h-[430px] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                priority={index === 0}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h2 className="text-2xl font-extrabold uppercase">
                  {item.name}
                </h2>
                <p className="mt-3 mb-6 max-w-sm text-sm text-white/75">
                  {item.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/timetable"
                    className="inline-flex min-h-11 items-center rounded-lg border border-white/50 px-5 text-sm font-bold transition hover:bg-white hover:text-black"
                  >
                    {t("viewSchedule")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

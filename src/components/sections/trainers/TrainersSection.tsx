"use client";

import { useTranslations } from "next-intl";
import { AboutSection } from "@/components/sections/about/AboutSection";
import { SectionHeading } from "@/components/sections/about/SectionHeading";
import { TrainerCard } from "./TrainerCard";

export function TrainersSection() {
  const t = useTranslations("trainersPage");
  const trainers = [
    {
      image: "/images/trainer-page/coach1.jpeg",
      name: t("coach1.title"),
      role: t("coach1.subtitle"),
    },
    {
      image: "/images/trainer-page/coach2.jpg",
      name: t("coach2.title"),
      role: t("coach2.subtitle"),
    },
    {
      image: "/images/trainer-page/coach3.webp",
      name: t("coach3.title"),
      role: t("coach3.subtitle"),
    },
  ];

  return (
    <AboutSection aria-labelledby="trainers-page-title" glow="start">
      <SectionHeading
        id="trainers-page-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        as="h1"
        className="pt-12"
      />

      {/* On the 2-column tablet layout an odd last card spans both columns instead of sitting alone. */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:max-lg:[&>li:last-child:nth-child(odd)]:col-span-2 lg:mt-14 lg:grid-cols-3">
        {trainers.map((trainer, index) => (
          <TrainerCard
            key={trainer.name}
            {...trainer}
            index={index}
            priority={index === 0}
          />
        ))}
      </ul>
    </AboutSection>
  );
}

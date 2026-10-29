import {
  Award,
  Dumbbell,
  HeartHandshake,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AboutSection } from "./AboutSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "./SectionHeading";
import type { AboutValue } from "@/types/types";

const icons = [HeartHandshake, Award, SlidersHorizontal, Dumbbell];

export function AboutValues() {
  const t = useTranslations("home.about");
  const values: AboutValue[] = t.raw("values");

  return (
    <AboutSection aria-labelledby="about-values-title" glow="end">
      <SectionHeading
        id="about-values-title"
        align="center"
        title={t("valuesTitle")}
        description={t("valuesDescription")}
      />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {values.map((value, index) => {
          const Icon = icons[index % icons.length];
          return (
            <GlassCard
              as="li"
              key={value.title}
              interactive
              data-reveal=""
              className="group min-h-[280px] p-6"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105 motion-reduce:transition-none rtl:group-hover:-rotate-3">
                <Icon className="size-8" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-12 text-2xl font-extrabold">{value.title}</h3>
              <p className="mt-4 leading-7 text-foreground/70">
                {value.description}
              </p>
            </GlassCard>
          );
        })}
      </ul>
    </AboutSection>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

const durationOptions = [1, 3, 6, 12] as const;
const memberOptions = [1, 2, 3] as const;

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("home.pricing");
  const locale = useLocale();
  const plans = t.raw("plans") as Plan[];
  const [duration, setDuration] = useState<(typeof durationOptions)[number]>(1);
  const [members, setMembers] = useState<(typeof memberOptions)[number]>(1);
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  );
  const selectionKey = `${duration}-${members}`;

  useGSAP(
    () => {
      gsap.fromTo(
        ".pricing-heading, .pricing-card",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".pricing-card",
          { autoAlpha: 0, y: 22, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".pricing-price",
          { y: 10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
        );
      });

      return () => motion.revert();
    },
    { scope: sectionRef, dependencies: [selectionKey], revertOnUpdate: true },
  );

  function optionGroup<T extends number>(
    label: string,
    options: readonly T[],
    value: T,
    onChange: (next: T) => void,
    getLabel: (option: T) => string,
  ) {
    return (
      <div role="group" aria-label={label} className="min-w-0">
        <p className="mb-2 text-sm font-bold text-foreground/75">{label}</p>
        <div className="glass-panel inline-flex w-full flex-wrap gap-1.5 rounded-full p-1.5">
          {options.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(option)}
                className={`min-h-11 flex-1 rounded-full px-4 text-sm font-bold transition-[background-color,color,transform,box-shadow] duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  selected
                    ? "bg-accent text-inverse shadow-[0_8px_24px_color-mix(in_srgb,var(--la-accent)_32%,transparent)]"
                    : "text-foreground/65 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {getLabel(option)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className={shell}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="pricing-heading text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-tight tracking-[-0.04em] text-foreground rtl:tracking-normal">
            {t("title")}
          </h2>
          <p className="pricing-heading mt-4 text-base leading-7 text-foreground/65 sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="pricing-heading mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
          {optionGroup(
            t("durationLabel"),
            durationOptions,
            duration,
            setDuration,
            (option) =>
              option === 12
                ? t("oneYearOption")
                : t("durationOption", { count: option }),
          )}
          {optionGroup(
            t("membersLabel"),
            memberOptions,
            members,
            setMembers,
            (option) =>
              option === 1
                ? t("individual")
                : t("siblingsOption", { count: option }),
          )}
        </div>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3 lg:mt-14 lg:gap-5">
          {plans.map((plan, index) => {
            const popular = index === 1;
            const totalPrice = Number(plan.price) * duration * members;
            const features = [
              ...plan.features,
              duration === 12
                ? t("oneYearFeature")
                : t("durationFeature", { count: duration }),
              t("membersFeature", { count: members }),
            ];
            return (
              <article
                key={`${plan.name}-${selectionKey}`}
                className={`pricing-card relative flex min-h-[520px] flex-col rounded-[28px] border p-6 transition-transform duration-500 sm:p-7 lg:hover:-translate-y-2 ${
                  popular
                    ? "border-accent/70 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--la-accent)_12%,var(--la-surface)),var(--la-surface))] shadow-[0_24px_80px_rgba(37,211,102,.12)]"
                    : "border-border bg-surface"
                }`}
              >
                {popular ? (
                  <span className="absolute end-5 top-5 rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold text-inverse">
                    {t("popular")}
                  </span>
                ) : null}

                <p className="text-base font-bold text-foreground/75">
                  {plan.name}
                </p>
                <div className="mt-5 flex items-end gap-2 border-b border-border pb-6">
                  <span className="pricing-price text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    {numberFormat.format(totalPrice)}
                  </span>
                  <span className="pb-1 text-sm font-bold text-foreground/60">
                    {t("totalPrice")}
                  </span>
                </div>
                <p className="mt-5 min-h-[72px] text-sm leading-6 text-foreground/65">
                  {plan.description}
                </p>
                <p className="mt-3 text-xs font-semibold leading-5 text-foreground/50">
                  {t("priceBreakdown", {
                    monthlyPrice: numberFormat.format(Number(plan.price)),
                    months: duration,
                    members,
                  })}
                </p>

                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: popular ? "glass-accent" : "glass",
                    size: "lg",
                    className: "mt-6 min-h-12 w-full rounded-full!",
                  })}
                >
                  {t("getStarted")}
                </Link>

                <div className="mt-7">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-foreground/45">
                    {t("features")}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-6 text-foreground/75"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

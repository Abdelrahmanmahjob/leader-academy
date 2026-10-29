"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("home.pricing");
  const plans = t.raw("plans") as Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;

  useGSAP(() => {
    gsap.fromTo(
      ".pricing-heading, .pricing-card",
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      },
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="border-b border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={shell}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="pricing-heading text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-tight tracking-[-0.04em] text-foreground rtl:tracking-normal">
            {t("title")}
          </h2>
          <p className="pricing-heading mt-4 text-base leading-7 text-foreground/65 sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3 lg:mt-14 lg:gap-5">
          {plans.map((plan, index) => {
            const popular = index === 1;
            return (
              <article
                key={plan.name}
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

                <p className="text-base font-bold text-foreground/75">{plan.name}</p>
                <div className="mt-5 flex items-end gap-2 border-b border-border pb-6">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{plan.price}</span>
                  <span className="pb-1 text-sm font-bold text-foreground/60">SAR / {t("period")}</span>
                </div>
                <p className="mt-5 min-h-[72px] text-sm leading-6 text-foreground/65">{plan.description}</p>

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
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-foreground/75">
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

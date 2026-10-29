"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useDirection } from "@/hooks/useDirection";
import type { ContactFormData } from "@/app/api/contact/route";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { gsap, useGSAP } from "./GsapSetup";

type ContactSectionProps = {
  onSubmit?: (data: ContactFormData) => Promise<void>;
};

export function ContactSection({ onSubmit }: ContactSectionProps) {
  const t = useTranslations("contactPage");
  const { flip } = useDirection();
  const rootRef = useRef<HTMLDivElement>(null);

  // Plays on load: intro text, contact rows from the start side, form panel from the end side, then the fields.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".contact-intro > *",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".contact-info-item",
          { autoAlpha: 0, x: -flip * 28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            delay: 0.35,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".contact-panel",
          { autoAlpha: 0, x: flip * 48, y: 20 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".contact-field",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            delay: 0.6,
            ease: "power2.out",
          },
        );
      });
    },
    { scope: rootRef, dependencies: [flip] },
  );

  return (
    <Section className="pt-30 sm:pt-35">
      <Container>
        <div ref={rootRef} className="relative isolate overflow-x-clip">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-24 -top-24 -z-10 size-[30rem] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--la-accent)_14%,transparent),transparent)]"
          />

          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <div className="contact-intro">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:text-sm rtl:tracking-normal rtl:normal-case">
                  {t("eyebrow")}
                </p>
                <h1 className="text-section-heading font-extrabold uppercase rtl:leading-[1.3] rtl:normal-case">
                  {t("title")}
                </h1>
                <p className="mt-5 max-w-lg text-lg text-muted">
                  {t("description")}
                </p>
              </div>
              <ContactInfo />
            </div>

            <ContactForm onSubmit={onSubmit} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

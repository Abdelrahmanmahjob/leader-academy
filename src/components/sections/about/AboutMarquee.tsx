"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
// import { useDirection } from "@/hooks/useDirection";
import { NO_MOTION, ScrollTrigger, gsap, useGSAP } from "./shared/Motion";

const PARTNERS = ["LEADER", "NORTHFIT", "VITAL", "PERFORM", "MOTION", "ELITE"];
/** Enough copies that the strip never runs dry on ultra-wide screens. */
const COPIES = 4;

export function AboutMarquee() {
  const t = useTranslations("home.about");
  //   const { sign } = useDirection();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        // Shifting by exactly one copy (100 / COPIES %) makes the loop seamless.
        // Direction follows the writing direction.
        const tween = gsap.to(trackRef.current, {
          xPercent: (-5 * 100) / COPIES,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
        tweenRef.current = tween;

        // Only run while the strip is on screen.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        });

        return () => {
          tweenRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  const setSpeed = (timeScale: number) => {
    if (tweenRef.current)
      gsap.to(tweenRef.current, { timeScale, duration: 0.6, overwrite: true });
  };

  return (
    <section
      ref={sectionRef}
      aria-label={t("partnersLabel")}
      className="overflow-hidden border-b border-border bg-background py-10 sm:py-12"
    >
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          ref={trackRef}
          className="flex w-max"
          onPointerEnter={() => setSpeed(0.25)}
          onPointerLeave={() => setSpeed(1)}
        >
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 ? true : undefined}
              className="flex shrink-0 items-center gap-5 pe-5"
            >
              {PARTNERS.map((logo) => (
                <li
                  key={logo}
                  className="flex h-20 min-w-[190px] items-center justify-center rounded-2xl border border-border bg-surface/70 px-7 text-lg font-extrabold tracking-[.18em] text-foreground/70 sm:h-24 sm:min-w-[230px]"
                >
                  {logo}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

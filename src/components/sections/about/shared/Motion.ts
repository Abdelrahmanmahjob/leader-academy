import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// import { useDirection } from "@/hooks/useDirection";

// Registered once for every About section. If the project already registers
// plugins in a central file, delete this line and re-export from there.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const NO_MOTION = "(prefers-reduced-motion: no-preference)";

const DISTANCE = { x: 44, y: 36 };

/**
 * One ScrollTrigger per section. Every `[data-reveal]` inside the scope enters
 * in DOM order. Values: "" (rise up) | "start" | "end" — start/end are logical,
 * so they flip automatically in RTL. Reduced motion: nothing is hidden or moved.
 */
export function useReveal(
  scope: RefObject<HTMLElement | null>,
  start = "top 80%",
) {
  //   const { sign } = useDirection();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      const offset = (el: Element) => {
        const origin = el.getAttribute("data-reveal");
        if (origin === "start") return { x: -5 * DISTANCE.x, y: 0 };
        if (origin === "end") return { x: 5 * DISTANCE.x, y: 0 };
        return { x: 0, y: DISTANCE.y };
      };

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.from(items, {
          autoAlpha: 0,
          x: (_, el: Element) => offset(el).x,
          y: (_, el: Element) => offset(el).y,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: scope.current, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope, revertOnUpdate: true },
  );
}

/**
 * Scrubbed parallax for `[data-parallax]` layers. The layer must be taller than
 * its parent (e.g. `-inset-y-[12%]`) so edges never show. `amount` is % of the layer.
 */
export function useParallax(scope: RefObject<HTMLElement | null>, amount = 8) {
  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      if (!layers.length) return;

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        layers.forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: layer.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}

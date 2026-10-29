"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { useDirection } from "@/hooks/useDirection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PathCard = {
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  href: string;
};

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

// Accordion geometry (desktop). The active card is GROW times wider than a collapsed one.
const DEFAULT_ACTIVE = 1;
const GROW = 2.36;
const GAP_REM = 1.25; // gap-5
const PAD_REM = 1; // p-4

// Portrait width = collapsed card width minus its padding, so the image never resizes while cards grow.
const rowStyle = {
  "--img": `calc((100cqw - ${GAP_REM * 2}rem) / ${GROW + 2} - ${PAD_REM * 2}rem)`,
} as CSSProperties;

export function OurPathsSection({
  titleOverride,
}: { titleOverride?: string } = {}) {
  const t = useTranslations("home.paths");
  const cards = t.raw("cards") as PathCard[];
  const { flip } = useDirection();

  const [active, setActive] = useState(DEFAULT_ACTIVE);
  const [desktop, setDesktop] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  // Entrance on scroll (reduced motion: skipped, content simply stays visible).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".paths-heading",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          ".paths-card",
          { autoAlpha: 0, y: 48, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rowRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  // The accordion only exists from lg up; below that every card is shown expanded.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Expand / collapse. Event-driven, so it uses plain effects with explicit cleanup
  // (a useGSAP context would revert to the CSS defaults on every change and make the cards jump).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const cardEls = Array.from(
      row.querySelectorAll<HTMLElement>("[data-card]"),
    );
    const itemEls = Array.from(
      row.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (!desktop) {
      gsap.set(cardEls, { clearProps: "flexGrow" });
      gsap.set(itemEls, { clearProps: "visibility,opacity,transform" });
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    cardEls.forEach((card, index) => {
      const on = index === active;
      const items = card.querySelectorAll("[data-reveal]");

      gsap.to(card, {
        flexGrow: on ? GROW : 1,
        duration: reduce ? 0 : 0.9,
        ease: "power4.out",
        overwrite: "auto",
      });

      if (on) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: flip * 28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: reduce ? 0 : 0.6,
            stagger: reduce ? 0 : 0.07,
            delay: reduce ? 0 : 0.22,
            ease: "power3.out",
            overwrite: true,
          },
        );
      } else {
        gsap.to(items, {
          autoAlpha: 0,
          x: flip * 14,
          duration: reduce ? 0 : 0.2,
          ease: "power2.in",
          overwrite: true,
        });
      }
    });

    return () => {
      gsap.killTweensOf([...cardEls, ...itemEls]);
    };
  }, [active, desktop, flip]);

  // Pointer parallax on the portrait + a light that follows the cursor (fine pointers, motion allowed).
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !desktop) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cardEls = Array.from(
      row.querySelectorAll<HTMLElement>("[data-card]"),
    );
    const movers = cardEls.map((card) => {
      const layer = card.querySelector<HTMLElement>("[data-parallax]");
      return layer
        ? {
            x: gsap.quickTo(layer, "x", { duration: 0.7, ease: "power3.out" }),
            y: gsap.quickTo(layer, "y", { duration: 0.7, ease: "power3.out" }),
          }
        : null;
    });

    function onMove(event: PointerEvent) {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>("[data-card]");
      if (!card) return;
      const index = cardEls.indexOf(card);
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
      movers[index]?.x(-nx * 18);
      movers[index]?.y(-ny * 18);
    }

    function onLeave() {
      movers.forEach((mover) => {
        mover?.x(0);
        mover?.y(0);
      });
    }

    row.addEventListener("pointermove", onMove, { passive: true });
    row.addEventListener("pointerleave", onLeave);
    return () => {
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
      const layers = cardEls.flatMap((card) =>
        Array.from(card.querySelectorAll("[data-parallax]")),
      );
      gsap.killTweensOf(layers);
      gsap.set(layers, { x: 0, y: 0 });
    };
  }, [desktop]);

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className={shell}>
        <h2 className="paths-heading text-center text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-tight tracking-[-0.04em] text-foreground rtl:leading-[1.3] rtl:tracking-normal rtl:normal-case">
          {titleOverride ?? t("title")}
        </h2>

        <div className="@container mt-10 lg:mt-14">
          <div
            ref={rowRef}
            style={rowStyle}
            className="flex flex-col gap-5 lg:flex-row"
          >
            {cards.map((card, index) => {
              const isActive = active === index;
              const startsOpen = index === DEFAULT_ACTIVE;
              // Before JS runs, collapsed cards must already be hidden from sight and from the tab order.
              const hiddenAtStart = startsOpen
                ? ""
                : "lg:invisible lg:opacity-0";

              return (
                <article
                  key={card.title}
                  data-card
                  data-active={isActive}
                  className={`paths-card group/card relative isolate flex flex-col overflow-hidden rounded-[2rem] border border-accent/25 bg-[color-mix(in_srgb,var(--la-accent)_24%,var(--la-background))] p-4 transition-[background-color,border-color,box-shadow] duration-700 md:flex-row lg:min-h-[34rem] lg:basis-0 lg:data-[active=false]:border-border lg:data-[active=false]:bg-surface lg:data-[active=true]:shadow-[0_28px_70px_-28px_color-mix(in_srgb,var(--la-inverse)_90%,transparent)] ${
                    startsOpen ? "lg:grow-[2.36]" : "lg:grow"
                  }`}
                  onPointerEnter={(event) =>
                    event.pointerType === "mouse" && setActive(index)
                  }
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  {/* Cursor-following light */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 lg:block bg-[radial-gradient(380px_circle_at_var(--glass-x,50%)_var(--glass-y,0%),color-mix(in_srgb,var(--la-accent)_18%,transparent),transparent_70%)]"
                  />

                  {/* Portrait: fixed width on desktop, so only the card around it grows */}
                  <div className="relative z-10 h-72 w-full shrink-0 overflow-hidden rounded-3xl sm:h-80 md:h-auto md:min-h-[22rem] md:w-2/5 lg:w-(--img)">
                    <div
                      data-parallax
                      className="absolute inset-0 will-change-transform"
                    >
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        className="scale-[1.08] object-cover object-top transition-transform duration-[1200ms] ease-out group-data-[active=true]/card:scale-[1.14]"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-background/40 opacity-0 transition-opacity duration-700 lg:group-data-[active=false]/card:opacity-100"
                    />

                    <Link
                      href={card.href}
                      aria-label={`${t("viewMore")}: ${card.title}`}
                      className="group/tile absolute bottom-4 start-4 z-10 flex size-12 items-center justify-center rounded-2xl bg-foreground text-inverse shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                      <ArrowUpRight
                        className="size-5 transition-transform duration-300 group-hover/tile:scale-110 rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>

                  {/* Content: clipped to zero width when collapsed, fixed inner width so text never reflows mid-animation */}
                  <div className="relative z-10 min-w-0 md:flex-1 lg:overflow-hidden">
                    <div className="flex h-full flex-col pt-6 md:ps-8 md:pt-2 lg:w-[calc(var(--img)*1.36+2.72rem)] lg:pe-2 lg:ps-6 lg:pt-2">
                      <p
                        data-reveal
                        className={`text-xs font-bold uppercase tracking-[0.16em] text-accent rtl:text-sm rtl:tracking-normal rtl:normal-case ${hiddenAtStart}`}
                      >
                        {card.eyebrow}
                      </p>
                      <p
                        data-reveal
                        className={`mt-4 text-lg leading-8 text-foreground/90 xl:text-xl xl:leading-9 ${hiddenAtStart}`}
                      >
                        {card.description}
                      </p>

                      <div className="mt-auto pt-8">
                        <h3
                          data-reveal
                          className={`text-3xl font-extrabold leading-tight text-foreground sm:text-4xl ${hiddenAtStart}`}
                        >
                          {card.title}
                        </h3>
                        <p
                          data-reveal
                          className={`mt-1 text-base font-medium text-accent ${hiddenAtStart}`}
                        >
                          {card.summary}
                        </p>
                        <div data-reveal className={hiddenAtStart}>
                          <Link
                            href={card.href}
                            className={buttonVariants({
                              variant: "glass-accent",
                              size: "lg",
                              className: "mt-5 min-h-11! rounded-full! px-6!",
                            })}
                          >
                            {t("viewMore")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

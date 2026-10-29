"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Award, CalendarClock, CreditCard, Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/useDirection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";
const icons = [Dumbbell, CalendarClock, Award, CreditCard];

// Each card = surface colour + two-tone icon colours, all from the existing tokens.
const themes = [
  {
    card: "bg-foreground text-inverse [--tone-a:color-mix(in_srgb,var(--la-inverse)_42%,transparent)] [--tone-b:var(--la-accent)]",
    desc: "text-inverse/70",
  },
  {
    card: "bg-accent text-inverse [--tone-a:color-mix(in_srgb,var(--la-inverse)_45%,transparent)] [--tone-b:var(--la-foreground)]",
    desc: "text-inverse/75",
  },
  {
    card: "bg-muted text-inverse [--tone-a:color-mix(in_srgb,var(--la-inverse)_45%,transparent)] [--tone-b:color-mix(in_srgb,var(--la-accent)_65%,var(--la-inverse))]",
    desc: "text-inverse/75",
  },
  {
    card: "bg-surface-raised text-foreground border border-border-strong [--tone-a:color-mix(in_srgb,var(--la-foreground)_40%,transparent)] [--tone-b:var(--la-accent)]",
    desc: "text-foreground/70",
  },
] as const;

// Geometry (desktop). A collapsed card owns one "unit" of the row, an open card is EXPAND units wide
// and simply covers its neighbours. The last card is open by default.
const EXPAND = 1.75;
const LIFT_PX = 12;
const SHADOW_COLOR = "color-mix(in_srgb,var(--la-inverse)_80%,transparent)";
const textWidth = "lg:w-[calc(var(--unit)-2.5rem)]";

export function PartnerSection() {
  const t = useTranslations("home.partner");
  const benefits = t.raw("benefits") as Array<{
    title: string;
    description: string;
  }>;
  const { flip } = useDirection();

  const defaultOpen = benefits.length - 1;
  const unit = 100 / (benefits.length - 1 + EXPAND);

  const [hovered, setHovered] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef<Set<number>>(new Set([defaultOpen]));
  const prevHovered = useRef<number | null>(null);

  // Scroll entrance: heading, then the cards slide in from the inline-end side.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".partner-heading",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          ".partner-card",
          { autoAlpha: 0, x: flip * 70 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.1,
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
    { scope: sectionRef, dependencies: [flip] },
  );

  // The overlapping stack only exists from lg up; below that the cards are a normal, always-open grid.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Open / close. Event-driven, so plain effects with overwrite (a useGSAP context would revert to CSS defaults each time).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-card]"));
    const arts = cards.map((card) =>
      card.querySelector<HTMLElement>("[data-art]"),
    );

    if (!desktop) {
      gsap.set(cards, { clearProps: "width,top,zIndex" });
      gsap.set(arts.filter(Boolean), {
        clearProps: "visibility,opacity,transform",
      });
      prevOpen.current = new Set([defaultOpen]);
      prevHovered.current = null;
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const open = new Set<number>([defaultOpen]);
    if (hovered !== null) open.add(hovered);

    cards.forEach((card, index) => {
      const isOpen = open.has(index);
      const isHovered = index === hovered;
      const baseZ = index + 1;

      // Hovered card sits on top; the card that was just left stays above its neighbours until it has shrunk back.
      gsap.set(card, {
        zIndex: isHovered ? 60 : prevHovered.current === index ? 50 : baseZ,
      });

      gsap.to(card, {
        width: `${(isOpen ? unit * EXPAND : unit).toFixed(3)}%`,
        top: isHovered ? -LIFT_PX : 0,
        duration: reduce ? 0 : 0.75,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => {
          if (!isHovered) gsap.set(card, { zIndex: baseZ });
        },
      });

      const art = arts[index];
      if (!art) return;
      const wasOpen = prevOpen.current.has(index);

      if (isOpen && !wasOpen) {
        gsap.fromTo(
          art,
          { autoAlpha: 0, scale: 0.72, rotate: flip * -10, x: flip * -18 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            duration: reduce ? 0 : 0.7,
            delay: reduce ? 0 : 0.12,
            ease: "power3.out",
            overwrite: true,
          },
        );
      } else if (!isOpen && wasOpen) {
        gsap.to(art, {
          autoAlpha: 0,
          scale: 0.85,
          duration: reduce ? 0 : 0.2,
          ease: "power2.in",
          overwrite: true,
        });
      }
    });

    prevOpen.current = open;
    prevHovered.current = hovered;
  }, [hovered, desktop, flip, unit, defaultOpen]);

  useEffect(() => {
    const row = rowRef.current;
    return () => {
      if (row)
        gsap.killTweensOf(row.querySelectorAll("[data-card],[data-art]"));
    };
  }, []);

  const rowStyle = {
    "--unit": `calc(100cqw / ${benefits.length - 1 + EXPAND})`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className={shell}>
        <h2 className="partner-heading mx-auto max-w-4xl text-center text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-[1.08] tracking-[-0.04em] text-foreground rtl:leading-[1.25] rtl:tracking-normal rtl:normal-case">
          {t("title")}
        </h2>

        <div className="@container mx-auto mt-10 max-w-6xl lg:mt-14 lg:pt-4">
          <div
            ref={rowRef}
            style={rowStyle}
            className="grid gap-4 sm:grid-cols-2 lg:relative lg:block lg:h-[22rem]"
            onPointerLeave={(event) =>
              event.pointerType === "mouse" && setHovered(null)
            }
          >
            {benefits.map((benefit, index) => {
              const Icon = icons[index % icons.length];
              const theme = themes[index % themes.length];
              const isDefault = index === defaultOpen;

              return (
                <article
                  key={benefit.title}
                  data-card
                  data-hover={hovered === index}
                  style={
                    {
                      "--left": `${(unit * index).toFixed(3)}%`,
                      "--w": `${(isDefault ? unit * EXPAND : unit).toFixed(3)}%`,
                      zIndex: index + 1,
                    } as CSSProperties
                  }
                  className={`partner-card relative flex min-h-64 flex-col justify-between overflow-hidden rounded-md p-5 transition-shadow duration-500 lg:absolute lg:inset-y-0 lg:min-h-0 lg:w-(--w) lg:[inset-inline-start:var(--left)] shadow-[0_18px_40px_-18px_${SHADOW_COLOR},-14px_0_28px_-16px_${SHADOW_COLOR}] rtl:shadow-[0_18px_40px_-18px_${SHADOW_COLOR},14px_0_28px_-16px_${SHADOW_COLOR}] lg:data-[hover=true]:shadow-[0_34px_64px_-22px_${SHADOW_COLOR},-18px_0_36px_-16px_${SHADOW_COLOR}] rtl:lg:data-[hover=true]:shadow-[0_34px_64px_-22px_${SHADOW_COLOR},18px_0_36px_-16px_${SHADOW_COLOR}] ${theme.card}`}
                  onPointerEnter={(event) =>
                    event.pointerType === "mouse" && setHovered(index)
                  }
                  onClick={() => setHovered(index)}
                >
                  {/* Decorative two-tone icon: neutral outline + glowing accent half. Always visible below lg. */}
                  <div
                    data-art
                    aria-hidden="true"
                    className={`pointer-events-none absolute end-5 top-12 size-28 lg:top-14 lg:size-32 ${
                      isDefault ? "" : "lg:invisible lg:opacity-0"
                    }`}
                  >
                    <Icon
                      className="absolute inset-0 size-full text-(--tone-a)"
                      strokeWidth={1.1}
                    />
                    <Icon
                      className="absolute inset-0 size-full text-(--tone-b) [clip-path:polygon(0_100%,100%_0,100%_100%)] drop-shadow-[0_0_8px_color-mix(in_srgb,var(--tone-b)_75%,transparent)]"
                      strokeWidth={1.1}
                    />
                  </div>

                  <h3
                    className={`relative z-10 text-xl font-extrabold uppercase leading-tight max-lg:pe-32 xl:text-2xl rtl:normal-case rtl:leading-snug ${textWidth}`}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={`relative z-10 text-sm leading-6 ${theme.desc} ${textWidth}`}
                  >
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { useDirection } from "@/hooks/useDirection";

const slides = [
  {
    image: "/images/home-page/hero/hero1.jpg",
    primary: "/contact",
    secondary: "/services",
  },
  {
    image: "/images/home-page/hero/hero2.jpg",
    primary: "/trainers",
    secondary: "/services",
  },
] as const;

const stats = [
  { target: 500, suffix: "+", key: 0 },
  { target: 30, suffix: "+", key: 1 },
  { target: 10, suffix: "+", key: 2 },
  { target: 99, suffix: "%", key: 3 },
] as const;

const SLIDE_DURATION_S = 7;
const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";
const ctaExtras = "min-h-12 rounded-full! px-7!";

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(false);
  const firstRun = useRef(true);

  const t = useTranslations("home.hero");
  const { isRtl } = useDirection();

  const paused = hovered || focused;
  const slideIndex = String(activeSlide);
  const slide = slides[activeSlide];

  // One effect per slide, for both manual and automatic changes:
  // content reveal + the autoplay progress tween that advances the slide.
  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;

      const first = firstRun.current;
      firstRun.current = false;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);
          const fill = fillRef.current;

          if (reduce) {
            // No motion and no autoplay: show the active dot as a plain accent bar.
            if (fill) gsap.set(fill, { scaleX: 1 });
            return;
          }

          gsap.fromTo(
            content.children,
            { autoAlpha: 0, y: first ? 28 : 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: first ? 0.75 : 0.5,
              stagger: first ? 0.12 : 0.07,
              ease: "power3.out",
            },
          );

          if (fill) {
            const tween = gsap.fromTo(
              fill,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: SLIDE_DURATION_S,
                ease: "none",
                transformOrigin: isRtl ? "100% 50%" : "0% 50%",
                onComplete: () =>
                  setActiveSlide((current) => (current + 1) % slides.length),
              },
            );
            tween.paused(pausedRef.current);
            tweenRef.current = tween;
          }

          return () => {
            tweenRef.current = null;
          };
        },
      );
    },
    { scope: sectionRef, dependencies: [activeSlide, isRtl] },
  );

  // Pause autoplay while the pointer or keyboard focus is inside the hero.
  useEffect(() => {
    pausedRef.current = paused;
    tweenRef.current?.paused(paused);
  }, [paused]);

  useEffect(() => {
    const ribbon = statsRef.current;
    if (!ribbon) return;

    const counters = stats.map((stat, index) => ({
      stat,
      node: counterRefs.current[index],
    }));
    counters.forEach(({ stat, node }) => {
      if (node) node.textContent = `0${stat.suffix}`;
    });

    let started = false;
    const animateCounters = () => {
      if (started) return;
      started = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        counters.forEach(({ stat, node }) => {
          if (node) node.textContent = `${stat.target}${stat.suffix}`;
        });
        return;
      }

      counters.forEach(({ stat, node }, index) => {
        if (!node) return;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: stat.target,
          duration: 1.7,
          delay: index * 0.08,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = `${Math.round(counter.value)}${stat.suffix}`;
          },
          onComplete: () => {
            node.textContent = `${stat.target}${stat.suffix}`;
          },
        });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(ribbon);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex top-0 min-h-[850px] flex-col overflow-hidden border-b border-border bg-background sm:min-h-[760px]"
      aria-roledescription="carousel"
      aria-label={t("label")}
      onPointerEnter={(event) =>
        event.pointerType === "mouse" && setHovered(true)
      }
      onPointerLeave={(event) =>
        event.pointerType === "mouse" && setHovered(false)
      }
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      {/* Background: all slides stacked, cross-faded with CSS (no remount, no flash). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {slides.map((item, index) => (
          <Image
            key={item.image}
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover object-center transition-[opacity,transform] duration-[1200ms] ease-out ${
              index === activeSlide
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          />
        ))}
        {/* Text sits on the inline-start side, so the scrim flips with direction. */}
        <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/55 to-background/20 rtl:bg-linear-to-l" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-background/20" />
      </div>

      <div className="relative z-10 flex flex-1 items-center pb-10 pt-30 sm:pb-12">
        <div className={shell}>
          <div ref={contentRef} className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent rtl:text-sm rtl:tracking-normal rtl:normal-case">
              {t("eyebrow")}
            </p>
            <h1 className="text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-foreground rtl:leading-[1.2] rtl:tracking-normal rtl:normal-case">
              {t(`slides.${slideIndex}.title`)}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground/80 sm:text-lg">
              {t(`slides.${slideIndex}.description`)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={slide.primary}
                className={buttonVariants({
                  variant: "glass",
                  size: "lg",
                  className: ctaExtras,
                })}
              >
                {t(`slides.${slideIndex}.primary`)}
              </Link>
              <Link
                href={slide.secondary}
                className={buttonVariants({
                  variant: "glass-accent",
                  size: "lg",
                  className: ctaExtras,
                })}
              >
                {t(`slides.${slideIndex}.secondary`)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls: in normal flow, so they can never overlap the stats on small screens. */}
      <div className={`relative z-10 pb-4 ${shell}`}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <span aria-hidden="true" />

          <div className="glass-panel flex items-center rounded-full px-2">
            {slides.map((item, index) => {
              const active = activeSlide === index;
              return (
                <button
                  key={item.image}
                  type="button"
                  className="group inline-flex items-center p-2"
                  aria-label={`${t("goToSlide")} ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setActiveSlide(index)}
                >
                  <span
                    className={`relative block h-2.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                      active
                        ? "w-8 bg-foreground/25"
                        : "w-2.5 bg-foreground/50 group-hover:bg-foreground"
                    }`}
                  >
                    {active ? (
                      <span
                        ref={fillRef}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`relative z-10 pb-4 sm:pb-6 ${shell}`}>
        <div
          ref={statsRef}
          className="glass-panel grid grid-cols-2 rounded-3xl sm:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className={`border-foreground/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 ${index % 2 === 0 ? "border-e" : ""} ${
                index < 2 ? "border-b" : ""
              } sm:border-b-0 ${index < stats.length - 1 ? "sm:border-e" : "sm:border-e-0"}`}
            >
              <div
                className="text-3xl font-extrabold tabular-nums text-foreground sm:text-4xl"
                aria-label={`${stat.target}${stat.suffix}`}
              >
                <span
                  ref={(node) => {
                    counterRefs.current[index] = node;
                  }}
                  aria-hidden="true"
                >
                  0{stat.suffix}
                </span>
              </div>
              <div className="mt-2 text-sm font-bold text-foreground sm:text-base">
                {t(`stats.${stat.key}.title`)}
              </div>
              <p className="mt-1 hidden text-xs leading-5 text-foreground/65 sm:block">
                {t(`stats.${stat.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

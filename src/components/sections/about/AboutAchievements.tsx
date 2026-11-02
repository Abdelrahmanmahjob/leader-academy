"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Flag,
  Medal,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { AboutSection } from "./AboutSection";
import { SectionHeading } from "./SectionHeading";
import { AchievementCard, type Achievement } from "./AchievementCard";
import { buildRoadPath, lengthAtY, type Point } from "./AchievementsRoad";
import { gsap, useGSAP } from "./shared/Motion";

const icons: LucideIcon[] = [
  Trophy,
  BadgeCheck,
  Medal,
  UsersRound,
  ShieldCheck,
  Star,
  Target,
  Flag,
];

/** Where on the screen (% from the top) the traveller sits while you scroll. */
const ANCHOR = 55;
/** How far the road extends above the first and below the last node. */
const LEAD = 56;

type Geometry = {
  d: string;
  w: number;
  h: number;
  roadW: number;
  points: Point[];
};

const nodeStyles = {
  upcoming:
    "bg-surface-raised text-foreground/45 shadow-[0_0_0_3px_color-mix(in_srgb,var(--la-foreground)_10%,transparent)]",
  passed:
    "bg-accent text-inverse shadow-[0_0_0_3px_color-mix(in_srgb,var(--la-accent)_30%,transparent)]",
  current:
    "scale-110 bg-accent text-inverse shadow-[0_0_0_4px_color-mix(in_srgb,var(--la-accent)_45%,transparent)]",
} as const;

const pad = (value: number) => String(value).padStart(2, "0");

export function AboutAchievements() {
  const t = useTranslations("home.about");
  const achievements = t.raw("achievements") as Achievement[];
  const total = achievements.length;

  const timelineRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const travellerRef = useRef<SVGGElement>(null);
  const activeRef = useRef(0);

  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);

  // Measure the real node positions, so the road is always drawn through them (any direction, any breakpoint).
  const measure = useCallback(() => {
    const root = timelineRef.current;
    if (!root) return;

    const rootRect = root.getBoundingClientRect();
    const points = Array.from(
      root.querySelectorAll<HTMLElement>("[data-node]"),
    ).map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        x: Math.round((rect.left + rect.width / 2 - rootRect.left) * 10) / 10,
        y: Math.round((rect.top + rect.height / 2 - rootRect.top) * 10) / 10,
      };
    });
    if (points.length === 0) return;

    const next: Geometry = {
      d: buildRoadPath(points, LEAD),
      w: Math.round(rootRect.width),
      h: Math.round(rootRect.height),
      roadW: window.innerWidth >= 768 ? 56 : 26,
      points,
    };
    setGeometry((previous) =>
      previous &&
      previous.d === next.d &&
      previous.w === next.w &&
      previous.h === next.h &&
      previous.roadW === next.roadW
        ? previous
        : next,
    );
  }, []);

  useEffect(() => {
    const root = timelineRef.current;
    if (!root) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [measure]);

  // Scroll drives everything: the traveller, the lit road, the active node/card, and the card reveals.
  useGSAP(
    () => {
      const root = timelineRef.current;
      const road = roadRef.current;
      const lit = progressRef.current;
      const traveller = travellerRef.current;
      if (!root || !road || !lit || !traveller || !geometry) return;

      const length = road.getTotalLength();
      const ys = geometry.points.map((point) => point.y);
      const pick = (y: number) =>
        ys.reduce(
          (found, nodeY, index) => (nodeY <= y + 24 ? index : found),
          0,
        );
      const sync = (index: number) => {
        if (index === activeRef.current) return;
        activeRef.current = index;
        setActive(index);
      };

      lit.style.strokeDasharray = String(length);

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);
          const follow = { y: 0 };

          const render = (y: number) => {
            const at = lengthAtY(road, y, length);
            const point = road.getPointAtLength(at);
            traveller.setAttribute(
              "transform",
              `translate(${point.x} ${point.y})`,
            );
            lit.style.strokeDashoffset = String(length - at);
            sync(pick(y));
          };

          if (reduce) {
            // No scroll-linked motion: road fully lit, no traveller, but the active step still follows the scroll position.
            traveller.style.display = "none";
            lit.style.strokeDashoffset = "0";
          } else {
            traveller.style.display = "";
          }

          ScrollTrigger.create({
            trigger: root,
            start: `top ${ANCHOR}%`,
            end: `bottom ${ANCHOR}%`,
            onRefresh: (self) => {
              follow.y = self.progress * geometry.h;
              if (reduce) sync(pick(follow.y));
              else render(follow.y);
            },
            onUpdate: (self) => {
              const target = self.progress * geometry.h;
              if (reduce) {
                sync(pick(target));
                return;
              }
              // Ease toward the target so the traveller glides instead of jittering with the scroll wheel.
              gsap.to(follow, {
                y: target,
                duration: 0.6,
                ease: "power3.out",
                overwrite: true,
                onUpdate: () => render(follow.y),
              });
            },
          });

          if (reduce) return;

          const rootRect = root.getBoundingClientRect();
          root
            .querySelectorAll<HTMLElement>("[data-achievement-card]")
            .forEach((card) => {
              // Slide in from the outer edge, decided from where the card really is (works in RTL and on mobile).
              const rect = card.getBoundingClientRect();
              const side =
                rect.left + rect.width / 2 < rootRect.left + rootRect.width / 2
                  ? -1
                  : 1;

              gsap.fromTo(
                card,
                { autoAlpha: 0.2, x: side * 44, y: 28, scale: 0.96 },
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 60%",
                    scrub: 0.5,
                  },
                },
              );

              const image = card.querySelector("[data-card-image]");
              if (image) {
                gsap.fromTo(
                  image,
                  { yPercent: -8 },
                  {
                    yPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: true,
                    },
                  },
                );
              }
            });
        },
      );
    },
    {
      scope: timelineRef,
      dependencies: [geometry?.d, geometry?.h],
      revertOnUpdate: true,
    },
  );

  function goTo(index: number) {
    const items =
      timelineRef.current?.querySelectorAll<HTMLElement>("[data-item]");
    if (!items || items.length === 0) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    items[Math.min(Math.max(index, 0), items.length - 1)].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }

  const start = geometry?.points[0];

  return (
    <AboutSection aria-labelledby="about-achievements-title" glow="end">
      <SectionHeading
        id="about-achievements-title"
        eyebrow={t("achievementsEyebrow")}
        title={t("achievementsTitle")}
        description={t("achievementsDescription")}
        align="center"
      />

      <div ref={timelineRef} className="relative mt-10 lg:mt-16">
        {/* Road, drawn in real pixels from the measured node positions */}
        {geometry ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 overflow-visible"
            width={geometry.w}
            height={geometry.h}
            viewBox={`0 0 ${geometry.w} ${geometry.h}`}
          >
            <path
              d={geometry.d}
              fill="none"
              stroke="var(--la-border-strong)"
              strokeWidth={geometry.roadW + 4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={geometry.d}
              fill="none"
              stroke="var(--la-surface-raised)"
              strokeWidth={geometry.roadW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={roadRef}
              d={geometry.d}
              fill="none"
              stroke="var(--la-foreground)"
              strokeOpacity={0.2}
              strokeWidth={2}
              strokeDasharray="10 14"
              strokeLinecap="round"
            />
            <path
              ref={progressRef}
              d={geometry.d}
              fill="none"
              stroke="var(--la-accent)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter:
                  "drop-shadow(0 0 6px color-mix(in srgb, var(--la-accent) 80%, transparent))",
              }}
            />
            <g
              ref={travellerRef}
              transform={
                start ? `translate(${start.x} ${start.y - LEAD})` : undefined
              }
            >
              <circle
                r={18}
                className="fill-accent/20 motion-safe:animate-pulse"
              />
              <circle
                r={8}
                className="fill-accent stroke-background"
                strokeWidth={3}
              />
            </g>
          </svg>
        ) : null}

        {/* Sticky progress + controls: the easiest way to move through the timeline on a phone */}
        <div className="sticky top-[5.5rem] z-30 mb-8 flex justify-center">
          <div
            role="group"
            aria-label={t("achievementsCounter", {
              current: active + 1,
              total,
            })}
            className="glass-panel flex w-full max-w-md items-center gap-3 rounded-full p-2 ps-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-extrabold tabular-nums text-accent">
                  {pad(active + 1)}
                </span>
                <span className="text-xs font-bold tabular-nums text-foreground/40">
                  / {pad(total)}
                </span>
                <span className="truncate text-xs text-foreground/70">
                  {achievements[active]?.category}
                </span>
              </div>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-foreground/10">
                <span
                  className="block h-full origin-left rounded-full bg-accent transition-transform duration-500 rtl:origin-right"
                  style={{ transform: `scaleX(${(active + 1) / total})` }}
                />
              </span>
            </div>

            <button
              type="button"
              aria-label={t("achievementsPrev")}
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-[background-color,transform,opacity] duration-200 hover:bg-foreground/20 active:scale-90 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronUp className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("achievementsNext")}
              disabled={active === total - 1}
              onClick={() => goTo(active + 1)}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-inverse transition-[transform,opacity] duration-200 hover:scale-105 active:scale-90 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronDown className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul className="relative space-y-8 sm:space-y-12 lg:space-y-16">
          {achievements.map((achievement, index) => {
            const Icon = icons[index % icons.length];
            const alignStart = index % 2 === 0;
            const state =
              index < active
                ? "passed"
                : index === active
                  ? "current"
                  : "upcoming";

            return (
              <li
                key={`${achievement.title}-${index}`}
                data-item=""
                data-state={state}
                className="group/item relative grid min-h-[260px] grid-cols-[3.5rem_1fr] items-center md:min-h-[320px] md:grid-cols-2"
              >
                {/* Node: mobile = first column (road on the inline-start side); desktop = the column opposite the card */}
                <span
                  aria-hidden="true"
                  data-node=""
                  className={`relative z-20 col-start-1 row-start-1 flex size-12 items-center justify-center justify-self-center rounded-full border-[5px] border-background transition-[transform,background-color,color,box-shadow] duration-500 group-hover/item:scale-110 md:size-[68px] md:border-[6px] ${
                    alignStart ? "md:col-start-2" : "md:col-start-1"
                  } ${nodeStyles[state]}`}
                >
                  {state === "current" ? (
                    <span className="absolute -inset-1 rounded-full border-2 border-accent opacity-50 motion-safe:animate-ping" />
                  ) : null}
                  <Icon className="size-5 md:size-7" strokeWidth={2.1} />
                </span>

                <AchievementCard
                  achievement={achievement}
                  Icon={Icon}
                  index={index}
                  demoLabel={t("achievementDemoLabel")}
                  alignStart={alignStart}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </AboutSection>
  );
}

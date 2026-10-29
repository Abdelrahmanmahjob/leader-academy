"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check, Clock3, Dumbbell, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";

type ClassSession = {
  time: string;
  title: string;
  track: string;
};

type ScheduleDay = {
  id: string;
  label: string;
  name: string;
  sessions: ClassSession[];
};

type WeeklyStat = {
  value: string;
  label: string;
};

type LaneTone = "accent" | "amber" | "blue";

type BoardLane = {
  id: string;
  title: string;
  subtitle: string;
  tone: LaneTone;
  icon: typeof Clock3;
  sessions: ClassSession[];
};

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

const laneStyles: Record<
  LaneTone,
  { dot: string; soft: string; border: string; text: string }
> = {
  accent: {
    dot: "bg-accent",
    soft: "bg-accent/10",
    border: "border-accent/25",
    text: "text-accent",
  },
  amber: {
    dot: "bg-amber-300",
    soft: "bg-amber-300/10",
    border: "border-amber-300/25",
    text: "text-amber-200",
  },
  blue: {
    dot: "bg-sky-300",
    soft: "bg-sky-300/10",
    border: "border-sky-300/25",
    text: "text-sky-200",
  },
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function WeeklyClassesSection() {
  const t = useTranslations("home.weeklyClasses");
  const days = t.raw("days") as ScheduleDay[];
  const stats = t.raw("stats") as WeeklyStat[];
  const [selectedDay, setSelectedDay] = useState(days[0]?.id ?? "");
  const activeDay = days.find((day) => day.id === selectedDay) ?? days[0];
  const sectionRef = useRef<HTMLElement>(null);

  const sessions = activeDay?.sessions ?? [];
  const rotate = (offset: number) =>
    sessions
      .map((_, index) => sessions[(index + offset) % sessions.length])
      .filter(Boolean);
  const lanes: BoardLane[] = [
    {
      id: "upcoming",
      title: "Upcoming",
      subtitle: "Next on the pitch",
      tone: "blue",
      icon: Clock3,
      sessions: rotate(0),
    },
    {
      id: "training",
      title: "In training",
      subtitle: "Happening this week",
      tone: "amber",
      icon: Dumbbell,
      sessions: rotate(1),
    },
    {
      id: "completed",
      title: "Completed",
      subtitle: "Built on consistency",
      tone: "accent",
      icon: Check,
      sessions: rotate(2),
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".weekly-copy, .weekly-stat",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          ".weekly-board",
          { autoAlpha: 0, x: 36, scale: 0.97 },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.fromTo(
        ".weekly-session",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reducedMotion ? 0 : 0.42,
          stagger: reducedMotion ? 0 : 0.06,
          ease: "power2.out",
        },
      );
    },
    { scope: sectionRef, dependencies: [selectedDay], revertOnUpdate: true },
  );

  if (!activeDay) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="weekly-classes-title"
      className="relative isolate overflow-hidden border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-32 top-1/4 -z-10 size-[32rem] rounded-full bg-accent/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 bottom-0 -z-10 size-80 rounded-full bg-sky-400/5 blur-3xl"
      />

      <div
        className={`${shell} grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16`}
      >
        <div className="weekly-copy">
          <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {t("eyebrow")}
          </p>
          <h2
            id="weekly-classes-title"
            className="max-w-xl text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.05em] text-foreground rtl:leading-[1.2] rtl:tracking-normal"
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
            {t("description")}
          </p>

          <ul className="mt-9 grid max-w-lg grid-cols-3 border-t border-border pt-6 sm:mt-12">
            {stats.map((stat) => (
              <li key={stat.label} className="weekly-stat pe-3">
                <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-foreground/55 sm:text-sm">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="weekly-board glass-panel relative overflow-hidden rounded-[28px] p-4 sm:p-6">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45 rtl:tracking-normal">
                {t("boardEyebrow")}
              </p>
              <h3 className="mt-2 text-lg font-extrabold text-foreground sm:text-xl">
                {activeDay.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-2 text-xs font-bold text-accent">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Live schedule
            </div>
          </div>

          <div
            className="relative z-10 mt-6 grid grid-cols-7 gap-1.5 border-y border-border py-4 sm:gap-2"
            aria-label={t("chooseDay")}
          >
            {days.map((day) => {
              const isSelected = day.id === activeDay.id;
              return (
                <button
                  key={day.id}
                  type="button"
                  aria-label={day.name}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDay(day.id)}
                  className={`group/day flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition duration-300 sm:min-h-16 sm:text-xs ${isSelected ? "bg-accent text-inverse shadow-[0_8px_24px_color-mix(in_srgb,var(--la-accent)_24%,transparent)]" : "text-foreground/50 hover:bg-hover hover:text-foreground"}`}
                >
                  <span>{day.label}</span>
                  <span
                    aria-hidden="true"
                    className={`size-1 rounded-full transition-colors ${isSelected ? "bg-inverse" : "bg-accent/40 group-hover/day:bg-accent"}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-3">
            {lanes.map((lane, laneIndex) => {
              const tone = laneStyles[lane.tone];
              const Icon = lane.icon;
              const tickerSessions = [...lane.sessions, ...lane.sessions];
              return (
                <div
                  key={lane.id}
                  className="weekly-lane min-w-0 overflow-hidden rounded-2xl border border-border bg-background/45 p-2.5"
                  style={
                    {
                      "--lane-delay": `${laneIndex * -2.2}s`,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center justify-between gap-2 px-1.5 pb-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${tone.soft} ${tone.text}`}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-foreground">
                          {lane.title}
                        </p>
                        <p className="truncate text-[9px] text-foreground/40">
                          {lane.subtitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`size-1.5 shrink-0 rounded-full ${tone.dot}`}
                    />
                  </div>

                  <div className="weekly-ticker-mask relative max-h-[18.5rem] overflow-hidden rounded-xl">
                    <div
                      className="weekly-ticker space-y-2"
                      key={`${activeDay.id}-${lane.id}`}
                    >
                      {tickerSessions.map((session, index) => (
                        <article
                          key={`${lane.id}-${session.time}-${index}`}
                          className="weekly-session group/session relative overflow-hidden rounded-xl border border-border-strong/70 bg-surface/80 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised"
                        >
                          <div
                            aria-hidden="true"
                            className={`absolute inset-y-3 start-0 w-0.5 origin-center scale-y-0 ${tone.dot} transition-transform duration-300 group-hover/session:scale-y-100`}
                          />
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`flex items-center gap-1.5 text-[10px] font-bold tabular-nums ${tone.text}`}
                            >
                              <Clock3 className="size-3" aria-hidden="true" />
                              {session.time}
                            </span>
                            <span className="text-[9px] font-bold tracking-widest text-foreground/25">
                              {String(
                                (index % lane.sessions.length) + 1,
                              ).padStart(2, "0")}
                            </span>
                          </div>
                          <h4 className="mt-3 min-h-10 text-xs font-extrabold leading-5 text-foreground sm:text-sm">
                            {session.title}
                          </h4>
                          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/40 rtl:tracking-normal">
                            <Sparkles
                              className="size-3 text-accent/70"
                              aria-hidden="true"
                            />
                            {session.track}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-foreground/45">{t("boardNote")}</p>
            <Link
              href="/timetable"
              className={buttonVariants({
                variant: "glass",
                size: "sm",
                className: "min-h-10 rounded-full! px-4!",
              })}
            >
              {t("viewSchedule")}
              <ArrowUpRight
                className="size-4 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .weekly-ticker {
          animation: weekly-ticker-loop 18s linear infinite;
          animation-delay: var(--lane-delay, 0s);
          will-change: transform;
        }

        .weekly-ticker-mask::before,
        .weekly-ticker-mask::after {
          content: "";
          position: absolute;
          inset-inline: 0;
          z-index: 2;
          height: 24px;
          pointer-events: none;
        }

        .weekly-ticker-mask::before {
          top: 0;
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--la-background) 92%, transparent),
            transparent
          );
        }

        .weekly-ticker-mask::after {
          bottom: 0;
          background: linear-gradient(
            to top,
            color-mix(in srgb, var(--la-background) 92%, transparent),
            transparent
          );
        }

        @keyframes weekly-ticker-loop {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-50% - 0.5rem));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .weekly-ticker {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

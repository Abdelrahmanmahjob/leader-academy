"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { type LucideIcon } from "lucide-react";
import { gsap } from "./shared/Motion";

export type Achievement = {
  category: string;
  title: string;
  description: string;
  highlight: string;
  image: string;
  imageAlt: string;
  sample?: boolean;
};

type AchievementCardProps = {
  achievement: Achievement;
  Icon: LucideIcon;
  index: number;
  demoLabel: string;
  /** Even cards sit on the inline-start side, odd cards on the inline-end side (desktop). */
  alignStart: boolean;
};

const TILT_DEG = 4;
const SHIFT_PX = 14;

export function AchievementCard({
  achievement,
  Icon,
  index,
  demoLabel,
  alignStart,
}: AchievementCardProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  // Pointer tilt, photo shift and moving glare. Mouse/trackpad only, never with reduced motion.
  // Runs on the inner stage so it never fights the scroll-reveal transform on the wrapper.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const shift = stage.querySelector<HTMLElement>("[data-card-shift]");
    if (!shift) return;

    gsap.set(stage, { transformPerspective: 1000 });
    const opts = { duration: 0.6, ease: "power3.out" } as const;
    const rotateX = gsap.quickTo(stage, "rotationX", opts);
    const rotateY = gsap.quickTo(stage, "rotationY", opts);
    const shiftX = gsap.quickTo(shift, "x", opts);
    const shiftY = gsap.quickTo(shift, "y", opts);

    function onMove(event: PointerEvent) {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY(nx * TILT_DEG * 2);
      rotateX(-ny * TILT_DEG * 2);
      shiftX(-nx * SHIFT_PX);
      shiftY(-ny * SHIFT_PX);
      stage.style.setProperty("--glare-x", `${(nx + 0.5) * 100}%`);
      stage.style.setProperty("--glare-y", `${(ny + 0.5) * 100}%`);
    }

    function onLeave() {
      rotateX(0);
      rotateY(0);
      shiftX(0);
      shiftY(0);
    }

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([stage, shift]);
      gsap.set([stage, shift], { clearProps: "transform" });
    };
  }, []);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  // Touch + mouse press feedback: a light bursts from the exact point you tapped.
  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    stage.style.setProperty("--glare-x", `${event.clientX - rect.left}px`);
    stage.style.setProperty("--glare-y", `${event.clientY - rect.top}px`);
    stage.dataset.flash = "true";
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => {
      delete stage.dataset.flash;
    }, 450);
    if (event.pointerType === "touch") navigator.vibrate?.(8);
  }

  return (
    <article
      data-achievement-card=""
      className={`col-start-2 row-start-1 w-full md:w-[92%] ${
        alignStart
          ? "md:col-start-1 md:justify-self-start"
          : "md:col-start-2 md:justify-self-end"
      }`}
    >
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        className="group/stage relative grid overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_18px_48px_-32px_color-mix(in_srgb,var(--la-inverse)_75%,transparent)] transition-[border-color,box-shadow] duration-500 hover:border-accent/50 active:border-accent/70 group-data-[state=current]/item:border-accent/60 group-data-[state=current]/item:shadow-[0_28px_64px_-28px_color-mix(in_srgb,var(--la-accent)_38%,transparent)] sm:grid-cols-[150px_1fr] lg:min-h-[270px] lg:grid-cols-[minmax(130px,0.75fr)_1fr] motion-reduce:transition-none"
      >
        {/* Media: scroll parallax layer (data-card-image) > pointer shift layer (data-card-shift) */}
        <div className="relative min-h-[150px] overflow-hidden sm:min-h-full">
          <div
            data-card-image
            className="absolute inset-x-0 -inset-y-[10%] will-change-transform"
          >
            <div
              data-card-shift
              className="absolute inset-0 scale-110 will-change-transform"
            >
              <Image
                src={achievement.image}
                alt={achievement.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 150px, 20vw"
                className="object-cover object-top transition-[transform,filter] duration-700 group-hover/stage:scale-105 group-data-[state=upcoming]/item:saturate-50 motion-reduce:transition-none"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent sm:bg-linear-to-r" />
          <span className="absolute bottom-3 start-3 flex size-10 items-center justify-center rounded-full border border-foreground/25 bg-background/70 text-accent shadow-lg sm:bottom-auto sm:top-3">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-col justify-center p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-accent rtl:text-xs rtl:tracking-normal rtl:normal-case">
              {achievement.category}
            </p>
            {achievement.sample ? (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[0.6rem] font-bold text-accent">
                {demoLabel}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-xl font-extrabold leading-snug text-foreground lg:text-2xl rtl:leading-snug">
            {achievement.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-foreground/70">
            {achievement.description}
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-extrabold text-accent">
            <Icon className="size-4" aria-hidden="true" />
            {achievement.highlight}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute end-5 top-5 text-5xl font-extrabold leading-none text-foreground/[.07]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Light that follows the cursor and bursts from a tap */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_var(--glare-x,50%)_var(--glare-y,0%),color-mix(in_srgb,var(--la-foreground)_16%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/stage:opacity-100 group-data-[flash=true]/stage:opacity-100"
        />
      </div>
    </article>
  );
}

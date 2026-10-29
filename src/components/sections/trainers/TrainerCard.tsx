"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";

type TrainerCardProps = {
  image: string;
  name: string;
  role: string;
  index: number;
  priority?: boolean;
};

const TILT_DEG = 7;
const SHIFT_PX = 20;

export function TrainerCard({
  image,
  name,
  role,
  index,
  priority = false,
}: TrainerCardProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer tilt + photo parallax + moving glare. Fine pointers only, never with reduced motion.
  // Runs on the inner stage, so it never fights the section's own data-reveal transform on the <li>.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = stage.querySelector<HTMLElement>("[data-media]");
    if (!media) return;

    gsap.set(stage, { transformPerspective: 900 });
    const opts = { duration: 0.6, ease: "power3.out" } as const;
    const rotateX = gsap.quickTo(stage, "rotationX", opts);
    const rotateY = gsap.quickTo(stage, "rotationY", opts);
    const shiftX = gsap.quickTo(media, "x", opts);
    const shiftY = gsap.quickTo(media, "y", opts);

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
      gsap.killTweensOf([stage, media]);
      gsap.set([stage, media], { clearProps: "transform" });
    };
  }, []);

  return (
    <li data-reveal="">
      <div
        ref={stageRef}
        className="group relative h-full min-h-[430px] overflow-hidden rounded-[24px] border border-border bg-surface transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_32px_64px_-28px_color-mix(in_srgb,var(--la-inverse)_90%,transparent)] sm:min-h-[500px]"
      >
        {/* Oversized so the parallax shift never exposes an edge */}
        <div data-media className="absolute -inset-[6%] will-change-transform">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
            priority={priority}
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />

        {/* Light that follows the cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(320px_circle_at_var(--glare-x,50%)_var(--glare-y,0%),color-mix(in_srgb,var(--la-foreground)_14%,transparent),transparent_70%)]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute start-5 top-4 text-6xl font-extrabold leading-none text-foreground/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-3 bottom-3">
          <GlassCard className="rounded-[18px] p-4 transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none">
            <span
              aria-hidden="true"
              className="block h-0.5 w-8 rounded-full bg-accent transition-[width] duration-500 group-hover:w-16 motion-reduce:transition-none"
            />
            <h2 className="mt-3 text-xl font-extrabold text-foreground">
              {name}
            </h2>
            <p className="mt-1 text-sm text-foreground/70">{role}</p>
          </GlassCard>
        </div>
      </div>
    </li>
  );
}

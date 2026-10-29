"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { useParallax, useReveal } from "./shared/Motion";

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";

interface AboutSectionProps extends ComponentPropsWithoutRef<"section"> {
  glow?: "start" | "end" | false;
  containerClassName?: string;
}

/** Shared section frame: spacing, border, ambient glow, reveal + parallax wiring. */
export function AboutSection({
  glow = "start",
  className,
  containerClassName,
  children,
  ...props
}: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useParallax(ref);

  return (
    <section
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden border-b border-border bg-background py-16 sm:py-20 lg:py-24",
        className,
      )}
      {...props}
    >
      {glow ? <AmbientGlow side={glow} /> : null}
      <div className={cn(SHELL, containerClassName)}>{children}</div>
    </section>
  );
}

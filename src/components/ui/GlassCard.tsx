"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { trackGlassPointer } from "@/components/sections/about/shared/Glass";

type GlassCardProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "li" | "article";
  /** Adds the lift + accent border on hover (pointer devices only). */
  interactive?: boolean;
};

/** Liquid-glass surface (.glass-panel) with a pointer-following specular light. */
export function GlassCard({
  //   as: Tag = "div",
  interactive = false,
  className,
  onPointerMove,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[24px]",
        interactive &&
          "transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
      onPointerMove={(e) => {
        trackGlassPointer(e);
        onPointerMove?.(e);
      }}
      {...props}
    />
  );
}

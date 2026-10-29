"use client";

import { useEffect, type RefObject } from "react";

/**
 * Feeds pointer coordinates to a `.glass-panel` as --glass-x / --glass-y so the
 * CSS specular highlight can follow the cursor. Fine pointers only, skipped
 * for reduced motion. Pure CSS does the painting; no per-frame GSAP work.
 */
export function useGlassSheen<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!canHover || reduced) return;

    function onMove(event: PointerEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
    }

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, [ref]);
}

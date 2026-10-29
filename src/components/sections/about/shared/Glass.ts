import type { PointerEvent } from "react";

/**
 * Feeds --glass-x / --glass-y (used by .glass-panel / .glass-button ::before)
 * so the specular light follows the mouse. Touch/pen are ignored.
 * If your existing `useGlassSheen` does the same, swap this in.
 */
export function trackGlassPointer(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--glass-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--glass-y", `${e.clientY - rect.top}px`);
}

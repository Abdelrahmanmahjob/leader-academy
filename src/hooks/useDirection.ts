"use client";

import { useLocale } from "next-intl";

const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

/**
 * Single place for locale -> writing direction.
 *
 * `flip` is +1 in LTR and -1 in RTL. Multiply any physical x offset by it:
 *   - enter from the inline-START side:  x: -flip * distance
 *   - enter from the inline-END side:    x:  flip * distance
 */
export function useDirection() {
  const locale = useLocale();
  const isRtl = RTL_LANGUAGES.has(locale.split("-")[0]);
  return { isRtl, dir: isRtl ? "rtl" : "ltr", flip: isRtl ? -1 : 1 } as const;
}

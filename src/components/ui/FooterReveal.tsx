"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "../sections/about/shared/Motion";

/** Single orchestrated entrance for the footer: every [data-reveal] child, one ScrollTrigger. */
export function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, "top 92%");
  return <div ref={ref}>{children}</div>;
}

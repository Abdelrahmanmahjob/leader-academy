import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  /** Logical side: "start" = left in LTR, right in RTL. */
  side?: "start" | "end";
  className?: string;
}

/** Faint accent light behind a section so the glass above it has something to refract. Parent needs `relative isolate`. */
export function AmbientGlow({ side = "start", className }: AmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        side === "start"
          ? "[--glow-x:0%] rtl:[--glow-x:100%]"
          : "[--glow-x:100%] rtl:[--glow-x:0%]",
        className,
      )}
      style={{
        background:
          "radial-gradient(55% 60% at var(--glow-x) 0%, color-mix(in srgb, var(--la-accent) 9%, transparent), transparent 70%)",
      }}
    />
  );
}

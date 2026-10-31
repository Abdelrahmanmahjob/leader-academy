import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  id?: string;
  eyebrow?: string;
  description?: string;
  as?: "h1" | "h2";
  size?: "hero" | "section";
  align?: "start" | "center";
  /** Entrance origin (logical). `false` = parent handles the reveal. */
  reveal?: "up" | "start" | "end" | false;
  className?: string;
}

const sizes = {
  hero: "text-[clamp(2.5rem,6vw,3.5rem)] leading-[.98] tracking-[-0.05em] rtl:leading-[1.2]",
  section:
    "text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.04em] rtl:leading-[1.3]",
} as const;

export function SectionHeading({
  title,
  id,
  eyebrow,
  description,
  as: Heading = "h2",
  size = "section",
  align = "start",
  reveal = "up",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      data-reveal={reveal === "up" ? "" : reveal || undefined}
      className={cn(centered && "text-center", className)}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal",
            centered && "justify-center",
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          "font-extrabold uppercase text-foreground rtl:tracking-normal",
          sizes[size],
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

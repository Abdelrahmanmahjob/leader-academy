"use client";

type PathAudience = "men" | "women";

type PathAudienceToggleProps = {
  value: PathAudience;
  onChange: (value: PathAudience) => void;
  menLabel: string;
  womenLabel: string;
  label: string;
};

export function PathAudienceToggle({
  value,
  onChange,
  menLabel,
  womenLabel,
  label,
}: PathAudienceToggleProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="glass-panel mx-auto inline-flex rounded-full p-1.5"
    >
      {(["men", "women"] as const).map((audience) => {
        const selected = audience === value;
        return (
          <button
            key={audience}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(audience)}
            className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
              selected
                ? "bg-accent text-inverse"
                : "text-foreground/75 hover:text-foreground"
            }`}
          >
            {audience === "men" ? menLabel : womenLabel}
          </button>
        );
      })}
    </div>
  );
}

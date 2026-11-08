"use client";

type PathAudience = "men" | "women";

type PathAudienceToggleProps = {
  value: PathAudience;
  onChange: (value: PathAudience) => void;
  menLabel: string;
  womenLabel: string;
  label: string;
  equalSize?: boolean;
};

export function PathAudienceToggle({
  value,
  onChange,
  menLabel,
  womenLabel,
  label,
  equalSize = false,
}: PathAudienceToggleProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`glass-panel inline-flex rounded-full p-1.5 ${equalSize ? "h-14 w-56" : ""}`}
    >
      {(["men", "women"] as const).map((audience) => {
        const selected = audience === value;
        return (
          <button
            key={audience}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(audience)}
            className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${equalSize ? "flex-1" : ""} ${
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

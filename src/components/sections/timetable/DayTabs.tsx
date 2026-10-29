"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";
import gsap from "gsap";
// Adjust this path to wherever you placed useDirection.ts
import { useDirection } from "@/hooks/useDirection";
import { PANEL_ID, tabId } from "@/content/TimeTableData";

type DayTab = { id: string; label: string; isToday: boolean };

type DayTabsProps = {
  days: readonly DayTab[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  todayLabel: string;
};

export function DayTabs({
  days,
  value,
  onChange,
  label,
  todayLabel,
}: DayTabsProps) {
  const { flip } = useDirection();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const placed = useRef(false);

  // Slide the indicator under the active tab. offsetLeft is physical, so this is correct in RTL too.
  const place = useCallback(
    (animate: boolean) => {
      const tab = tabRefs.current.get(value);
      const indicator = indicatorRef.current;
      if (!tab || !indicator) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const vars = { x: tab.offsetLeft, width: tab.offsetWidth };

      if (animate && placed.current && !reduce) {
        gsap.to(indicator, {
          ...vars,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
        tab.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: "smooth",
        });
      } else {
        gsap.set(indicator, vars);
      }
      placed.current = true;
    },
    [value],
  );

  useEffect(() => {
    place(true);
  }, [place]);

  // Re-measure when the tabs resize (fonts loading, viewport changes, locale switch).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => place(false));
    observer.observe(list);
    return () => observer.disconnect();
  }, [place]);

  useEffect(() => {
    const indicator = indicatorRef.current;
    return () => {
      if (indicator) gsap.killTweensOf(indicator);
    };
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = days.findIndex((day) => day.id === value);
    let next = index;

    // Arrow keys follow the VISUAL direction: ArrowRight moves right, which is "previous" in RTL.
    if (event.key === "ArrowRight") next = index + flip;
    else if (event.key === "ArrowLeft") next = index - flip;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else return;

    event.preventDefault();
    const target = days[(next + days.length) % days.length];
    tabRefs.current.get(target.id)?.focus();
    onChange(target.id);
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="glass-panel relative inline-flex w-max items-center gap-1 rounded-full p-1.5"
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="absolute bottom-1.5 left-0 top-1.5 w-0 rounded-full bg-accent shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--la-accent)_70%,transparent)]"
        />

        {days.map((day) => {
          const selected = day.id === value;
          return (
            <button
              key={day.id}
              ref={(node) => {
                if (node) tabRefs.current.set(day.id, node);
                else tabRefs.current.delete(day.id);
              }}
              id={tabId(day.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={PANEL_ID}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(day.id)}
              className={`relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition-colors duration-300 ${
                selected
                  ? "text-inverse"
                  : "text-foreground/75 hover:text-foreground"
              }`}
            >
              {day.label}
              {day.isToday ? (
                <>
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full transition-colors duration-300 ${selected ? "bg-inverse" : "bg-accent"}`}
                  />
                  <span className="sr-only">{todayLabel}</span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

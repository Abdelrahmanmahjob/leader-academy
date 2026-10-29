"use client";

import { useRef } from "react";
import {
  Clock,
  Dumbbell,
  HeartPulse,
  PersonStanding,
  type LucideIcon,
} from "lucide-react";
import { useGlassSheen } from "@/hooks/useGlassSheen";
import type { ClassType } from "@/content/TimeTableData";

const typeIcons: Record<ClassType, LucideIcon> = {
  strength: Dumbbell,
  mobility: PersonStanding,
  cardio: HeartPulse,
};

type ClassCardProps = {
  index: number;
  type: ClassType;
  /** 24h value for the machine-readable <time dateTime>. */
  dateTime: string;
  /** Localized, human-readable time. */
  timeLabel: string;
  name: string;
  duration: string;
};

export function ClassCard({
  index,
  type,
  dateTime,
  timeLabel,
  name,
  duration,
}: ClassCardProps) {
  const ref = useRef<HTMLElement>(null);
  const Icon = typeIcons[type];
  useGlassSheen(ref);

  return (
    <article
      ref={ref}
      className="timetable-card group glass-panel relative flex min-h-[15rem] flex-col rounded-3xl p-6 transition-[translate,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/50"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-inverse">
          <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span
          aria-hidden="true"
          className="text-sm font-extrabold tracking-widest text-foreground/25"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <time
        dateTime={dateTime}
        className="mt-auto block pt-10 text-4xl font-extrabold tabular-nums text-foreground"
      >
        <bdi>{timeLabel}</bdi>
      </time>
      <h3 className="mt-2 text-xl font-extrabold uppercase text-foreground rtl:normal-case">
        {name}
      </h3>
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <Clock className="size-4" aria-hidden="true" />
        {duration}
      </p>
    </article>
  );
}

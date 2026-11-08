"use client";

import { useRef } from "react";
import {
  Clock,
  Goal,
  type LucideIcon,
} from "lucide-react";
import { useGlassSheen } from "@/hooks/useGlassSheen";
import { AgeGroupList } from "@/components/ui/AgeGroupList";
import type { AgeGroup } from "@/content/ageGroups";
import type { ClassType } from "@/content/TimeTableData";

const typeIcons: Record<ClassType, LucideIcon> = {
  strength: Goal,
  mobility: Goal,
  cardio: Goal,
  football: Goal,
};

type ClassCardProps = {
  pathId: string;
  index: number;
  type: ClassType;
  /** 24h value for the machine-readable <time dateTime>. */
  dateTime: string;
  /** Localized, human-readable time. */
  timeLabel: string;
  name: string;
  duration: string;
  ageGroups: readonly AgeGroup[];
  detailsHref?: string;
  detailsLabel?: string;
};

export function ClassCard({
  pathId,
  index,
  type,
  dateTime,
  timeLabel,
  name,
  duration,
  ageGroups,
}: ClassCardProps) {
  const ref = useRef<HTMLElement>(null);
  const Icon = typeIcons[type];
  useGlassSheen(ref);

  return (
    <article
      ref={ref}
      data-path-id={pathId}
      className={`timetable-card group glass-panel relative flex ${type === "football" ? "min-h-[19rem] text-white" : "min-h-[15rem]"} flex-col overflow-hidden rounded-3xl p-6 transition-[translate,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/50`}
    >
      <div className="relative z-10 flex h-full min-h-[15rem] flex-col">
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-inverse">
            <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span
            aria-hidden="true"
            className={`text-sm font-extrabold tracking-widest ${type === "football" ? "text-white/55" : "text-foreground/25"}`}
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
        <p
          className={`mt-3 flex items-center gap-2 text-sm ${type === "football" ? "text-white/75" : "text-muted"}`}
        >
          <Clock className="size-4" aria-hidden="true" />
          {duration}
        </p>
        <AgeGroupList
          ageGroups={ageGroups}
          className={`mt-2 ${type === "football" ? "text-white/75" : ""}`}
        />
      </div>
    </article>
  );
}

"use client";

import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useDirection } from "@/hooks/useDirection";
import { ClassCard } from "./ClassCard";
import { DayTabs } from "./DayTabs";
import { PANEL_ID, tabId, timetable } from "@/content/TimeTableData";
import { createFormatters } from "./TimeTableFormat";

gsap.registerPlugin(useGSAP);

function getSaturdayStart(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 1) % 7));
  return start;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function subscribeToDateChanges() {
  return () => {};
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

export function TimetableSection() {
  const t = useTranslations("timetablePage");
  const locale = useLocale();
  const { flip } = useDirection();
  const format = useMemo(() => createFormatters(locale), [locale]);

  const [dayId, setDayId] = useState(timetable[0].id);
  const [weekOffset, setWeekOffset] = useState(0);
  const currentDateKey = useSyncExternalStore(
    subscribeToDateChanges,
    getLocalDateKey,
    () => "",
  );
  const currentDate = currentDateKey
    ? new Date(`${currentDateKey}T00:00:00`)
    : null;
  const weekStart = currentDate ? getSaturdayStart(currentDate) : null;
  const todayId = currentDate
    ? (timetable.find((item) => item.weekday === currentDate.getDay())?.id ??
      null)
    : null;

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(0);

  // Page entrance.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".timetable-intro > *",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".timetable-tabs",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power3.out" },
        );
      });
    },
    { scope: rootRef },
  );

  // Day change: cards slide in from the side the new day lies on (later day = from the inline-end side).
  useGSAP(
    () => {
      const index = timetable.findIndex((day) => day.id === dayId);
      const direction = index >= previousIndex.current ? 1 : -1;
      previousIndex.current = index;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".timetable-day",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
        gsap.fromTo(
          ".timetable-card",
          { autoAlpha: 0, x: flip * direction * 36, y: 12 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            delay: 0.05,
            ease: "power3.out",
          },
        );
      });
    },
    { scope: panelRef, dependencies: [dayId, flip] },
  );

  const day = timetable.find((item) => item.id === dayId) ?? timetable[0];
  const currentWeekStart = weekStart
    ? addDays(weekStart, weekOffset * 7)
    : null;
  const dayIndex = timetable.findIndex((item) => item.id === day.id);
  const selectedDate = currentWeekStart
    ? addDays(currentWeekStart, dayIndex)
    : null;
  const weekEnd = currentWeekStart ? addDays(currentWeekStart, 6) : null;
  const tabs = timetable.map((item, index) => ({
    id: item.id,
    label: currentWeekStart
      ? `${format.weekdayShort(item.weekday)} ${format.date(addDays(currentWeekStart, index))}`
      : format.weekdayShort(item.weekday),
    isToday: weekOffset === 0 && item.id === todayId,
  }));

  return (
    <Section className="pt-25 sm:pt-35">
      <Container>
        <div ref={rootRef}>
          <div className="timetable-intro mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:text-sm rtl:tracking-normal rtl:normal-case">
              {t("eyebrow")}
            </p>
            <h1 className="text-section-heading font-extrabold uppercase rtl:leading-[1.3] rtl:normal-case">
              {t("title")}
            </h1>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p
              className="text-sm font-semibold text-foreground/70"
              aria-live="polite"
            >
              {currentWeekStart && weekEnd
                ? format.dateRange(currentWeekStart, weekEnd)
                : null}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t("previousWeek")}
                disabled={!weekStart}
                onClick={() => setWeekOffset((offset) => offset - 1)}
                className="glass-panel inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {flip === 1 ? (
                  <ChevronLeft className="size-5" aria-hidden="true" />
                ) : (
                  <ChevronRight className="size-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                aria-label={t("nextWeek")}
                disabled={!weekStart}
                onClick={() => setWeekOffset((offset) => offset + 1)}
                className="glass-panel inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {flip === 1 ? (
                  <ChevronRight className="size-5" aria-hidden="true" />
                ) : (
                  <ChevronLeft className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="timetable-tabs">
            <DayTabs
              days={tabs}
              value={dayId}
              onChange={setDayId}
              label={t("daysLabel")}
              todayLabel={t("today")}
            />
          </div>

          <div
            ref={panelRef}
            id={PANEL_ID}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={tabId(day.id)}
            className="mt-8 rounded-3xl outline-offset-8"
          >
            <h2 className="timetable-day mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-accent rtl:text-base rtl:tracking-normal rtl:normal-case">
              {selectedDate
                ? format.selectedDate(selectedDate)
                : format.weekdayLong(day.weekday)}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {day.sessions.map((session, index) => (
                <ClassCard
                  key={`${day.id}-${session.time}`}
                  index={index}
                  type={session.type}
                  dateTime={session.time}
                  timeLabel={format.time(session.time)}
                  name={t(`classes.${session.type}`)}
                  duration={t("duration")}
                  detailsHref={
                    session.type === "football" ? "/services/football" : undefined
                  }
                  detailsLabel={
                    session.type === "football"
                      ? t("classes.viewFootballProgram")
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

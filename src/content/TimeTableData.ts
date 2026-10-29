export type ClassType = "strength" | "mobility" | "cardio";
export type Session = { time: string; type: ClassType };
export type TimetableDay = {
  id: string;
  /** 0 = Sunday ... 6 = Saturday (same as Date#getDay). Used for localized day names and "today". */
  weekday: number;
  sessions: readonly Session[];
};

export const PANEL_ID = "timetable-panel";
export const tabId = (dayId: string) => `timetable-tab-${dayId}`;

const strengthDay: Session[] = [
  { time: "08:00", type: "strength" },
  { time: "10:00", type: "mobility" },
  { time: "18:00", type: "cardio" },
];
const cardioDay: Session[] = [
  { time: "07:30", type: "cardio" },
  { time: "12:00", type: "strength" },
  { time: "19:00", type: "mobility" },
];
const mobilityDay: Session[] = [
  { time: "09:00", type: "mobility" },
  { time: "17:00", type: "strength" },
  { time: "20:00", type: "cardio" },
];

// Saturday-first week, no Friday (same as the original schedule).
export const timetable: readonly TimetableDay[] = [
  { id: "sat", weekday: 6, sessions: strengthDay },
  { id: "sun", weekday: 0, sessions: cardioDay },
  { id: "mon", weekday: 1, sessions: mobilityDay },
  { id: "tue", weekday: 2, sessions: strengthDay },
  { id: "wed", weekday: 3, sessions: cardioDay },
  { id: "thu", weekday: 4, sessions: mobilityDay },
];

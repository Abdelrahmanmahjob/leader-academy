export type ClassType = "strength" | "mobility" | "cardio" | "football";
export type Session = { time: string; type: ClassType };
export type TimetableDay = {
  id: string;
  /** 0 = Sunday ... 6 = Saturday (same as Date#getDay). Used for localized day names and "today". */
  weekday: number;
  sessions: readonly Session[];
};

export const PANEL_ID = "timetable-panel";
export const tabId = (dayId: string) => `timetable-tab-${dayId}`;

export const timetable: readonly TimetableDay[] = [
  {
    id: "sat",
    weekday: 6,
    sessions: [
      { time: "06:00", type: "strength" },
      { time: "17:30", type: "cardio" },
      { time: "19:00", type: "mobility" },
      { time: "20:00", type: "football" },
    ],
  },
  {
    id: "sun",
    weekday: 0,
    sessions: [
      { time: "07:00", type: "strength" },
      { time: "18:00", type: "cardio" },
      { time: "19:30", type: "mobility" },
      { time: "20:30", type: "football" },
    ],
  },
  {
    id: "mon",
    weekday: 1,
    sessions: [
      { time: "06:30", type: "strength" },
      { time: "17:30", type: "cardio" },
      { time: "19:00", type: "mobility" },
      { time: "20:00", type: "football" },
    ],
  },
  {
    id: "tue",
    weekday: 2,
    sessions: [
      { time: "07:00", type: "strength" },
      { time: "18:00", type: "cardio" },
      { time: "19:30", type: "mobility" },
      { time: "20:30", type: "football" },
    ],
  },
  {
    id: "wed",
    weekday: 3,
    sessions: [
      { time: "06:00", type: "strength" },
      { time: "17:30", type: "cardio" },
      { time: "19:00", type: "mobility" },
      { time: "20:00", type: "football" },
    ],
  },
  {
    id: "thu",
    weekday: 4,
    sessions: [
      { time: "07:00", type: "strength" },
      { time: "18:00", type: "cardio" },
      { time: "19:30", type: "mobility" },
      { time: "20:30", type: "football" },
    ],
  },
  {
    id: "fri",
    weekday: 5,
    sessions: [
      { time: "08:00", type: "strength" },
      { time: "16:30", type: "cardio" },
      { time: "18:00", type: "mobility" },
      { time: "19:00", type: "football" },
    ],
  },
];

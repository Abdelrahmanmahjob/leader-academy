export function createFormatters(locale: string) {
  const tag = `${locale}-u-nu-latn`;
  const weekdayShort = new Intl.DateTimeFormat(tag, {
    weekday: "short",
    timeZone: "UTC",
  });
  const weekdayLong = new Intl.DateTimeFormat(tag, {
    weekday: "long",
    timeZone: "UTC",
  });
  const time = new Intl.DateTimeFormat(tag, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
  const date = new Intl.DateTimeFormat(tag, {
    month: "short",
    day: "numeric",
  });
  const selectedDate = new Intl.DateTimeFormat(tag, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const day = (weekday: number) => new Date(Date.UTC(2024, 0, 7 + weekday));

  return {
    weekdayShort: (weekday: number) => weekdayShort.format(day(weekday)),
    weekdayLong: (weekday: number) => weekdayLong.format(day(weekday)),
    date: (value: Date) => date.format(value),
    dateRange: (start: Date, end: Date) =>
      `${date.format(start)} – ${date.format(end)}`,
    selectedDate: (value: Date) => selectedDate.format(value),
    time: (hhmm: string) => {
      const [hours, minutes] = hhmm.split(":").map(Number);
      return time.format(new Date(Date.UTC(2024, 0, 1, hours, minutes)));
    },
  };
}

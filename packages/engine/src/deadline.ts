// Deadline computation after the counting rules in datenmodell.md 2.3. Never a global
// "date plus X": the rule supplies interval, unit, counting start and weekend rule, the
// caller supplies the event date and the holiday list.

import { addDays, addMonths, weekday, type IsoDate } from "./dates.ts";
import type { Calendar, Deadline } from "./types.ts";

export type ComputedDeadline = {
  due: IsoDate;
  kind: Deadline["kind"];
  adjusted: "none" | "weekend" | "holiday";
};

function isWorkingDay(iso: IsoDate, calendar: Calendar): boolean {
  const wd = weekday(iso);
  return wd !== 0 && wd !== 6 && !calendar.holidays.includes(iso);
}

function nthWorkingDay(first: IsoDate, n: number, calendar: Calendar): IsoDate {
  let day = first;
  let counted = isWorkingDay(day, calendar) ? 1 : 0;
  while (counted < n) {
    day = addDays(day, 1);
    if (isWorkingDay(day, calendar)) counted++;
  }
  return day;
}

export function computeDeadline(deadline: Deadline, eventDate: IsoDate, calendar: Calendar): ComputedDeadline {
  let due: IsoDate;
  if (deadline.interval === 0) {
    due = eventDate;
  } else {
    const first = deadline.counting_starts === "day_after" ? addDays(eventDate, 1) : eventDate;
    switch (deadline.unit) {
      case "calendar_days":
        due = addDays(first, deadline.interval - 1);
        break;
      case "working_days":
        due = nthWorkingDay(first, deadline.interval, calendar);
        break;
      case "months":
        due = addMonths(first, deadline.interval);
        break;
    }
  }

  let adjusted: ComputedDeadline["adjusted"] = "none";
  if (deadline.weekend_holiday_rule === "extend_to_next_working_day" && !isWorkingDay(due, calendar)) {
    // The reason recorded is why the original date was not a working day.
    adjusted = calendar.holidays.includes(due) ? "holiday" : "weekend";
    do {
      due = addDays(due, 1);
    } while (!isWorkingDay(due, calendar));
  }
  return { due, kind: deadline.kind, adjusted };
}

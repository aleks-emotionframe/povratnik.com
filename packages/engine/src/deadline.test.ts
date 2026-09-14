import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDeadline } from "./deadline.ts";
import type { Deadline } from "./types.ts";

// Synthetic values. September 2026 starts on a Tuesday; 5./6. are the first weekend.
const NO_HOLIDAYS = { holidays: [] };

function dl(over: Partial<Deadline>): Deadline {
  return {
    trigger: "entry",
    interval: 30,
    unit: "calendar_days",
    counting_starts: "day_after",
    weekend_holiday_rule: "none",
    kind: "statutory",
    ...over,
  };
}

test("calendar_days: day_after counts from the next day, same_day from the event day", () => {
  assert.equal(computeDeadline(dl({ interval: 30 }), "2026-06-01", NO_HOLIDAYS).due, "2026-07-01");
  assert.equal(computeDeadline(dl({ interval: 30, counting_starts: "same_day" }), "2026-06-01", NO_HOLIDAYS).due, "2026-06-30");
  assert.equal(computeDeadline(dl({ interval: 1 }), "2026-06-01", NO_HOLIDAYS).due, "2026-06-02");
  assert.equal(computeDeadline(dl({ interval: 1, counting_starts: "same_day" }), "2026-06-01", NO_HOLIDAYS).due, "2026-06-01");
});

test("interval 0 is due on the event day", () => {
  assert.equal(computeDeadline(dl({ interval: 0 }), "2026-06-01", NO_HOLIDAYS).due, "2026-06-01");
  assert.equal(computeDeadline(dl({ interval: 0, counting_starts: "same_day" }), "2026-06-01", NO_HOLIDAYS).due, "2026-06-01");
});

test("extend_to_next_working_day moves a weekend or holiday end forward and says why", () => {
  const extend = dl({ interval: 4, weekend_holiday_rule: "extend_to_next_working_day" });
  assert.deepEqual(computeDeadline(extend, "2026-09-01", NO_HOLIDAYS), { due: "2026-09-07", kind: "statutory", adjusted: "weekend" });
  assert.deepEqual(computeDeadline(dl({ interval: 4 }), "2026-09-01", NO_HOLIDAYS), { due: "2026-09-05", kind: "statutory", adjusted: "none" });
  // Saturday end, Monday holiday: moved for the weekend, then past the holiday.
  assert.deepEqual(computeDeadline(extend, "2026-09-01", { holidays: ["2026-09-07"] }), { due: "2026-09-08", kind: "statutory", adjusted: "weekend" });
  const monday = dl({ interval: 7, counting_starts: "same_day", weekend_holiday_rule: "extend_to_next_working_day" });
  assert.deepEqual(computeDeadline(monday, "2026-09-01", { holidays: ["2026-09-07"] }), { due: "2026-09-08", kind: "statutory", adjusted: "holiday" });
});

test("working_days skips weekends and holidays while counting", () => {
  const five = dl({ interval: 5, unit: "working_days" });
  assert.equal(computeDeadline(five, "2026-09-04", NO_HOLIDAYS).due, "2026-09-11");
  assert.equal(computeDeadline(five, "2026-09-04", { holidays: ["2026-09-08"] }).due, "2026-09-14");
  assert.equal(computeDeadline(dl({ interval: 1, unit: "working_days", counting_starts: "same_day" }), "2026-09-07", NO_HOLIDAYS).due, "2026-09-07");
  assert.equal(computeDeadline(dl({ interval: 1, unit: "working_days", counting_starts: "same_day" }), "2026-09-05", NO_HOLIDAYS).due, "2026-09-07");
});

test("months keeps the day of month and clamps to the end of the target month", () => {
  assert.equal(computeDeadline(dl({ interval: 2, unit: "months" }), "2026-01-30", NO_HOLIDAYS).due, "2026-03-31");
  assert.equal(computeDeadline(dl({ interval: 1, unit: "months", counting_starts: "same_day" }), "2026-01-31", NO_HOLIDAYS).due, "2026-02-28");
  const extended = dl({ interval: 1, unit: "months", counting_starts: "same_day", weekend_holiday_rule: "extend_to_next_working_day" });
  assert.deepEqual(computeDeadline(extended, "2026-01-31", NO_HOLIDAYS), { due: "2026-03-02", kind: "statutory", adjusted: "weekend" });
});

test("the deadline kind is passed through unchanged", () => {
  assert.equal(computeDeadline(dl({ kind: "recommended" }), "2026-06-01", NO_HOLIDAYS).kind, "recommended");
});

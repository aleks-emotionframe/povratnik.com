import { test } from "node:test";
import assert from "node:assert/strict";
import { addDays, addMonths, isIsoDate, weekday } from "./dates.ts";

test("isIsoDate accepts only real calendar dates", () => {
  assert.equal(isIsoDate("2026-02-28"), true);
  assert.equal(isIsoDate("2024-02-29"), true);
  assert.equal(isIsoDate("2026-02-29"), false);
  assert.equal(isIsoDate("2026-13-01"), false);
  assert.equal(isIsoDate("2026-1-1"), false);
  assert.equal(isIsoDate(20260101), false);
});

test("addDays crosses month and year boundaries and leap days", () => {
  assert.equal(addDays("2026-01-31", 1), "2026-02-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(addDays("2026-06-01", 0), "2026-06-01");
});

test("addMonths keeps the day or clamps to the end of the target month", () => {
  assert.equal(addMonths("2026-01-15", 1), "2026-02-15");
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2024-01-31", 1), "2024-02-29");
  assert.equal(addMonths("2026-11-30", 3), "2027-02-28");
  assert.equal(addMonths("2026-03-31", 12), "2027-03-31");
});

test("weekday follows the UTC calendar", () => {
  assert.equal(weekday("2026-09-13"), 0); // Sunday
  assert.equal(weekday("2026-09-14"), 1); // Monday
  assert.equal(weekday("2026-09-12"), 6); // Saturday
});

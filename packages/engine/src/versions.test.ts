import { test } from "node:test";
import assert from "node:assert/strict";
import { selectVersion } from "./versions.ts";
import type { OpenEndedDate, Rule } from "./types.ts";

// Synthetic windows. Only validity matters here; the rest is filler.
function version(v: number, valid_from: string, valid_until: OpenEndedDate): Rule {
  return {
    id: "r",
    version: v,
    synthetic: true,
    trigger: "entry",
    scope: { applies_to_persons: { citizenship_status: ["third_country"], residence_status: ["temporary_residence"] }, procedure: "p" },
    conditions: [],
    result: { task: "t", status_text_key: "k" },
    approval: { state: "draft" },
    publication: { state: "unpublished" },
    validity: { valid_from, valid_until },
  };
}

const v1 = version(1, "2020-01-01", { kind: "date", date: "2026-05-31" });
const v2 = version(2, "2026-06-01", { kind: "open_ended", date: null });
const chain = [v2, v1];

function selected(date: string) {
  const s = selectVersion(chain, date);
  return s.status === "selected" ? s.rule.version : s.status;
}

test("cut-off: day before, cut-off day, day after", () => {
  assert.equal(selected("2026-05-31"), 1);
  assert.equal(selected("2026-06-01"), 2);
  assert.equal(selected("2026-06-02"), 2);
});

test("a superseded version is still selected for a historical event", () => {
  assert.equal(selected("2021-03-15"), 1);
});

test("no version in force before the first valid_from", () => {
  assert.equal(selected("2019-12-31"), "none");
});

test("an unknown end excludes nothing", () => {
  const open = version(1, "2020-01-01", { kind: "unknown", date: null });
  assert.equal(selectVersion([open], "2030-01-01").status, "selected");
});

test("overlapping windows are reported as ambiguous, never silently resolved", () => {
  const overlapping = version(3, "2026-05-01", { kind: "open_ended", date: null });
  const s = selectVersion([v1, v2, overlapping], "2026-06-15");
  assert.equal(s.status, "ambiguous");
  if (s.status === "ambiguous") assert.deepEqual(s.rules.map((r) => r.version), [2, 3]);
});

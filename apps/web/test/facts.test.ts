import { test } from "node:test";
import assert from "node:assert/strict";
import { factsFor, personsInput } from "../src/lib/facts.ts";
import { personsFor, stepsFor, type Answers } from "../src/lib/questions.ts";

const base: Answers = {
  stage: "planning",
  household: "partner",
  horizon: "within_6_months",
  persons: [
    { id: "p1", role: "self", country: "ar", citizenships: ["other"], link: "ancestor", income: "remote_employer_abroad" },
    { id: "p2", role: "partner", country: "ar", citizenships: ["hr", "other"], link: "none", income: "unknown" },
  ],
};

test("answered questions become known facts, multiple citizenships stay a list", () => {
  const f = factsFor(base, base.persons[0]!);
  assert.deepEqual(f["person.citizenship_status"], { availability: "known", value: ["third_country"] });
  assert.deepEqual(f["person.croatian_link"], { availability: "known", value: "ancestor" });
  assert.deepEqual(f["person.income_source"], { availability: "known", value: "remote_employer_abroad" });
  assert.deepEqual(f["person.stage"], { availability: "known", value: "planning" });
  assert.deepEqual(factsFor(base, base.persons[1]!)["person.citizenship_status"], { availability: "known", value: ["hr_citizen", "third_country"] });
});

test("unanswered or «weiss ich nicht» is an unknown fact, never a default", () => {
  const f = factsFor(base, base.persons[1]!);
  assert.deepEqual(f["person.income_source"], { availability: "unknown" });
  const empty = factsFor({ persons: [{ id: "p1", role: "self" }] }, { id: "p1", role: "self" });
  for (const path of ["person.stage", "person.country", "person.citizenship_status", "person.croatian_link", "person.residence_status", "event.entry"]) {
    assert.deepEqual(empty[path], { availability: "unknown" }, path);
  }
  const mixed = factsFor(base, { id: "p3", role: "child", citizenships: ["hr", "unknown"] });
  assert.deepEqual(mixed["person.citizenship_status"], { availability: "unknown" });
});

test("not yet in Croatia: residence status is known to be none and the entry date unknown", () => {
  const f = factsFor(base, base.persons[0]!);
  assert.deepEqual(f["person.residence_status"], { availability: "known", value: "none" });
  assert.deepEqual(f["event.entry"], { availability: "unknown" });
});

test("already in Croatia: residence status and entry date come from the extra questions", () => {
  const arrived: Answers = { ...base, stage: "arrived", persons: [{ id: "p1", role: "self", residence: "temporary_residence", entry: "2026-06-01" }] };
  const f = factsFor(arrived, arrived.persons[0]!);
  assert.deepEqual(f["person.residence_status"], { availability: "known", value: "temporary_residence" });
  assert.deepEqual(f["event.entry"], { availability: "known", value: "2026-06-01" });
  const unsure = factsFor(arrived, { id: "p1", role: "self", residence: "unknown", entry: "unknown" });
  assert.deepEqual(unsure["person.residence_status"], { availability: "unknown" });
  assert.deepEqual(unsure["event.entry"], { availability: "unknown" });
});

test("steps follow the short check order and add the extra questions only for arrived households", () => {
  const ids = (a: Answers) => stepsFor(a).map((s) => `${s.question.id}${s.person ? ":" + s.person.id : ""}`);
  assert.deepEqual(ids({ persons: [] }), ["stage", "household"]);
  assert.deepEqual(ids(base), [
    "stage", "household",
    "country:p1", "country:p2",
    "citizenship:p1", "link:p1", "citizenship:p2", "link:p2",
    "horizon",
    "income:p1", "income:p2",
  ]);
  const arrived = ids({ ...base, stage: "arrived" });
  assert.deepEqual(arrived.slice(-4), ["residence:p1", "entry:p1", "residence:p2", "entry:p2"]);
  assert.deepEqual(personsFor("partner_children").map((p) => p.role), ["self", "partner", "child"]);
  assert.deepEqual(personsInput(base).map((p) => p.id), ["p1", "p2"]);
});

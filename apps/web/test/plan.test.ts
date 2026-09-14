import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@povratnik/engine";
import { bundleFor, loadContent } from "../src/lib/content.ts";
import { personsInput } from "../src/lib/facts.ts";
import { buildPlan } from "../src/lib/plan.ts";
import type { Answers } from "../src/lib/questions.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "content");
const bundle = bundleFor("dev", loadContent(CONTENT));

function planFor(a: Answers) {
  const out = evaluate({ reference_date: "2026-09-14", persons: personsInput(a), calendar: { holidays: [] } }, bundle.rules, { include: "all" });
  return buildPlan(out, bundle);
}

// Fall D (wizard-konzept 4): kroatischer Rentner mit Partnerin ohne kroatischen Bezug.
const caseD: Answers = {
  stage: "planning",
  household: "partner",
  horizon: "later_or_unclear",
  persons: [
    { id: "p1", role: "self", country: "ca", citizenships: ["hr"], link: "none", income: "pension_or_assets" },
    { id: "p2", role: "partner", country: "ca", citizenships: ["other"], link: "partner", income: "unknown" },
  ],
};

test("each person gets their own results; nothing is copied from the partner", () => {
  const plan = planFor(caseD);
  const p1 = plan.phases.flatMap((g) => g.items).filter((i) => i.person === "p1").map((i) => i.rule.id);
  const p2 = plan.phases.flatMap((g) => g.items).filter((i) => i.person === "p2").map((i) => i.rule.id);
  assert.deepEqual(p1, ["example-passport-check"]);
  // p2: third_country, link partner, income unknown → remote-work rule stays open, descent rule not met
  assert.deepEqual(p2.sort(), ["example-descent-check", "example-remote-work-check"]);
  assert.deepEqual(plan.errors, []);
});

test("next steps are at most three, matches before unclear, never padded", () => {
  const plan = planFor(caseD);
  assert.ok(plan.next.length <= 3);
  const states = plan.next.map((i) => i.result.eligibility);
  const firstUnclear = states.indexOf("unclear");
  assert.ok(firstUnclear === -1 || !states.slice(firstUnclear).includes("matches"), states.join(","));
  const single = planFor({ ...caseD, household: "alone", persons: [caseD.persons[0]!] });
  assert.equal(single.next.length, 1);
});

// Fall E: Status unbekannt. Nur Klärungen, nie ein negatives Ergebnis.
test("unknown status yields clarifications only and no condition_missing", () => {
  const plan = planFor({
    stage: "exploring",
    household: "alone",
    horizon: "later_or_unclear",
    persons: [{ id: "p1", role: "self", country: "cl", citizenships: ["unknown"], link: "ancestor", income: "unknown" }],
  });
  const states = plan.phases.flatMap((g) => g.items).map((i) => i.result.eligibility);
  assert.ok(states.length > 0);
  assert.ok(states.every((s) => s === "unclear"), states.join(","));
  assert.ok(plan.open.some((o) => o.clarification === "missing:person.citizenship_status"));
});

test("phases keep the order orient, prepare, move, arrive, stay", () => {
  const plan = planFor(caseD);
  const order = ["orient", "prepare", "move", "arrive", "stay"];
  const seen = plan.phases.map((g) => order.indexOf(g.phase));
  assert.deepEqual(seen, [...seen].sort((a, b) => a - b));
});

// Fiktive EWR-Regel: 33 Kalendertage ab dem Folgetag, Verschiebung auf den nächsten
// Werktag. Einreise 2026-04-28 → Ende 2026-05-31 (Sonntag) → 2026-06-01 (Montag).
// Einreise 2026-05-01 → Ende 2026-06-03 (Mittwoch) → kein Feiertag → bleibt.
// Einreise 2026-05-02 → Ende 2026-06-04 = Tijelovo → 2026-06-05.
test("a deadline that ends on a holiday moves to the next working day when the calendar is in the bundle", () => {
  const arrived = (entry: string): Answers => ({
    stage: "arrived",
    household: "alone",
    horizon: "within_6_months",
    persons: [{ id: "p1", role: "self", country: "de", citizenships: ["eea"], link: "none", income: "employment", residence: "none", entry }],
  });
  const due = (entry: string) => {
    const out = evaluate({ reference_date: "2026-09-14", persons: personsInput(arrived(entry)), calendar: { holidays: bundle.holidays } }, bundle.rules, { include: "all" });
    const r = out.persons[0]!.results.find((x) => x.rule === "example-eea-registration@1")!;
    return r.deadline!.status === "computed" ? r.deadline : undefined;
  };
  assert.deepEqual(due("2026-05-01"), { status: "computed", due: "2026-06-03", kind: "statutory", adjusted: "none" });
  assert.deepEqual(due("2026-05-02"), { status: "computed", due: "2026-06-05", kind: "statutory", adjusted: "holiday" });
  assert.deepEqual(due("2026-04-28"), { status: "computed", due: "2026-06-01", kind: "statutory", adjusted: "weekend" });
});

// Produktregeln der Zusammenfassung (lib/summary.ts) und vertiefende Fragen (lib/refine.ts):
// Einordnung, keine Prüfung. Unbekannt schliesst nie aus, Engstelle ist der erste offene Schlüssel.

import { test } from "node:test";
import assert from "node:assert/strict";
import { chain, deadlines, differences, refinements } from "../src/lib/summary.ts";
import { refineQuestions, refineValue, withRefine } from "../src/lib/refine.ts";
import type { Answers } from "../src/lib/questions.ts";
import type { Plan } from "../src/lib/plan.ts";

const alone: Answers = { stage: "planning", household: "alone", persons: [{ id: "p1", role: "self", citizenships: ["hr"], income: "employment" }] };

test("differences: unknown citizenship first, at most four sentences", () => {
  const a: Answers = {
    stage: "arrived",
    household: "partner_children",
    persons: [
      { id: "p1", role: "self", citizenships: ["hr"], income: "self_employment" },
      { id: "p2", role: "partner", citizenships: [], income: "remote_employer_abroad" },
      { id: "p3", role: "child", citizenships: ["hr"] },
    ],
  };
  const d = differences(a);
  assert.equal(d[0]?.key, "status_unknown");
  assert.equal(d[0]?.person, "p2");
  assert.ok(d.length <= 4);
});

test("differences: nothing special for a croatian citizen who is employed", () => {
  assert.deepEqual(differences(alone), []);
});

test("chain: status is the bottleneck when a citizenship is unknown", () => {
  const a: Answers = { stage: "planning", persons: [{ id: "p1", role: "self" }] };
  const keys = chain(a);
  assert.equal(keys[0]?.state, "open");
  assert.equal(chain(alone)[0]?.state, "clear");
});

test("refine: questions follow the answers and unknown is a valid value", () => {
  const a: Answers = { stage: "planning", persons: [{ id: "p1", role: "self", income: "self_employment" }, { id: "p2", role: "child" }] };
  const qs = refineQuestions(a, ["dolina-mira"]);
  assert.ok(qs.some((q) => q.id === "founding"));
  assert.ok(qs.some((q) => q.id === "children" && q.person?.id === "p2"));
  assert.ok(!qs.some((q) => q.id === "pension"));
  const founding = qs.find((q) => q.id === "founding")!;
  const next = withRefine(a, founding, "founded", "unknown");
  assert.equal(refineValue(next, founding, "founded"), "unknown");
  assert.deepEqual(refinements(next), []);
  const founded = withRefine(a, founding, "founded", "yes");
  assert.ok(refinements(founded).some((r) => r.key === "founded_deadline"));
});

test("deadlines: legal from rules, funding from place and dated pages, sorted by date", () => {
  const plan = {
    phases: [{ phase: "arrive", items: [{ person: "p1", task: { title: { de: "Aufgabe" } }, result: { deadline: { status: "computed", due: "2026-10-01" } } }] }],
  } as unknown as Plan;
  const place = { id: "x", name: "X (fiktiv)", benefits: [{ title: "Zuschuss", state: "open", until: "2026-09-20", target: "alle" }, { title: "Alt", state: "closed", until: "2025-01-01", target: "alle" }], arrival: { office: "", function: "", languages: [], channel: "" } };
  const d = deadlines(plan, place, [{ title: "Seite", path: "/x", until: "2026-09-30" }]);
  assert.deepEqual(d.map((x) => [x.kind, x.date]), [["funding", "2026-09-20"], ["funding", "2026-09-30"], ["legal", "2026-10-01"]]);
});

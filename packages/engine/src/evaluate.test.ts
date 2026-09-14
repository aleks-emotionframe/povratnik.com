import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, type EvaluationInput } from "./evaluate.ts";
import type { Facts, Rule } from "./types.ts";

// Synthetic rules and persons. Values are filler, not domain values.
function rule(over: Partial<Rule> & { id: string }): Rule {
  return {
    version: 1,
    synthetic: true,
    trigger: "entry",
    scope: { applies_to_persons: { citizenship_status: ["third_country"], residence_status: ["temporary_residence"] }, procedure: "proc-a" },
    conditions: [],
    result: { task: "task-a", status_text_key: "rules.a.matches" },
    approval: { state: "draft" },
    publication: { state: "unpublished" },
    validity: { valid_from: "2020-01-01", valid_until: { kind: "open_ended", date: null } },
    ...over,
  };
}

const known = (value: unknown) => ({ availability: "known" as const, value });

function person(facts: Facts = {}): Facts {
  return {
    "person.citizenship_status": known(["third_country"]),
    "person.residence_status": known("temporary_residence"),
    "event.entry": known("2026-09-01"),
    ...facts,
  };
}

function run(rules: Rule[], facts: Facts = person(), options?: { include: "all" | "published" }) {
  const input: EvaluationInput = { reference_date: "2026-09-13", persons: [{ id: "p1", facts }], calendar: { holidays: [] } };
  return evaluate(input, rules, options ?? { include: "all" }).persons[0]!;
}

test("public mode evaluates only approved, published, non-synthetic rules; withdrawn never", () => {
  const draft = rule({ id: "a" });
  assert.equal(run([draft], person(), { include: "published" }).results.length, 0);
  const live = rule({ id: "a", synthetic: false, approval: { state: "approved" }, publication: { state: "published" } });
  assert.equal(run([live], person(), { include: "published" }).results.length, 1);
  const withdrawn = rule({ id: "a", synthetic: false, approval: { state: "approved" }, publication: { state: "withdrawn" } });
  assert.equal(run([withdrawn], person(), { include: "published" }).results.length, 0);
  assert.equal(run([withdrawn], person(), { include: "all" }).results.length, 0);
});

test("a matching rule yields matches, its own text key and a computed deadline", () => {
  const withDeadline = rule({
    id: "a",
    result: {
      task: "task-a",
      status_text_key: "rules.a.matches",
      deadline: { trigger: "entry", interval: 3, unit: "calendar_days", counting_starts: "day_after", weekend_holiday_rule: "none", kind: "statutory" },
    },
  });
  const out = run([withDeadline]);
  assert.deepEqual(out.results, [{
    rule: "a@1",
    procedure: "proc-a",
    task: "task-a",
    eligibility: "matches",
    text_key: "rules.a.matches",
    version_selection: "by_event",
    conditions: [],
    deadline: { status: "computed", due: "2026-09-04", kind: "statutory", adjusted: "none" },
  }]);
  assert.deepEqual(out.clarifications, []);
  assert.deepEqual(out.errors, []);
});

test("scope: a rule for one person circle is never applied to another", () => {
  const r = rule({ id: "a" });
  assert.equal(run([r], person({ "person.citizenship_status": known(["eea_citizen"]) })).results.length, 0);
  assert.equal(run([r], person({ "person.residence_status": known("permanent_residence") })).results.length, 0);
  // Several statuses: one in the circle is enough.
  assert.equal(run([r], person({ "person.citizenship_status": known(["hr_citizen", "third_country"]) })).results.length, 1);
});

test("scope: an unknown status is neither applied nor dropped but clarified", () => {
  const out = run([rule({ id: "a" })], person({ "person.citizenship_status": known(["unknown"]) }));
  assert.equal(out.results[0]!.eligibility, "unclear");
  assert.deepEqual(out.clarifications, ["missing:person.citizenship_status"]);
  const missing = run([rule({ id: "a" })], person({ "person.residence_status": { availability: "unknown" } }));
  assert.deepEqual(missing.clarifications, ["missing:person.residence_status"]);
});

test("conditions: a known hurdle beats an information gap; generic text key for non-matches", () => {
  const r = rule({
    id: "a",
    conditions: [
      { field: "person.age", operator: "gte", value: 18, on_unknown: "clarify" },
      { field: "person.other", operator: "exists", on_unknown: "clarify" },
    ],
  });
  const out = run([r], person({ "person.age": known(16) }));
  assert.equal(out.results[0]!.eligibility, "condition_missing");
  assert.equal(out.results[0]!.text_key, "results.condition_missing");
  assert.deepEqual(out.clarifications, ["missing:person.other"]);
});

test("on_unknown: clarify gives unclear, skip gives unchecked without clarification, fail gives an error", () => {
  const clarify = rule({ id: "a", conditions: [{ field: "person.x", operator: "exists", on_unknown: "clarify" }] });
  const c = run([clarify]);
  assert.equal(c.results[0]!.eligibility, "unclear");
  assert.equal(c.results[0]!.text_key, "results.unclear");
  assert.deepEqual(c.clarifications, ["missing:person.x"]);

  const skip = rule({ id: "a", conditions: [{ field: "person.x", operator: "exists", on_unknown: "skip" }] });
  const s = run([skip]);
  assert.equal(s.results[0]!.eligibility, "unchecked");
  assert.deepEqual(s.clarifications, []);

  const fail = rule({ id: "a", conditions: [{ field: "person.x", operator: "exists", on_unknown: "fail" }] });
  const f = run([fail]);
  assert.equal(f.results.length, 0);
  assert.equal(f.errors.length, 1);
  assert.match(f.errors[0]!.message, /person\.x is a required input/);
});

test("a type conflict in a condition is an error, not a result", () => {
  const r = rule({ id: "a", conditions: [{ field: "person.age", operator: "gte", value: 18, on_unknown: "clarify" }] });
  const out = run([r], person({ "person.age": known("adult") }));
  assert.equal(out.results.length, 0);
  assert.equal(out.errors[0]!.rule, "a@1");
});

test("unknown event date: version by reference date, provisional, unclear, deadline awaits the event", () => {
  const v1 = rule({ id: "a", version: 1, validity: { valid_from: "2020-01-01", valid_until: { kind: "date", date: "2026-05-31" } } });
  const v2 = rule({
    id: "a",
    version: 2,
    validity: { valid_from: "2026-06-01", valid_until: { kind: "open_ended", date: null } },
    result: {
      task: "task-a",
      status_text_key: "rules.a.matches",
      deadline: { trigger: "entry", interval: 3, unit: "calendar_days", counting_starts: "day_after", weekend_holiday_rule: "none", kind: "statutory" },
    },
  });
  const out = run([v1, v2], person({ "event.entry": { availability: "unknown" } }));
  assert.equal(out.results[0]!.rule, "a@2");
  assert.equal(out.results[0]!.version_selection, "by_reference_date_provisional");
  assert.equal(out.results[0]!.eligibility, "unclear");
  assert.deepEqual(out.results[0]!.deadline, { status: "awaiting_event", event: "entry", kind: "statutory" });
  assert.deepEqual(out.clarifications, ["missing:event.entry"]);
  // A known hurdle stays a known hurdle even while the version is provisional.
  const hurdle = rule({ id: "b", conditions: [{ field: "person.age", operator: "gte", value: 18, on_unknown: "clarify" }] });
  assert.equal(run([hurdle], person({ "event.entry": { availability: "unknown" }, "person.age": known(16) })).results[0]!.eligibility, "condition_missing");
});

test("no version in force for the event date, or event known not to exist: no result", () => {
  const r = rule({ id: "a", validity: { valid_from: "2026-01-01", valid_until: { kind: "open_ended", date: null } } });
  assert.equal(run([r], person({ "event.entry": known("2025-12-31") })).results.length, 0);
  assert.equal(run([r], person({ "event.entry": { availability: "not_existing" } })).results.length, 0);
});

test("conflict: two live results in one procedure without priorities become unclear with a clarification", () => {
  const a = rule({ id: "a" });
  const b = rule({ id: "b", result: { task: "task-b", status_text_key: "rules.b.matches" } });
  const out = run([a, b]);
  assert.deepEqual(out.results.map((r) => [r.rule, r.eligibility, r.text_key]), [["a@1", "unclear", "results.rule_conflict"], ["b@1", "unclear", "results.rule_conflict"]]);
  assert.deepEqual(out.clarifications, ["rule_conflict:proc-a"]);
  // Equal priorities do not resolve anything.
  const same = run([rule({ id: "a", priority: 1 }), rule({ id: "b", priority: 1 })]);
  assert.deepEqual(same.clarifications, ["rule_conflict:proc-a"]);
  // One priority missing does not resolve anything either.
  const partial = run([rule({ id: "a", priority: 1 }), rule({ id: "b" })]);
  assert.deepEqual(partial.clarifications, ["rule_conflict:proc-a"]);
});

test("conflict: distinct priorities resolve it, the smallest number wins", () => {
  const out = run([rule({ id: "a", priority: 2 }), rule({ id: "b", priority: 1 })]);
  assert.deepEqual(out.results.map((r) => [r.rule, r.eligibility]), [["b@1", "matches"]]);
  assert.deepEqual(out.clarifications, []);
});

test("different procedures never conflict", () => {
  const a = rule({ id: "a" });
  const b = rule({ id: "b", scope: { ...a.scope, procedure: "proc-b" } });
  const out = run([a, b]);
  assert.deepEqual(out.results.map((r) => [r.rule, r.procedure, r.eligibility]), [["a@1", "proc-a", "matches"], ["b@1", "proc-b", "matches"]]);
});

test("the output is reproducible and lists the versions used", () => {
  const rules = [rule({ id: "a" }), rule({ id: "b", scope: { applies_to_persons: { citizenship_status: ["eea_citizen"], residence_status: ["none"] }, procedure: "proc-b" } })];
  const input: EvaluationInput = { reference_date: "2026-09-13", persons: [{ id: "p1", facts: person() }], calendar: { holidays: [] } };
  const first = evaluate(input, rules, { include: "all" });
  const second = evaluate(input, rules, { include: "all" });
  assert.deepEqual(first, second);
  assert.deepEqual(first.rule_versions, ["a@1"]);
  assert.equal(first.reference_date, "2026-09-13");
});

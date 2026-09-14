// Runs every fixture in content/tests through the engine against every rule in
// content/rules (CLAUDE.md section 5). One node:test per fixture. Expectations are
// exact sets; a fixture that produces an engine error fails.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { evaluate, type EvaluationInput, type EvaluationOutput, type Fact, type Facts, type Rule } from "../src/index.ts";

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "content");

type Doc = Record<string, any>;

function loadDir(dir: string): Doc[] {
  return readdirSync(join(CONTENT, dir))
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => parse(readFileSync(join(CONTENT, dir, f), "utf8")));
}

const rules = loadDir("rules") as Rule[];
const fixtures = loadDir("tests");
const catalogueDe = parse(readFileSync(join(CONTENT, "i18n", "de.yaml"), "utf8"));

function text(key: string): string {
  const value = key.split(".").reduce<any>((node, part) => node?.[part], catalogueDe);
  assert.equal(typeof value, "string", `text key "${key}" missing in i18n/de.yaml`);
  return value;
}

// A vocabulary value "unknown" is an unknown fact, not a known value "unknown".
function vocab(value: string): Fact {
  return value === "unknown" ? { availability: "unknown" } : { availability: "known", value };
}

function toInput(fixture: Doc): EvaluationInput {
  const persons = fixture.input.persons.map((p: Doc) => {
    const facts: Facts = {
      "person.citizenship_status": { availability: "known", value: p.citizenship_status },
      "person.residence_status": vocab(p.residence_status),
      "person.croatian_link": vocab(p.croatian_link),
      ...(p.facts ?? {}),
    };
    for (const e of fixture.input.events.filter((e: Doc) => e.person === p.id)) {
      assert.notEqual(e.date.kind, "open_ended", `event ${e.type} of ${p.id}: an event date cannot be open_ended`);
      facts[`event.${e.type}`] = e.date.kind === "date" ? { availability: "known", value: e.date.date } : { availability: "unknown" };
    }
    return { id: p.id, facts };
  });
  return { reference_date: fixture.reference_date, persons, calendar: { holidays: fixture.input.holidays ?? [] } };
}

function sorted<T>(items: T[]): T[] {
  return [...items].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function check(fixture: Doc, out: EvaluationOutput) {
  const expect = fixture.expect;
  assert.deepEqual(expect.routes, [], "routes are not produced before M6");
  assert.deepEqual(expect.routes_absent, [], "routes are not produced before M6");

  for (const p of out.persons) assert.deepEqual(p.errors, [], `engine errors for ${p.person}`);

  const results = out.persons.flatMap((p) => p.results.map((r) => ({ person: p.person, rule: r.rule, eligibility: r.eligibility })));
  assert.deepEqual(sorted(results), sorted(expect.results), "results");

  // Tasks in the plan are those with a live result: matches or unclear.
  const tasks = new Set(out.persons.flatMap((p) => p.results.filter((r) => r.eligibility === "matches" || r.eligibility === "unclear").map((r) => r.task)));
  assert.deepEqual([...tasks].sort(), [...expect.tasks].sort(), "tasks");
  for (const t of expect.tasks_absent) assert.ok(!tasks.has(t), `task ${t} must be absent`);

  const clarifications = new Set(out.persons.flatMap((p) => p.clarifications));
  assert.deepEqual([...clarifications].sort(), [...expect.clarifications].sort(), "clarifications");

  for (const p of out.persons) {
    for (const r of p.results) {
      const t = text(r.text_key);
      for (const phrase of expect.forbidden_texts) {
        assert.ok(!t.includes(phrase), `${r.rule} (${r.eligibility}): text contains forbidden "${phrase}": ${t}`);
      }
    }
  }

  for (const d of expect.deadlines ?? []) {
    const result = out.persons.find((p) => p.person === d.person)?.results.find((r) => r.rule === d.rule);
    assert.ok(result?.deadline, `${d.person} ${d.rule}: no deadline in result`);
    assert.equal(result.deadline.status, "computed", `${d.person} ${d.rule}: deadline not computed`);
    if (result.deadline.status === "computed") assert.equal(result.deadline.due, d.due, `${d.person} ${d.rule}: due date`);
  }
}

for (const fixture of fixtures) {
  test(`${fixture.id}: ${fixture.title.de}`, () => {
    assert.equal(fixture.synthetic, true, "fixtures must be synthetic");
    const input = toInput(fixture);
    const out = evaluate(input, rules, { include: "all" });
    check(fixture, out);
    // Reproducibility (CLAUDE.md section 5): same answers, same rules, same plan.
    assert.deepEqual(evaluate(input, rules, { include: "all" }), out);
  });
}

test("synthetic rules are never evaluated in the public (published) mode", () => {
  for (const fixture of fixtures) {
    const out = evaluate(toInput(fixture), rules);
    assert.deepEqual(out.rule_versions, [], fixture.id);
  }
});

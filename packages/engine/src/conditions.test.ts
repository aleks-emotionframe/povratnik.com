import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateCondition } from "./conditions.ts";
import type { Condition, Facts } from "./types.ts";

const known = (value: unknown) => ({ availability: "known" as const, value });

function run(c: Partial<Condition> & Pick<Condition, "operator">, facts: Facts) {
  return evaluateCondition({ field: "person.x", on_unknown: "clarify", ...c }, facts).status;
}

test("unknown is reported as unknown, never as false", () => {
  assert.equal(run({ operator: "exists" }, {}), "unknown");
  assert.equal(run({ operator: "exists" }, { "person.x": { availability: "unknown" } }), "unknown");
  assert.equal(run({ operator: "exists" }, { "person.x": { availability: "not_collected" } }), "unknown");
  assert.equal(run({ operator: "gte", value: 18 }, { "person.x": { availability: "unknown" } }), "unknown");
});

test("not_applicable and not_existing are a known absence: condition not met", () => {
  assert.equal(run({ operator: "exists" }, { "person.x": { availability: "not_applicable" } }), "not_met");
  assert.equal(run({ operator: "gte", value: 18 }, { "person.x": { availability: "not_existing" } }), "not_met");
});

test("exists is met for any known value, including 0 and false", () => {
  assert.equal(run({ operator: "exists" }, { "person.x": known(0) }), "met");
  assert.equal(run({ operator: "exists" }, { "person.x": known(false) }), "met");
});

test("in accepts a scalar or a list value; a list needs one element in the list", () => {
  assert.equal(run({ operator: "in", value: ["a", "b"] }, { "person.x": known("a") }), "met");
  assert.equal(run({ operator: "in", value: ["a", "b"] }, { "person.x": known("c") }), "not_met");
  assert.equal(run({ operator: "in", value: ["a", "b"] }, { "person.x": known(["c", "b"]) }), "met");
  assert.equal(run({ operator: "in", value: ["a", "b"] }, { "person.x": known(["c", "d"]) }), "not_met");
});

test("eq compares single values of the same type only", () => {
  assert.equal(run({ operator: "eq", value: true }, { "person.x": known(true) }), "met");
  assert.equal(run({ operator: "eq", value: 3 }, { "person.x": known(4) }), "not_met");
  assert.equal(run({ operator: "eq", value: "3" }, { "person.x": known(3) }), "error");
  assert.equal(run({ operator: "eq", value: "a" }, { "person.x": known(["a"]) }), "error");
});

test("gte, lte and between work on numbers and on ISO dates, inclusive", () => {
  assert.equal(run({ operator: "gte", value: 18 }, { "person.x": known(18) }), "met");
  assert.equal(run({ operator: "gte", value: 18 }, { "person.x": known(17) }), "not_met");
  assert.equal(run({ operator: "lte", value: "2026-06-01" }, { "person.x": known("2026-06-01") }), "met");
  assert.equal(run({ operator: "lte", value: "2026-06-01" }, { "person.x": known("2026-06-02") }), "not_met");
  assert.equal(run({ operator: "between", value: [1, 3] }, { "person.x": known(3) }), "met");
  assert.equal(run({ operator: "between", value: [1, 3] }, { "person.x": known(4) }), "not_met");
  assert.equal(run({ operator: "between", value: ["2026-01-01", "2026-12-31"] }, { "person.x": known("2026-06-01") }), "met");
});

test("a type conflict is an error, never a silent not_met", () => {
  assert.equal(run({ operator: "gte", value: 18 }, { "person.x": known("18") }), "error");
  assert.equal(run({ operator: "gte", value: "2026-06-01" }, { "person.x": known("yesterday") }), "error");
  assert.equal(run({ operator: "between", value: [1, "2026-01-01"] }, { "person.x": known(2) }), "error");
  assert.equal(run({ operator: "in", value: ["a"] }, { "person.x": known({}) }), "error");
});

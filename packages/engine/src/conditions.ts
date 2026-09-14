// Evaluates one condition against the facts. The operator list is exhaustive
// (datenmodell.md section 3). What happens on "unknown" is decided by the caller from
// on_unknown; this module only reports the raw outcome.

import { isIsoDate } from "./dates.ts";
import { lookup } from "./facts.ts";
import type { Condition, Facts } from "./types.ts";

export type ConditionOutcome =
  | { status: "met" | "not_met" | "unknown" }
  | { status: "error"; message: string };

type Primitive = string | number | boolean;

function isPrimitive(v: unknown): v is Primitive {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

// Ordered comparison is defined for two numbers or two ISO dates, nothing else.
function compare(a: unknown, b: unknown): number | undefined {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (isIsoDate(a) && isIsoDate(b)) return a < b ? -1 : a > b ? 1 : 0;
  return undefined;
}

function typeError(c: Condition, actual: unknown): ConditionOutcome {
  return { status: "error", message: `${c.field}: operator ${c.operator} cannot compare ${JSON.stringify(actual)} with ${JSON.stringify(c.value)}` };
}

export function evaluateCondition(c: Condition, facts: Facts): ConditionOutcome {
  const fact = lookup(facts, c.field);
  if (fact.kind === "unknown") return { status: "unknown" };
  if (fact.kind === "absent") return { status: "not_met" };
  const actual = fact.value;

  switch (c.operator) {
    case "exists":
      return { status: "met" };
    case "in": {
      const list = c.value as unknown[];
      const values = Array.isArray(actual) ? actual : [actual];
      if (!values.every(isPrimitive)) return typeError(c, actual);
      return { status: values.some((v) => list.includes(v)) ? "met" : "not_met" };
    }
    case "eq":
      if (!isPrimitive(actual) || typeof actual !== typeof c.value) return typeError(c, actual);
      return { status: actual === c.value ? "met" : "not_met" };
    case "gte":
    case "lte": {
      const cmp = compare(actual, c.value);
      if (cmp === undefined) return typeError(c, actual);
      return { status: (c.operator === "gte" ? cmp >= 0 : cmp <= 0) ? "met" : "not_met" };
    }
    case "between": {
      const [lo, hi] = c.value as [unknown, unknown];
      const low = compare(actual, lo);
      const high = compare(actual, hi);
      if (low === undefined || high === undefined) return typeError(c, actual);
      return { status: low >= 0 && high <= 0 ? "met" : "not_met" };
    }
  }
}

// Reading a fact never yields null or false for a missing value (CLAUDE.md 2.4).
// Three outcomes: known (with value), unknown (must be clarified or skipped), absent
// (a known statement that there is no value: not_applicable or not_existing).

import type { Facts } from "./types.ts";

export type FactLookup = { kind: "known"; value: unknown } | { kind: "unknown" } | { kind: "absent" };

export function lookup(facts: Facts, path: string): FactLookup {
  const fact = facts[path];
  if (!fact) return { kind: "unknown" };
  switch (fact.availability) {
    case "known":
      return { kind: "known", value: fact.value };
    case "unknown":
    case "not_collected":
      return { kind: "unknown" };
    case "not_applicable":
    case "not_existing":
      return { kind: "absent" };
  }
}

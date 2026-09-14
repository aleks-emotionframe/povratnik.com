// Version selection (datenmodell.md 2.4): which version of a rule id is in force on the
// date of the triggering event. The caller decides which date to pass; this module
// never looks at today's date.

import type { IsoDate } from "./dates.ts";
import type { Rule } from "./types.ts";

export type VersionSelection =
  | { status: "selected"; rule: Rule }
  | { status: "none" }
  | { status: "ambiguous"; rules: Rule[] };

function inForce(rule: Rule, date: IsoDate): boolean {
  const { valid_from, valid_until } = rule.validity;
  if (date < valid_from) return false;
  // open_ended and unknown exclude nothing; only a known end date can.
  return valid_until.kind !== "date" || date <= (valid_until.date as IsoDate);
}

export function selectVersion(versions: Rule[], date: IsoDate): VersionSelection {
  const candidates = versions.filter((r) => inForce(r, date));
  if (candidates.length === 1) return { status: "selected", rule: candidates[0]! };
  if (candidates.length === 0) return { status: "none" };
  return { status: "ambiguous", rules: candidates };
}

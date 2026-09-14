// Types the engine reads. They mirror schemas/rule.schema.json and common.schema.json
// for exactly the fields the evaluation needs. Data is validated by scripts/validate.ts
// before it reaches the engine; the engine trusts the shape and checks only values.

import type { IsoDate } from "./dates.ts";

export type Availability = "known" | "unknown" | "not_collected" | "not_applicable" | "not_existing";

// A domain value with its availability dimension (datenmodell.md section 1). The engine
// ignores evidence and currency; they stay with the fact for the caller.
export type Fact = { availability: Availability; value?: unknown };

// Facts keyed by path: person.<name> or event.<event_type> (datenmodell.md section 3).
export type Facts = Record<string, Fact>;

export type Operator = "in" | "eq" | "gte" | "lte" | "between" | "exists";
export type OnUnknown = "clarify" | "skip" | "fail";

export type Condition = {
  field: string;
  operator: Operator;
  value?: unknown;
  on_unknown: OnUnknown;
};

export type Deadline = {
  trigger: string;
  interval: number;
  unit: "calendar_days" | "working_days" | "months";
  counting_starts: "same_day" | "day_after";
  weekend_holiday_rule: "extend_to_next_working_day" | "none";
  kind: "statutory" | "funding" | "recommended" | "user_reminder";
};

export type OpenEndedDate = { kind: "open_ended" | "date" | "unknown"; date: IsoDate | null };

export type Rule = {
  id: string;
  version: number;
  synthetic: boolean;
  trigger: string;
  scope: {
    applies_to_persons: { citizenship_status: string[]; residence_status: string[] };
    procedure: string;
  };
  conditions: Condition[];
  result: { task: string; deadline?: Deadline; status_text_key: string };
  priority?: number;
  approval: { state: "draft" | "in_review" | "approved" | "rejected" };
  publication: { state: "unpublished" | "published" | "withdrawn" };
  validity: { valid_from: IsoDate; valid_until: OpenEndedDate };
};

// Holidays are data, never code (datenmodell.md 2.3). Tests pass synthetic lists.
export type Calendar = { holidays: IsoDate[] };

export function versionRef(rule: Pick<Rule, "id" | "version">): string {
  return `${rule.id}@${rule.version}`;
}

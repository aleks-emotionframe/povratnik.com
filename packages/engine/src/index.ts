// Public API of the rule engine. No framework, no dependencies; runs in the browser
// and in Node (ADR-0002).

export { evaluate } from "./evaluate.ts";
export type {
  Clarification,
  ConditionResult,
  DeadlineResult,
  Eligibility,
  EvaluateOptions,
  EvaluationError,
  EvaluationInput,
  EvaluationOutput,
  PersonEvaluation,
  PersonInput,
  RuleResult,
} from "./evaluate.ts";
export { computeDeadline } from "./deadline.ts";
export type { ComputedDeadline } from "./deadline.ts";
export { selectVersion } from "./versions.ts";
export type { VersionSelection } from "./versions.ts";
export { evaluateCondition } from "./conditions.ts";
export type { ConditionOutcome } from "./conditions.ts";
export { versionRef } from "./types.ts";
export type { Availability, Calendar, Condition, Deadline, Fact, Facts, OnUnknown, OpenEndedDate, Operator, Rule } from "./types.ts";
export { isIsoDate } from "./dates.ts";
export type { IsoDate } from "./dates.ts";

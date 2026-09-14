// Evaluates a rule set for each person: evaluability, version selection, scope,
// conditions, deadline, conflicts. Pure function of its inputs; it never reads the
// clock (datenmodell.md section 7: a plan must be reproducible).

import { evaluateCondition } from "./conditions.ts";
import { isIsoDate, type IsoDate } from "./dates.ts";
import { computeDeadline, type ComputedDeadline } from "./deadline.ts";
import { lookup } from "./facts.ts";
import { versionRef, type Calendar, type Deadline, type Facts, type Operator, type Rule } from "./types.ts";
import { selectVersion } from "./versions.ts";

export type Eligibility = "matches" | "condition_missing" | "unclear" | "unchecked";

export type DeadlineResult =
  | ({ status: "computed" } & ComputedDeadline)
  | { status: "awaiting_event"; event: string; kind: Deadline["kind"] };

export type ConditionResult = { field: string; operator: Operator; status: "met" | "not_met" | "unknown" };

export type RuleResult = {
  rule: string;
  procedure: string;
  task: string;
  eligibility: Eligibility;
  // The rule's own status_text_key only for matches; otherwise the generic key for the
  // state, so no text can claim more than the result (CLAUDE.md section 9).
  text_key: string;
  deadline?: DeadlineResult;
  version_selection: "by_event" | "by_reference_date_provisional";
  conditions: ConditionResult[];
};

// Format <kind>:<subject>, for example missing:event.entry or rule_conflict:<procedure>.
export type Clarification = string;
export type EvaluationError = { rule: string; message: string };

export type PersonInput = { id: string; facts: Facts };
export type EvaluationInput = { reference_date: IsoDate; persons: PersonInput[]; calendar: Calendar };
export type PersonEvaluation = { person: string; results: RuleResult[]; clarifications: Clarification[]; errors: EvaluationError[] };
export type EvaluationOutput = { reference_date: IsoDate; rule_versions: string[]; persons: PersonEvaluation[] };

// "published" is the default and the only mode for public use: synthetic, unapproved
// and unpublished rules are never evaluated there. "all" is for tests against drafts.
// A withdrawn rule is never evaluated in either mode.
export type EvaluateOptions = { include?: "published" | "all" };

function evaluable(rule: Rule, include: "published" | "all"): boolean {
  if (rule.publication.state === "withdrawn") return false;
  if (include === "all") return true;
  return !rule.synthetic && rule.approval.state === "approved" && rule.publication.state === "published";
}

function groupById(rules: Rule[]): Rule[][] {
  const groups = new Map<string, Rule[]>();
  for (const r of rules) groups.set(r.id, [...(groups.get(r.id) ?? []), r]);
  return [...groups.values()];
}

// Scope check on one list fact: in_scope, out_of_scope, or unknown when the person's
// status itself is unknown (a rule is never silently applied or dropped in that case).
function scopeMatch(facts: Facts, path: string, allowed: string[]): "in" | "out" | "unknown" {
  const fact = lookup(facts, path);
  if (fact.kind === "unknown") return "unknown";
  if (fact.kind === "absent") return "out";
  const values = Array.isArray(fact.value) ? fact.value : [fact.value];
  if (values.includes("unknown")) return "unknown";
  return values.some((v) => allowed.includes(v as string)) ? "in" : "out";
}

type Outcome = { result?: RuleResult; clarifications: Clarification[]; error?: EvaluationError };

function evaluateRuleGroup(versions: Rule[], facts: Facts, reference_date: IsoDate, calendar: Calendar): Outcome {
  const id = versions[0]!.id;
  const trigger = versions[0]!.trigger;
  const clarifications: Clarification[] = [];

  // 1. Date of the triggering event decides the version (datenmodell.md 2.4).
  const event = lookup(facts, `event.${trigger}`);
  if (event.kind === "absent") return { clarifications };
  if (event.kind === "known" && !isIsoDate(event.value)) {
    return { clarifications: [], error: { rule: id, message: `event.${trigger} is not an ISO date: ${JSON.stringify(event.value)}` } };
  }
  const eventDate = event.kind === "known" ? (event.value as IsoDate) : undefined;
  let provisional = false;
  if (eventDate === undefined) {
    provisional = true;
    clarifications.push(`missing:event.${trigger}`);
  }
  const selection = selectVersion(versions, eventDate ?? reference_date);
  if (selection.status === "none") return { clarifications: [] };
  if (selection.status === "ambiguous") {
    return { clarifications: [], error: { rule: id, message: `overlapping validity: ${selection.rules.map(versionRef).join(", ")}` } };
  }
  const rule = selection.rule;
  const ref = versionRef(rule);

  // 2. Scope: person circle. Out of scope means no result at all.
  const citizenship = scopeMatch(facts, "person.citizenship_status", rule.scope.applies_to_persons.citizenship_status);
  const residence = scopeMatch(facts, "person.residence_status", rule.scope.applies_to_persons.residence_status);
  if (citizenship === "out" || residence === "out") return { clarifications: [] };
  let scopeUnknown = false;
  if (citizenship === "unknown") { scopeUnknown = true; clarifications.push("missing:person.citizenship_status"); }
  if (residence === "unknown") { scopeUnknown = true; clarifications.push("missing:person.residence_status"); }

  // 3. Conditions.
  const conditions: ConditionResult[] = [];
  let notMet = false;
  let clarify = false;
  let skip = false;
  for (const c of rule.conditions) {
    const outcome = evaluateCondition(c, facts);
    if (outcome.status === "error") return { clarifications: [], error: { rule: ref, message: outcome.message } };
    conditions.push({ field: c.field, operator: c.operator, status: outcome.status });
    if (outcome.status === "not_met") notMet = true;
    if (outcome.status === "unknown") {
      if (c.on_unknown === "fail") {
        return { clarifications: [], error: { rule: ref, message: `${c.field} is a required input but unknown` } };
      }
      if (c.on_unknown === "clarify") { clarify = true; clarifications.push(`missing:${c.field}`); }
      if (c.on_unknown === "skip") skip = true;
    }
  }
  let eligibility: Eligibility = notMet ? "condition_missing" : clarify ? "unclear" : skip ? "unchecked" : "matches";
  // Everything derived from a provisional version or an unknown scope is unclear.
  if (provisional || scopeUnknown) eligibility = "unclear";

  // 4. Deadline.
  let deadline: DeadlineResult | undefined;
  if (rule.result.deadline) {
    deadline = eventDate === undefined
      ? { status: "awaiting_event", event: trigger, kind: rule.result.deadline.kind }
      : { status: "computed", ...computeDeadline(rule.result.deadline, eventDate, calendar) };
  }

  const result: RuleResult = {
    rule: ref,
    procedure: rule.scope.procedure,
    task: rule.result.task,
    eligibility,
    text_key: eligibility === "matches" ? rule.result.status_text_key : `results.${eligibility}`,
    version_selection: provisional ? "by_reference_date_provisional" : "by_event",
    conditions,
  };
  if (deadline) result.deadline = deadline;
  return { result, clarifications };
}

// Conflicts (datenmodell.md 2.5): more than one live result in one procedure. Resolved
// only when every participant carries a distinct priority; then the smallest wins.
function resolveConflicts(results: RuleResult[], rulesByRef: Map<string, Rule>, clarifications: Clarification[]): RuleResult[] {
  const byProcedure = new Map<string, RuleResult[]>();
  for (const r of results) {
    if (r.eligibility !== "matches" && r.eligibility !== "unclear") continue;
    byProcedure.set(r.procedure, [...(byProcedure.get(r.procedure) ?? []), r]);
  }
  const dropped = new Set<RuleResult>();
  for (const [procedure, live] of byProcedure) {
    if (live.length < 2) continue;
    const priorities = live.map((r) => rulesByRef.get(r.rule)!.priority);
    const resolved = priorities.every((p) => p !== undefined) && new Set(priorities).size === priorities.length;
    if (resolved) {
      const best = Math.min(...(priorities as number[]));
      for (const [i, r] of live.entries()) if (priorities[i] !== best) dropped.add(r);
    } else {
      clarifications.push(`rule_conflict:${procedure}`);
      for (const r of live) {
        r.eligibility = "unclear";
        r.text_key = "results.rule_conflict";
      }
    }
  }
  return results.filter((r) => !dropped.has(r));
}

export function evaluate(input: EvaluationInput, rules: Rule[], options: EvaluateOptions = {}): EvaluationOutput {
  const active = rules.filter((r) => evaluable(r, options.include ?? "published"));
  const groups = groupById(active);
  const rulesByRef = new Map(active.map((r) => [versionRef(r), r]));
  const persons: PersonEvaluation[] = [];

  for (const person of input.persons) {
    let results: RuleResult[] = [];
    const clarifications: Clarification[] = [];
    const errors: EvaluationError[] = [];
    for (const group of groups) {
      const outcome = evaluateRuleGroup(group, person.facts, input.reference_date, input.calendar);
      if (outcome.error) errors.push(outcome.error);
      if (outcome.result) results.push(outcome.result);
      clarifications.push(...outcome.clarifications);
    }
    results = resolveConflicts(results, rulesByRef, clarifications);
    results.sort((a, b) => a.rule.localeCompare(b.rule));
    persons.push({ person: person.id, results, clarifications: [...new Set(clarifications)].sort(), errors });
  }

  const rule_versions = [...new Set(persons.flatMap((p) => p.results.map((r) => r.rule)))].sort();
  return { reference_date: input.reference_date, rule_versions, persons };
}

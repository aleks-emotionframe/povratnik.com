// Engine-Ausgabe → Planmodell (wizard-konzept.md 6, auf M2a reduziert). Keine eigene
// Eignungslogik: Zustände kommen ausschliesslich aus der Engine. Hier wird nur
// sortiert und gruppiert.

import type { EvaluationOutput, RuleResult } from "@povratnik/engine";
import type { Bundle, RuleView, TaskView } from "./content.ts";

export const PHASES = ["orient", "prepare", "move", "arrive", "stay"] as const;

export type PlanItem = { person: string; result: RuleResult; task: TaskView; rule: RuleView };

export type Plan = {
  /** Bis zu drei nächste Schritte; nicht aufgefüllt. */
  next: PlanItem[];
  phases: { phase: (typeof PHASES)[number]; items: PlanItem[] }[];
  /** Klärungen je Person, dedupliziert je Person. */
  open: { person: string; clarification: string }[];
  errors: { person: string; rule: string; message: string }[];
  rule_versions: string[];
  reference_date: string;
};

function dueOf(r: RuleResult): string | undefined {
  return r.deadline?.status === "computed" ? r.deadline.due : undefined;
}

// matches vor unclear; innerhalb: früheste berechnete Frist zuerst, dann ohne Frist.
function rank(a: PlanItem, b: PlanItem): number {
  const order = (e: string) => (e === "matches" ? 0 : 1);
  const byState = order(a.result.eligibility) - order(b.result.eligibility);
  if (byState !== 0) return byState;
  const da = dueOf(a.result);
  const db = dueOf(b.result);
  if (da && db) return da.localeCompare(db);
  if (da) return -1;
  if (db) return 1;
  return a.result.rule.localeCompare(b.result.rule);
}

export function buildPlan(out: EvaluationOutput, bundle: Bundle): Plan {
  const rules = new Map(bundle.rules.map((r) => [`${r.id}@${r.version}`, r]));
  const items: PlanItem[] = [];
  for (const p of out.persons) {
    for (const result of p.results) {
      const task = bundle.tasks[result.task];
      const rule = rules.get(result.rule);
      if (!task || !rule) continue; // Paket unvollständig: der Fehler wird unten gemeldet
      items.push({ person: p.person, result, task, rule });
    }
  }
  const live = items.filter((i) => i.result.eligibility === "matches" || i.result.eligibility === "unclear").sort(rank);
  const phases = PHASES.map((phase) => ({ phase, items: items.filter((i) => i.task.phase === phase).sort(rank) })).filter((g) => g.items.length > 0);

  const errors = out.persons.flatMap((p) => [
    ...p.errors.map((e) => ({ person: p.person, ...e })),
    ...p.results
      .filter((r) => !bundle.tasks[r.task] || !rules.has(r.rule))
      .map((r) => ({ person: p.person, rule: r.rule, message: `bundle is missing task ${r.task} or rule ${r.rule}` })),
  ]);

  return {
    next: live.slice(0, 3),
    phases,
    open: out.persons.flatMap((p) => p.clarifications.map((clarification) => ({ person: p.person, clarification }))),
    errors,
    rule_versions: out.rule_versions,
    reference_date: out.reference_date,
  };
}

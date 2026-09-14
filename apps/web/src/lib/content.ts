// Liest content/ zur Bauzeit und erzeugt das Regelpaket für die Wizard-Insel.
// Einzige Stelle, an der entschieden wird, welche Regeln öffentlich ausgewertet
// werden (CLAUDE.md 4): im Build nur freigegebene, veröffentlichte, nicht
// synthetische Regeln. Kein Umgebungsschalter kann das umgehen.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { Rule } from "@povratnik/engine";
import type { ReadingPage } from "./reading.ts";

type Doc = Record<string, any>;
type I18n = { de: string; [lang: string]: string | undefined };

export type TaskView = {
  id: string;
  title: I18n;
  purpose: I18n;
  phase: string;
  documents: { name: I18n; term?: { term_hr: string; term_explained: I18n } }[];
  authority: { key: string; name: I18n };
};

export type ProcedureView = { id: string; title: I18n; authority: { key: string; name: I18n } };

export type RuleView = Rule & { title: I18n; sources: { id: string; reference: string; checked: string }[] };

export type CalendarView = { id: string; title: I18n; checked: string };

export type Bundle = {
  // true, sobald eine aufgenommene Regel synthetisch ist. Die Seite zeigt dann das
  // Hinweisband, und die Insel wertet mit include: "all" aus.
  synthetic: boolean;
  rules: RuleView[];
  tasks: Record<string, TaskView>;
  procedures: Record<string, ProcedureView>;
  // Feiertage aus den Kalendern, die denselben Filter bestehen wie die Regeln.
  holidays: string[];
  calendars: CalendarView[];
  texts: Doc;
  // Themenseiten für die Leseempfehlung im Plan (lib/reading.ts); leer, wenn keine sichtbar.
  pages: ReadingPage[];
};

export type Content = { rules: RuleView[]; tasks: Doc[]; procedures: Doc[]; calendars: Doc[]; texts: Doc; pages?: ReadingPage[] };

function loadDir(dir: string): Doc[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => parse(readFileSync(join(dir, f), "utf8")));
}

export function loadContent(contentDir: string): Content {
  return {
    rules: loadDir(join(contentDir, "rules")) as RuleView[],
    tasks: loadDir(join(contentDir, "tasks")),
    procedures: loadDir(join(contentDir, "procedures")),
    calendars: loadDir(join(contentDir, "calendars")),
    texts: parse(readFileSync(join(contentDir, "i18n", "de.yaml"), "utf8")),
  };
}

type Lifecycle = Pick<Rule, "synthetic" | "approval" | "publication">;

function isPublished(d: Lifecycle): boolean {
  return !d.synthetic && d.approval.state === "approved" && d.publication.state === "published";
}

function passes(mode: "build" | "dev", d: Lifecycle): boolean {
  return mode === "build" ? isPublished(d) : d.publication.state !== "withdrawn";
}

export function bundleFor(mode: "build" | "dev", content: Content): Bundle {
  const rules = content.rules.filter((r) => passes(mode, r));
  const calendars = content.calendars.filter((c) => passes(mode, c as Lifecycle));
  const holidays = [...new Set(calendars.flatMap((c) => (c.holidays as Doc[]).map((h) => h.date as string)))].sort();
  const taskIds = new Set(rules.map((r) => r.result.task));
  const procedureIds = new Set(rules.map((r) => r.scope.procedure));
  const tasks: Record<string, TaskView> = {};
  for (const t of content.tasks) {
    if (!taskIds.has(t.id)) continue;
    tasks[t.id] = { id: t.id, title: t.title, purpose: t.purpose, phase: t.phase, documents: t.documents ?? [], authority: t.authority };
  }
  const procedures: Record<string, ProcedureView> = {};
  for (const p of content.procedures) {
    if (procedureIds.has(p.id)) procedures[p.id] = { id: p.id, title: p.title, authority: p.authority };
  }
  return {
    synthetic: rules.some((r) => r.synthetic),
    rules,
    tasks,
    procedures,
    holidays,
    calendars: calendars.map((c) => ({ id: c.id, title: c.title, checked: c.sources?.[0]?.checked ?? "" })),
    texts: content.texts,
    pages: content.pages ?? [],
  };
}

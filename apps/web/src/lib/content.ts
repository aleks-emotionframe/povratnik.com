// Liest content/ zur Bauzeit und erzeugt das Regelpaket für die Wizard-Insel.
// Einzige Stelle, an der entschieden wird, welche Regeln öffentlich ausgewertet
// werden (CLAUDE.md 4): im Build nur freigegebene, veröffentlichte, nicht
// synthetische Regeln. Kein Umgebungsschalter kann das umgehen.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { Rule } from "@povratnik/engine";

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

export type Bundle = {
  // true, sobald eine aufgenommene Regel synthetisch ist. Die Seite zeigt dann das
  // Hinweisband, und die Insel wertet mit include: "all" aus.
  synthetic: boolean;
  rules: RuleView[];
  tasks: Record<string, TaskView>;
  procedures: Record<string, ProcedureView>;
  texts: Doc;
};

export type Content = { rules: RuleView[]; tasks: Doc[]; procedures: Doc[]; texts: Doc };

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
    texts: parse(readFileSync(join(contentDir, "i18n", "de.yaml"), "utf8")),
  };
}

function isPublished(rule: Rule): boolean {
  return !rule.synthetic && rule.approval.state === "approved" && rule.publication.state === "published";
}

export function bundleFor(mode: "build" | "dev", content: Content): Bundle {
  const rules = content.rules.filter((r) =>
    mode === "build" ? isPublished(r) : r.publication.state !== "withdrawn",
  );
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
  return { synthetic: rules.some((r) => r.synthetic), rules, tasks, procedures, texts: content.texts };
}

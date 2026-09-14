// Liest die Themenseiten aus content/pages zur Bauzeit. Welche Seiten erscheinen,
// entscheidet die Stufe (stage.ts, ADR-0004): auf "test" alle nicht zurückgezogenen,
// auf "public" nur freigegebene und veröffentlichte. Synthetische Beispielseiten
// erscheinen nie; sie sind Testfixtures (CLAUDE.md 4).

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { STAGE } from "./stage.ts";

type I18n = { de: string; [lang: string]: string | undefined };

export type PageSections = {
  applies_to?: string;
  not_applies_to?: string;
  authority?: string;
  prerequisites?: string[];
  steps?: string[];
  documents?: string[];
  duration_costs?: string;
  deadlines?: string[];
  common_mistake?: string;
  not_decided_here?: string;
  open_points?: string[];
};

export type PageView = {
  id: string;
  lang: string;
  type: string;
  depth: "full" | "short";
  category?: string;
  covers: string[];
  title: string;
  short_answer: string;
  terms: { term_hr: string; term_explained: I18n }[];
  sections: PageSections;
  links: { requires_pages: string[]; followed_by_pages: string[] };
  sources: { id: string; reference: string; checked: string }[];
  approval: { state: string; reviewer?: string; approved_at?: string };
  publication: { state: string };
  validity: { valid_from: string; valid_until: { kind: string; date: string | null }; transitional: I18n | null };
  review: { next_check: string; cycle: string };
};

export type SourceView = { id: string; url: string; title: string; publisher: string; tier: number };

function loadDir(dir: string): Record<string, any>[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => parse(readFileSync(join(dir, f), "utf8")));
}

function visible(p: PageView): boolean {
  if ((p as any).synthetic === true) return false;
  if (STAGE === "public") return p.approval.state === "approved" && p.publication.state === "published";
  return p.publication.state !== "withdrawn";
}

export function loadPages(contentDir: string, lang = "de"): PageView[] {
  return (loadDir(join(contentDir, "pages")) as PageView[])
    .filter((p) => p.lang === lang && p.type === "topic")
    .map((p) => ({ ...p, covers: p.covers ?? [], sections: p.sections ?? {}, terms: p.terms ?? [] }))
    .filter(visible);
}

export function loadSources(contentDir: string): Record<string, SourceView> {
  const out: Record<string, SourceView> = {};
  for (const s of loadDir(join(contentDir, "sources"))) out[s.id] = { id: s.id, url: s.url, title: s.title, publisher: s.publisher, tier: s.tier };
  return out;
}

/** Kennzeichnungsgrad nach inhaltskonzept.md 4.3, abgeleitet aus dem Freigabestatus. */
export function pageState(p: PageView): { key: "matches" | "unclear"; label: string } {
  return p.approval.state === "approved"
    ? { key: "matches", label: "fachlich geprüft" }
    : { key: "unclear", label: "Grundlagen vorhanden, fachlich nicht geprüft" };
}

export function pagePath(p: PageView): string {
  return `/wissen/${p.category}/${p.id}`;
}

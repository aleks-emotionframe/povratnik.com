// Leseempfehlung für den Plan: Themenseiten, die nach den Antworten zum Haushalt passen.
// Das ist eine Produktregel (redaktionsgrundsaetze.md 2), keine Anspruchsprüfung: Sie
// wählt Lesestoff aus, trifft keine Aussage über einen Anspruch. Unbekannt schliesst
// nie aus: Wer die Staatsangehörigkeit nicht kennt, bekommt die Statusseiten.

import type { Answers, PersonAnswers } from "./questions.ts";

export type ReadingPage = { id: string; title: string; path: string; category: string; documents: string[] };

const ALWAYS = ["oib", "wohnsitz-anmelden", "krankenversicherung"];

function has(p: PersonAnswers, c: string): boolean {
  return (p.citizenships ?? []).includes(c);
}
function citizenshipUnknown(p: PersonAnswers): boolean {
  const c = p.citizenships ?? [];
  return c.length === 0 || c.includes("unknown");
}

function pagesFor(p: PersonAnswers, a: Answers): string[] {
  const ids = [...ALWAYS];
  const noHr = !has(p, "hr");
  if (noHr && (citizenshipUnknown(p) || p.link === "parent" || p.link === "ancestor" || p.link === "unknown" || p.link === undefined)) {
    ids.push("staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "apostille-und-uebersetzung");
  }
  if (noHr && !has(p, "eea") && !has(p, "ch") && (p.income === "remote_employer_abroad" || p.income === "unknown")) ids.push("digitaler-nomade");
  if (p.income === "self_employment" || p.income === "unknown") ids.push("pauschalgewerbe");
  if ((p.income === "self_employment" || p.income === "unknown") && (has(p, "hr") || citizenshipUnknown(p))) ids.push("biram-hrvatsku");
  if (has(p, "hr") || citizenshipUnknown(p)) ids.push("lohnsteuerbefreiung");
  if (p.role === "child") ids.push("schule-und-zeugnisse");
  if (a.stage === "arrived" && p.role !== "child") ids.push("fuehrerschein-umschreiben");
  return ids;
}

export function readingFor(a: Answers, pages: ReadingPage[]): { page: ReadingPage; persons: string[] }[] {
  const byId = new Map(pages.map((p) => [p.id, p]));
  const out = new Map<string, { page: ReadingPage; persons: string[] }>();
  for (const person of a.persons) {
    for (const id of pagesFor(person, a)) {
      const page = byId.get(id);
      if (!page) continue;
      const entry = out.get(id) ?? { page, persons: [] };
      if (!entry.persons.includes(person.id)) entry.persons.push(person.id);
      out.set(id, entry);
    }
  }
  return [...out.values()];
}

export function documentsFor(reading: { page: ReadingPage }[]): string[] {
  return [...new Set(reading.flatMap((r) => r.page.documents))];
}

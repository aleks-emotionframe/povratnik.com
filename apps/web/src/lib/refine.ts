// Vertiefende Fragen (wizard-konzept.md 2.3): erscheinen erst nach der Zusammenfassung,
// nur wenn die Hauptantworten sie auslösen. Struktur hier, Texte in content/i18n/de.yaml
// unter wizard.refine.*. Jede Frage hat «weiss ich nicht» als gleichwertige Antwort.

import type { Answers, PersonAnswers } from "./questions.ts";

export type RefineQuestion = {
  id: "children" | "founding" | "place" | "property" | "pension" | "regulated" | "care";
  /** Fragen je Person tragen die Person, Haushaltsfragen nicht. */
  person?: PersonAnswers;
  /** Teilfragen mit ihren Antwortwerten; "unknown" wird überall ergänzt. */
  fields: { key: string; options: string[] }[];
};

const AGE = ["0_5", "6_14", "15_18"];
const YES_NO = ["yes", "no"];

export function refineQuestions(a: Answers, placeIds: string[]): RefineQuestion[] {
  const out: RefineQuestion[] = [];
  for (const p of a.persons.filter((x) => x.role === "child")) {
    out.push({ id: "children", person: p, fields: [{ key: "age", options: AGE }, { key: "croatian", options: ["yes", "some", "no"] }] });
  }
  if (a.persons.some((p) => p.income === "self_employment")) {
    out.push({ id: "founding", fields: [{ key: "sector", options: ["allowed", "excluded"] }, { key: "founded", options: YES_NO }] });
  }
  out.push({ id: "place", fields: [{ key: "place", options: [...placeIds, "none"] }] });
  out.push({ id: "property", fields: [{ key: "property", options: ["buy", "rent", "inherited"] }] });
  for (const p of a.persons.filter((x) => x.income === "pension_or_assets")) {
    out.push({ id: "pension", person: p, fields: [{ key: "pension", options: ["ar", "cl", "br", "de", "ch", "at", "us", "ca", "other"] }] });
  }
  for (const p of a.persons.filter((x) => x.income === "employment" || x.income === "self_employment")) {
    out.push({ id: "regulated", person: p, fields: [{ key: "regulated", options: YES_NO }] });
  }
  out.push({ id: "care", fields: [{ key: "care", options: YES_NO }] });
  return out;
}

export function refineValue(a: Answers, q: RefineQuestion, key: string): string | undefined {
  const r = a.refine ?? {};
  switch (q.id) {
    case "children": return r.children?.[q.person!.id]?.[key as "age" | "croatian"];
    case "founding": return r.founding?.[key as "sector" | "founded"];
    case "place": return r.place;
    case "property": return r.property;
    case "pension": return r.pension?.[q.person!.id];
    case "regulated": return r.regulated?.[q.person!.id];
    case "care": return r.care;
  }
}

export function withRefine(a: Answers, q: RefineQuestion, key: string, value: string): Answers {
  const r = { ...(a.refine ?? {}) };
  switch (q.id) {
    case "children": r.children = { ...(r.children ?? {}), [q.person!.id]: { ...(r.children?.[q.person!.id] ?? {}), [key]: value } }; break;
    case "founding": r.founding = { ...(r.founding ?? {}), [key]: value }; break;
    case "place": r.place = value; break;
    case "property": r.property = value; break;
    case "pension": r.pension = { ...(r.pension ?? {}), [q.person!.id]: value }; break;
    case "regulated": r.regulated = { ...(r.regulated ?? {}), [q.person!.id]: value }; break;
    case "care": r.care = value; break;
  }
  return { ...a, refine: r };
}

export function refineAnswered(a: Answers, placeIds: string[]): number {
  let n = 0;
  for (const q of refineQuestions(a, placeIds)) for (const f of q.fields) if (refineValue(a, q, f.key) !== undefined) n++;
  return n;
}

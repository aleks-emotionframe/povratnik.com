// Produktregeln für die persönliche Zusammenfassung (wizard-konzept.md 6): «Was für Sie
// anders ist», die Kette der vier Schlüssel, zusätzliche Klärungen aus den vertiefenden
// Angaben, die Fristenliste, wer weiterhilft. Keine Anspruchsprüfung: Alles hier sind
// Textschlüssel und Verweise; Zustände zu Ansprüchen kommen ausschliesslich aus der
// Engine (lib/plan.ts). Unbekannt wird nie zu einem Ausschluss.

import type { Answers, PersonAnswers } from "./questions.ts";
import type { Plan } from "./plan.ts";

export type PlaceSummary = {
  id: string;
  name: string;
  benefits: { title: string; state: string; until: string | null; target: string }[];
  arrival: { office: string; function: string; languages: string[]; channel: string };
};

export type CountrySummary = { code: string; title: string; path: string; representation: { state: string; value?: string } };

function has(p: PersonAnswers, c: string): boolean {
  return (p.citizenships ?? []).includes(c);
}
function citizenshipUnknown(p: PersonAnswers): boolean {
  const c = p.citizenships ?? [];
  return c.length === 0 || c.includes("unknown");
}

/** Bis zu vier Sätze, was diesen Haushalt vom Standardfall unterscheidet. Schlüssel unter summary.different.* */
export function differences(a: Answers): { key: string; person?: string }[] {
  const out: { key: string; person?: string }[] = [];
  const unknown = a.persons.filter(citizenshipUnknown);
  for (const p of unknown) out.push({ key: "status_unknown", person: p.id });
  const sets = a.persons.map((p) => (p.citizenships ?? []).filter((c) => c !== "unknown").sort().join(","));
  if (a.persons.length > 1 && new Set(sets).size > 1 && unknown.length < a.persons.length) out.push({ key: "mixed_household" });
  if (a.stage === "arrived") out.push({ key: "arrived" });
  if (a.persons.some((p) => p.income === "self_employment" && (has(p, "hr") || citizenshipUnknown(p)))) out.push({ key: "self_employed_tax" });
  if (a.persons.some((p) => p.income === "remote_employer_abroad")) out.push({ key: "remote" });
  if (a.persons.some((p) => p.role === "child")) out.push({ key: "children" });
  if (a.refine?.founding?.founded === "yes") out.push({ key: "already_founded" });
  return out.slice(0, 4);
}

export type ChainKey = { key: "status" | "oib" | "registration" | "insurance"; state: "clear" | "open" | "next" };

/** Die Kette der vier Schlüssel mit der Engstelle dieses Haushalts. */
export function chain(a: Answers): ChainKey[] {
  const statusClear = a.persons.length > 0 && a.persons.every((p) => has(p, "hr") || has(p, "eea") || has(p, "ch"));
  const arrived = a.stage === "arrived";
  return [
    { key: "status", state: statusClear ? "clear" : "open" },
    { key: "oib", state: statusClear ? "next" : "open" },
    { key: "registration", state: arrived ? "next" : "open" },
    { key: "insurance", state: arrived ? "next" : "open" },
  ];
}

/** Zusätzliche Klärungen aus den vertiefenden Angaben. Schlüssel unter summary.clarify.* */
export function refinements(a: Answers): { key: string; person?: string }[] {
  const r = a.refine ?? {};
  const out: { key: string; person?: string }[] = [];
  if (r.founding?.founded === "yes") out.push({ key: "founded_deadline" });
  if (r.founding?.sector === "excluded") out.push({ key: "sector_excluded" });
  if (r.founding?.sector === "unknown") out.push({ key: "sector_unknown" });
  for (const [person, v] of Object.entries(r.regulated ?? {})) if (v === "yes" || v === "unknown") out.push({ key: "regulated", person });
  if (r.care === "yes" || r.care === "unknown") out.push({ key: "care" });
  if (r.property === "inherited") out.push({ key: "inherited" });
  if (r.property === "buy") out.push({ key: "buy" });
  for (const [person, v] of Object.entries(r.children ?? {})) if (v.croatian === "no" || v.croatian === "some") out.push({ key: "child_language", person });
  for (const [person, v] of Object.entries(r.pension ?? {})) if (v === "ar" || v === "br" || v === "us") out.push({ key: "pension_no_agreement", person });
  return out;
}

export type DeadlineEntry = { kind: "legal" | "funding"; label: string; date?: string; person?: string; href?: string; note?: string };

/** Alles Datumsgebundene an einem Ort (inhaltskonzept.md 6.2 D). Vier Arten; hier belegt: gesetzlich aus Regeln, Förderfrist aus Leistungen. */
export function deadlines(plan: Plan, place: PlaceSummary | undefined, dated: { title: string; path: string; until: string }[]): DeadlineEntry[] {
  const out: DeadlineEntry[] = [];
  for (const g of plan.phases) {
    for (const item of g.items) {
      const d = item.result.deadline;
      if (!d) continue;
      if (d.status === "computed") out.push({ kind: "legal", label: item.task.title.de, date: d.due, person: item.person });
      else out.push({ kind: "legal", label: item.task.title.de, person: item.person, note: "awaiting" });
    }
  }
  for (const p of dated) out.push({ kind: "funding", label: p.title, date: p.until, href: p.path });
  for (const b of place?.benefits ?? []) if (b.state === "open" || b.state === "announced") out.push({ kind: "funding", label: `${b.title}, ${place!.name}`, date: b.until ?? undefined, href: `/orte/${place!.id}`, note: b.until ? undefined : "unknown" });
  return out.sort((x, y) => (x.date ?? "9").localeCompare(y.date ?? "9"));
}

const COUNTRY_PAGE: Record<string, string> = { ar: "land-argentinien", cl: "land-chile", br: "land-brasilien", de: "land-deutschland", ch: "land-schweiz", us: "land-usa" };

export function countryFor(code: string | undefined, countries: CountrySummary[]): CountrySummary | undefined {
  const id = code ? COUNTRY_PAGE[code] : undefined;
  return id ? countries.find((c) => c.code === id) : undefined;
}

/** Programmzustand (Vokabular B) für die Insel, ohne Node-Abhängigkeit aus lib/places.ts. */
export const PROGRAM_LABEL: Record<string, { label: string; css: string }> = {
  open: { label: "offen", css: "matches" },
  announced: { label: "angekündigt", css: "announced" },
  closed: { label: "geschlossen", css: "closed" },
  exhausted: { label: "ausgeschöpft", css: "closed" },
  unconfirmed: { label: "unbestätigt", css: "unknown" },
  budget_unknown: { label: "Budget unbekannt", css: "unknown" },
};

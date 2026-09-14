// Orte für die Teststufe (ADR-0004): fiktive Testgemeinden aus src/data/places.demo.yaml.
// Nach ADR-0001 kommen echte Orte aus der Datenbank (M5); dann ersetzt ein Datenbank-
// zugriff diese Datei. Auf Stufe "public" gibt es keine fiktiven Orte.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { STAGE } from "./stage.ts";

/** Fachwert mit vier Dimensionen (CLAUDE.md 2.4). Unbekannt wird nie zu null oder falsch. */
export type Fact = {
  value?: string | number | null;
  state: "known" | "unknown" | "not_collected" | "outdated" | "not_applicable" | "not_present";
  as_of?: string;
  source?: string;
  note?: string;
};

export type ProgramState = "open" | "announced" | "closed" | "exhausted" | "unconfirmed" | "budget_unknown";

export type Benefit = {
  id: string;
  title: string;
  target: string;
  amount: Fact;
  conditions: string[];
  application: { from: string | null; until: string | null };
  program_state: ProgramState;
  budget: Fact;
  binding: string;
  checked: string;
  source: string;
};

export type Place = {
  id: string;
  fictional: boolean;
  name: string;
  county: string;
  region: "coast" | "inland";
  population: Fact;
  development_index: Fact;
  summary: string;
  benefits: Benefit[];
  family_education: Record<string, Fact>;
  health: Record<string, Fact>;
  housing: Record<string, Fact>;
  work: { sectors: string[]; commute: { to: string; minutes: number }[]; employers: Fact };
  daily: { internet: Fact; transport: Fact; language_courses: Fact; clubs: string[]; church: Fact; shopping: Fact };
  surroundings: { what: string; where: string; minutes: number }[];
  arrival: { office: Fact; function: string; languages: string[]; channel: string };
  changes: { title: string; state: "announced" | "decided" | "funded" | "under_construction" | "operating"; as_of: string }[];
  data_depth: { collected: number; total: number };
};

export function loadPlaces(): Place[] {
  if (STAGE === "public") return [];
  const file = join(process.cwd(), "src", "data", "places.demo.yaml");
  return (parse(readFileSync(file, "utf8")) as Place[]).filter((p) => p.fictional === true);
}

export function placeName(p: Place): string {
  return p.fictional ? `${p.name} (fiktiv)` : p.name;
}

/** Wortlaut je Zustand, immer mit Text, nie nur Farbe (designsystem.md 4). */
export const PROGRAM_STATE: Record<ProgramState, { label: string; css: string }> = {
  open: { label: "offen", css: "matches" },
  announced: { label: "angekündigt", css: "announced" },
  closed: { label: "geschlossen", css: "closed" },
  exhausted: { label: "ausgeschöpft", css: "closed" },
  unconfirmed: { label: "unbestätigt", css: "unknown" },
  budget_unknown: { label: "Budget unbekannt", css: "unknown" },
};

export const CHANGE_STATE: Record<Place["changes"][number]["state"], string> = {
  announced: "angekündigt",
  decided: "beschlossen",
  funded: "finanziert",
  under_construction: "im Bau",
  operating: "in Betrieb",
};

export const REGION: Record<Place["region"], string> = { coast: "Küste", inland: "Landesinneres" };

export function formatDate(iso: string): string {
  return iso.split("-").reverse().join(".");
}

export function openBenefits(p: Place): number {
  return p.benefits.filter((b) => b.program_state === "open").length;
}

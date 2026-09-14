// Antworten des Kurzchecks → Fakten für die Engine (datenmodell.md 3, Fakten-Pfade).
// Reine Funktion. Unbeantwortet oder «weiss ich nicht» wird ein unbekannter Fakt,
// nie ein Standardwert (CLAUDE.md 2.4).

import type { Fact, Facts, PersonInput } from "@povratnik/engine";
import { UNKNOWN, type Answers, type PersonAnswers } from "./questions.ts";

const CITIZENSHIP: Record<string, string> = {
  hr: "hr_citizen",
  eea: "eea_citizen",
  ch: "ch_citizen",
  other: "third_country",
  stateless: "stateless",
};

const known = (value: unknown): Fact => ({ availability: "known", value });
const unknown: Fact = { availability: "unknown" };

function single(value: string | undefined): Fact {
  return value === undefined || value === "" || value === UNKNOWN ? unknown : known(value);
}

export function factsFor(a: Answers, p: PersonAnswers): Facts {
  const facts: Facts = {};
  facts["person.stage"] = single(a.stage);
  facts["person.move_horizon"] = single(a.horizon);
  facts["person.country"] = single(p.country);
  facts["person.croatian_link"] = single(p.link);
  facts["person.income_source"] = single(p.income);

  const c = p.citizenships ?? [];
  facts["person.citizenship_status"] = c.length === 0 || c.includes(UNKNOWN) ? unknown : known(c.map((v) => CITIZENSHIP[v] ?? v));

  // Wer noch nicht eingereist ist, hat in Kroatien bekanntermassen keinen Status und
  // noch kein Einreisedatum. Bei Eingereisten kommen beide aus den Zusatzfragen.
  if (a.stage === "arrived") {
    facts["person.residence_status"] = single(p.residence);
    facts["event.entry"] = single(p.entry);
  } else if (a.stage !== undefined) {
    facts["person.residence_status"] = known("none");
    facts["event.entry"] = unknown;
  } else {
    facts["person.residence_status"] = unknown;
    facts["event.entry"] = unknown;
  }
  return facts;
}

export function personsInput(a: Answers): PersonInput[] {
  return a.persons.map((p) => ({ id: p.id, facts: factsFor(a, p) }));
}

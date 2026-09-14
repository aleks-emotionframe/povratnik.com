// Kurzcheck nach wizard-konzept.md 2.2 als Daten: Ids, Antwortwerte, Textschlüssel.
// Texte stehen in content/i18n/de.yaml unter wizard.*; hier nur Struktur.
// «Weiss ich nicht» ist überall eine gleichwertige Antwort (Wert "unknown").

export const UNKNOWN = "unknown";

export type Stage = "exploring" | "planning" | "arrived";
export type Household = "alone" | "partner" | "partner_children" | "alone_children" | "others";
export type Horizon = "within_6_months" | "6_to_12_months" | "later_or_unclear";
export type Role = "self" | "partner" | "child" | "other";

export type PersonAnswers = {
  id: string;
  role: Role;
  country?: string;
  citizenships?: string[];
  link?: string;
  income?: string;
  residence?: string;
  entry?: string;
};

/** Vertiefende Angaben nach der Zusammenfassung (wizard-konzept.md 2.3). Alle freiwillig,
    «weiss ich nicht» ist überall gültig. Sie wirken auf Leseempfehlung, Klärungsliste und
    Zielort, nie auf die Regelauswertung selbst. */
export type Refine = {
  children?: Record<string, { age?: string; croatian?: string }>;
  founding?: { sector?: string; founded?: string };
  place?: string;
  property?: string;
  pension?: Record<string, string>;
  regulated?: Record<string, string>;
  care?: string;
};

export type Answers = {
  stage?: Stage;
  household?: Household;
  horizon?: Horizon;
  persons: PersonAnswers[];
  refine?: Refine;
};

export type Question = {
  id: "stage" | "household" | "country" | "citizenship" | "link" | "horizon" | "income" | "residence" | "entry";
  scope: "household" | "person";
  kind: "single" | "multi" | "date";
  options: string[];
  /** Vorschläge ohne Anspruch auf Vollständigkeit; "other" steht für alle übrigen. */
  unknownOption: boolean;
};

export const QUESTIONS: Record<Question["id"], Question> = {
  stage: { id: "stage", scope: "household", kind: "single", options: ["exploring", "planning", "arrived"], unknownOption: false },
  household: { id: "household", scope: "household", kind: "single", options: ["alone", "partner", "partner_children", "alone_children", "others"], unknownOption: false },
  country: { id: "country", scope: "person", kind: "single", options: ["ar", "cl", "de", "ch", "at", "ca", "other"], unknownOption: true },
  citizenship: { id: "citizenship", scope: "person", kind: "multi", options: ["hr", "eea", "ch", "other", "stateless"], unknownOption: true },
  link: { id: "link", scope: "person", kind: "single", options: ["parent", "ancestor", "former_residence", "partner", "none"], unknownOption: true },
  horizon: { id: "horizon", scope: "household", kind: "single", options: ["within_6_months", "6_to_12_months", "later_or_unclear"], unknownOption: false },
  income: { id: "income", scope: "person", kind: "single", options: ["employment", "self_employment", "remote_employer_abroad", "pension_or_assets", "study"], unknownOption: true },
  residence: {
    id: "residence",
    scope: "person",
    kind: "single",
    options: ["eea_registered", "temporary_residence", "diaspora_certificate", "digital_nomad", "permanent_residence", "long_term_residence", "none"],
    unknownOption: true,
  },
  entry: { id: "entry", scope: "person", kind: "date", options: [], unknownOption: true },
};

// Personen je Haushaltsvorgabe (Q03). Weitere Personen können ergänzt werden.
export function personsFor(household: Household): PersonAnswers[] {
  const presets: Record<Household, Role[]> = {
    alone: ["self"],
    partner: ["self", "partner"],
    partner_children: ["self", "partner", "child"],
    alone_children: ["self", "child"],
    others: ["self", "other"],
  };
  const roles = presets[household];
  return roles.map((role, i) => ({ id: `p${i + 1}`, role }));
}

export type Step = { question: Question; person?: PersonAnswers };

// Reihenfolge nach wizard-konzept 2.2: Q02, Q03, je Person Q04 und Q05/Q06, Q07, je
// Person Q08, danach die Zusatzfragen für bereits Eingereiste.
export function stepsFor(a: Answers): Step[] {
  const steps: Step[] = [{ question: QUESTIONS.stage }, { question: QUESTIONS.household }];
  if (!a.household) return steps;
  for (const p of a.persons) steps.push({ question: QUESTIONS.country, person: p });
  for (const p of a.persons) steps.push({ question: QUESTIONS.citizenship, person: p }, { question: QUESTIONS.link, person: p });
  steps.push({ question: QUESTIONS.horizon });
  for (const p of a.persons) steps.push({ question: QUESTIONS.income, person: p });
  if (a.stage === "arrived") {
    for (const p of a.persons) steps.push({ question: QUESTIONS.residence, person: p }, { question: QUESTIONS.entry, person: p });
  }
  return steps;
}

export function answerOf(a: Answers, step: Step): string | string[] | undefined {
  const q = step.question.id;
  if (q === "stage" || q === "household" || q === "horizon") return a[q];
  const p = step.person!;
  switch (q) {
    case "country": return p.country;
    case "citizenship": return p.citizenships;
    case "link": return p.link;
    case "income": return p.income;
    case "residence": return p.residence;
    case "entry": return p.entry;
  }
}

export function isAnswered(a: Answers, step: Step): boolean {
  const v = answerOf(a, step);
  return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "";
}

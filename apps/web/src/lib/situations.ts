// Einstiege nach Lebenssituation (inhaltskonzept.md 4.3): dieselben Themen, kuratiert als
// Pfad in einer anderen Reihenfolge. Kein neuer Inhalt; die Schritte verweisen auf
// Themenseiten (content/pages) und Rubriken.

export type Situation = {
  slug: string;
  title: string;
  intro: string;
  /** Reihenfolge der Themenseiten (ids aus content/pages). */
  path: string[];
  /** Rubriken, die für diese Situation zusätzlich zählen. */
  rubrics: string[];
  /** Woran diese Gruppe typischerweise scheitert. */
  trap: string;
};

export const SITUATIONS: Situation[] = [
  {
    slug: "familie",
    title: "Ich komme mit Familie",
    intro: "Jede Person in der Familie hat ihren eigenen Weg: eigenen Pass, eigene Papiere, eigene Krankenversicherung. Planen Sie darum für jedes Familienmitglied einzeln.",
    path: ["staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "apostille-und-uebersetzung", "oib", "wohnsitz-anmelden", "krankenversicherung", "schule-und-zeugnisse", "lohnsteuerbefreiung"],
    rubrics: ["kinder-schule-und-ausbildung", "wohnen-und-regionen", "sprache-und-gemeinschaft"],
    trap: "Die Krankenversicherung der Kinder hängt an der Versicherung der Eltern. Wer die Lücke nicht vorher plant, steht in den ersten Wochen ohne Kinderarzt da.",
  },
  {
    slug: "selbstaendig",
    title: "Ich möchte gründen",
    intro: "Manche Förderungen müssen Sie vor der Gründung beantragen, andere wenige Tage danach. Wer die Reihenfolge nicht kennt, verliert Geld.",
    path: ["oib", "wohnsitz-anmelden", "biram-hrvatsku", "pauschalgewerbe", "krankenversicherung", "lohnsteuerbefreiung"],
    rubrics: ["unternehmen-gruenden", "leistungen-und-foerderung", "steuern-geld-und-pension"],
    trap: "Zuerst gründen, dann lesen. Wer die Tätigkeit anmeldet und den Antrag zu spät stellt, hat die Rückkehrförderung verloren.",
  },
  {
    slug: "pensioniert",
    title: "Ich bin pensioniert",
    intro: "Rente aus dem Ausland, Krankenversicherung ohne Arbeitgeber, Doppelbesteuerung. Bei Steuern und Sozialversicherung hilft Ihnen eine kroatische Fachperson.",
    path: ["staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "oib", "wohnsitz-anmelden", "krankenversicherung", "immobilienkauf"],
    rubrics: ["steuern-geld-und-pension", "gesundheit-und-pflege", "wohnen-und-regionen"],
    trap: "Mit den USA, Argentinien und Brasilien besteht kein Doppelbesteuerungsabkommen. Auslandsrenten aus diesen Ländern sind bis 31.1. für das Vorjahr zu melden.",
  },
  {
    slug: "ohne-pass",
    title: "Ich habe keinen kroatischen Pass",
    intro: "Ohne kroatischen Pass kommt es darauf an, mit welchem Recht Sie bleiben dürfen: als Bürger von EU, EWR oder Schweiz, als Nachkomme von Auswanderern mit Bescheinigung, sonst mit Arbeitsaufenthalt oder als digitaler Nomade.",
    path: ["bescheinigung-auswanderer", "digitaler-nomade", "apostille-und-uebersetzung", "oib", "wohnsitz-anmelden", "krankenversicherung", "fuehrerschein-umschreiben"],
    rubrics: ["status-und-staatsangehoerigkeit", "arbeit-und-qualifikation"],
    trap: "Die Bescheinigung für Auswanderer mit der Einbürgerung verwechseln. Die Bescheinigung erlaubt den Aufenthalt und kann gleichzeitig mit dem Antrag auf den Pass laufen.",
  },
  {
    slug: "allein",
    title: "Ich komme allein",
    intro: "Der kürzeste Weg: Status, OIB, Anmeldung, Krankenversicherung. Danach zählt der Anschluss an Menschen und Sprache, denn daran scheitert die Rückkehr am häufigsten.",
    path: ["staatsangehoerigkeit-abstammung", "oib", "wohnsitz-anmelden", "krankenversicherung", "lohnsteuerbefreiung", "fuehrerschein-umschreiben"],
    rubrics: ["arbeit-und-qualifikation", "sprache-und-gemeinschaft", "wohnen-und-regionen"],
    trap: "Ans Bleiben denkt kaum jemand. Sprache, Vereine und Menschen, die einen mitnehmen, gehören von Anfang an in den Plan.",
  },
  {
    slug: "arbeitgeber-im-ausland",
    title: "Ich arbeite für einen Arbeitgeber im Ausland",
    intro: "Wer aus Kroatien für einen Arbeitgeber im Ausland arbeitet, braucht je nach Pass ein anderes Aufenthaltsrecht und muss die Steuerfrage früh klären.",
    path: ["digitaler-nomade", "bescheinigung-auswanderer", "oib", "wohnsitz-anmelden", "krankenversicherung"],
    rubrics: ["steuern-geld-und-pension", "arbeit-und-qualifikation"],
    trap: "Nach 183 Tagen im Jahr gilt man in Kroatien als steuerlich ansässig. Wer mitten im Jahr umzieht, ist möglicherweise in zwei Ländern steuerpflichtig. Das klärt eine Steuerfachperson, nicht diese Website.",
  },
];

export function situationBySlug(slug: string): Situation | undefined {
  return SITUATIONS.find((s) => s.slug === slug);
}

/** Texte einer Situation in der Sprache des Katalogs (situations.<slug>.*), Rückfall Deutsch. */
export function situationText(s: Situation, texts: Record<string, unknown>): { title: string; intro: string; trap: string } {
  const node = ((texts.situations as Record<string, any>) ?? {})[s.slug] ?? {};
  return { title: node.title ?? s.title, intro: node.intro ?? s.intro, trap: node.trap ?? s.trap };
}

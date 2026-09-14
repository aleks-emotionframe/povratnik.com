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
    intro: "Partner und Kinder können verschiedene Staatsangehörigkeiten und Versicherungsgrundlagen haben. Jede Person hat ihren eigenen Weg, der Haushalt ist die Klammer.",
    path: ["staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "apostille-und-uebersetzung", "oib", "wohnsitz-anmelden", "krankenversicherung", "schule-und-zeugnisse", "lohnsteuerbefreiung"],
    rubrics: ["kinder-schule-und-ausbildung", "wohnen-und-regionen", "sprache-und-gemeinschaft"],
    trap: "Die Krankenversicherung der Kinder hängt an der Grundlage der Eltern. Wer die Lücke nicht vorher plant, steht in den ersten Wochen ohne Kinderarzt da.",
  },
  {
    slug: "selbstaendig",
    title: "Ich möchte gründen",
    intro: "Manche Förderungen verlangen den Antrag vor der Gründung, andere binnen weniger Tage danach. Die Reihenfolge entscheidet über den Anspruch.",
    path: ["oib", "wohnsitz-anmelden", "biram-hrvatsku", "pauschalgewerbe", "krankenversicherung", "lohnsteuerbefreiung"],
    rubrics: ["unternehmen-gruenden", "leistungen-und-foerderung", "steuern-geld-und-pension"],
    trap: "Zuerst gründen, dann lesen. Wer die Tätigkeit anmeldet und den Antrag zu spät stellt, hat die Rückkehrförderung verloren.",
  },
  {
    slug: "pensioniert",
    title: "Ich bin pensioniert",
    intro: "Rente aus dem Ausland, Krankenversicherung ohne Arbeitgeber, Doppelbesteuerung. Bei Steuern und Sozialversicherung ist eine kroatische Fachperson beizuziehen.",
    path: ["staatsangehoerigkeit-abstammung", "bescheinigung-auswanderer", "oib", "wohnsitz-anmelden", "krankenversicherung", "immobilienkauf"],
    rubrics: ["steuern-geld-und-pension", "gesundheit-und-pflege", "wohnen-und-regionen"],
    trap: "Mit den USA, Argentinien und Brasilien besteht kein Doppelbesteuerungsabkommen. Auslandsrenten aus diesen Ländern sind bis 31.1. für das Vorjahr zu melden.",
  },
  {
    slug: "ohne-pass",
    title: "Ich habe keinen kroatischen Pass",
    intro: "Ohne kroatische Staatsangehörigkeit hängt alles am Aufenthaltsweg: Freizügigkeit für EU, EWR und Schweiz, Bescheinigung für Nachkommen von Auswanderern, sonst Arbeitsaufenthalt oder digitaler Nomade.",
    path: ["bescheinigung-auswanderer", "digitaler-nomade", "apostille-und-uebersetzung", "oib", "wohnsitz-anmelden", "krankenversicherung", "fuehrerschein-umschreiben"],
    rubrics: ["status-und-staatsangehoerigkeit", "arbeit-und-qualifikation"],
    trap: "Die Bescheinigung für Auswanderer mit der Einbürgerung verwechseln. Sie ist ein Aufenthaltsweg und kann parallel zum Staatsangehörigkeitsverfahren laufen.",
  },
  {
    slug: "allein",
    title: "Ich komme allein",
    intro: "Der kürzeste Weg: Status, OIB, Anmeldung, Versicherung. Danach zählt der Anschluss, denn dort scheitert die Rückkehr am häufigsten.",
    path: ["staatsangehoerigkeit-abstammung", "oib", "wohnsitz-anmelden", "krankenversicherung", "lohnsteuerbefreiung", "fuehrerschein-umschreiben"],
    rubrics: ["arbeit-und-qualifikation", "sprache-und-gemeinschaft", "wohnen-und-regionen"],
    trap: "Die fünfte Phase, Bleiben, lassen alle weg. Sprache, Vereine und Menschen, die einen mitnehmen, gehören von Anfang an in den Plan.",
  },
  {
    slug: "arbeitgeber-im-ausland",
    title: "Ich arbeite für einen Arbeitgeber im Ausland",
    intro: "Wer aus Kroatien für einen Arbeitgeber im Ausland arbeitet, braucht je nach Staatsangehörigkeit einen anderen Aufenthaltsweg, und die Steuerfrage ist nicht trivial.",
    path: ["digitaler-nomade", "bescheinigung-auswanderer", "oib", "wohnsitz-anmelden", "krankenversicherung"],
    rubrics: ["steuern-geld-und-pension", "arbeit-und-qualifikation"],
    trap: "Steuerliche Ansässigkeit nach 183 Tagen. Wer das Jahr über umzieht, ist möglicherweise in zwei Ländern steuerpflichtig. Das klärt eine Steuerfachperson, nicht diese Website.",
  },
];

export function situationBySlug(slug: string): Situation | undefined {
  return SITUATIONS.find((s) => s.slug === slug);
}

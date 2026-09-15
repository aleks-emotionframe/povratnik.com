// Die zwölf Rubriken des Bereichs Wissen nach docs/inhaltskonzept.md 4.1 als Struktur
// für Übersicht, Rubrikseiten und Fuss. Hier stehen nur Titel, Einordnung und die
// Themenliste; keine Fachwerte. Themenseiten selbst entstehen in M4 als geprüfte
// Inhalte unter content/pages und tragen dort Quelle, Prüfdatum und Freigabe.

export type Rubric = {
  slug: string;
  number: string;
  title: string;
  /** Ein Satz, der sagt, worum es geht und wo die Leute scheitern. */
  intro: string;
  /** Typische Fragen, mit denen Leser in diese Rubrik kommen. */
  questions: string[];
  /** Themen, die enthalten sein müssen (inhaltskonzept.md 4.1). */
  topics: string[];
  /** Rubriken, die vorher geklärt sein sollten. */
  requires: string[];
};

export const RUBRICS: Rubric[] = [
  {
    slug: "status-und-staatsangehoerigkeit",
    number: "01",
    title: "Status und Staatsangehörigkeit",
    intro: "Ihr Status entscheidet über alles Weitere: ob Sie bleiben, arbeiten, die Kinder zur Schule schicken und Förderungen beantragen dürfen.",
    questions: ["Bekomme ich über meine Grosseltern die kroatische Staatsangehörigkeit?", "Was ist die Bescheinigung für Auswanderer und was bringt sie mir?", "Darf ich zwei Pässe behalten?"],
    topics: ["Abstammung", "Einbürgerung über die Auswandererregelung", "Aufenthalt für Auswanderer und Nachkommen", "EU-Freizügigkeit", "Arbeitsaufenthalt für Drittstaaten", "Digitaler Nomade", "Familiennachzug", "Verlängerung", "Doppelte Staatsbürgerschaft"],
    requires: [],
  },
  {
    slug: "dokumente-und-behoerden",
    number: "02",
    title: "Dokumente und Behörden",
    intro: "Die OIB ist der Schlüssel zu fast jedem Antrag. Davor steht die Urkundenkette: Original, Apostille, beglaubigte Übersetzung, in dieser Reihenfolge.",
    questions: ["Was ist die OIB und wo bekomme ich sie?", "Wie weise ich die Abstammung über drei Generationen nach?", "Mein Name ist in den Urkunden unterschiedlich geschrieben. Was jetzt?"],
    topics: ["OIB", "Personenstandsurkunden", "Abstammungskette über Generationen", "Apostille", "Beglaubigte Übersetzung", "Namensabweichungen und Schreibweisen", "Matrikel- und Pfarrbücher", "Domovnica", "Personalausweis", "e-Bürger-Zugang"],
    requires: ["status-und-staatsangehoerigkeit"],
  },
  {
    slug: "das-bisherige-wohnland-verlassen",
    number: "03",
    title: "Das bisherige Wohnland verlassen",
    intro: "Abmeldung, Steuerabschluss und Versicherungsende im Herkunftsland haben eigene Fristen, die mit dem kroatischen Verfahren nichts zu tun haben.",
    questions: ["Wann melde ich mich in der Schweiz oder in Argentinien ab?", "Welche Unterlagen muss ich vor der Abreise sichern?", "Was passiert mit meiner Rente und meinem Konto?"],
    topics: ["Abmeldung", "Steuerabschluss", "Versicherungsende", "Kündigung von Verträgen", "Rentenunterlagen sichern", "Schulzeugnisse anfordern", "Bankkonto", "Vollmachten"],
    requires: ["status-und-staatsangehoerigkeit"],
  },
  {
    slug: "arbeit-und-qualifikation",
    number: "04",
    title: "Arbeit und Qualifikation",
    intro: "Ob ein Abschluss anerkannt werden muss und wie ein Arbeitsvertrag in Kroatien gelesen wird, entscheidet über die ersten Monate.",
    questions: ["Wird mein Abschluss in Kroatien anerkannt?", "Was bleibt vom Bruttolohn netto übrig?", "Ist mein Beruf reglementiert?"],
    topics: ["Arbeitsmarkt", "Stellensuche", "Arbeitsvertrag verstehen", "Brutto und netto", "Anerkennung akademischer Abschlüsse", "Reglementierte Berufe", "Arbeitsrechte", "Arbeitssuche des Partners", "Sprache im Beruf"],
    requires: ["status-und-staatsangehoerigkeit", "dokumente-und-behoerden"],
  },
  {
    slug: "unternehmen-gruenden",
    number: "05",
    title: "Gründen und selbständig arbeiten",
    intro: "Manche Förderungen verlangen den Antrag vor der Gründung. Wer zuerst gründet und dann beantragt, verliert den Anspruch.",
    questions: ["Welche Rechtsform passt zu mir?", "Was ist das Pauschalgewerbe?", "Muss ich die Förderung vor oder nach der Gründung beantragen?"],
    topics: ["Rechtsformen im Vergleich", "Pauschalgewerbe", "Buchhaltungspflichten", "Beiträge", "Genehmigungen", "Reihenfolge gegenüber Förderungen", "Elektronische Rechnung", "Laufende Pflichten"],
    requires: ["status-und-staatsangehoerigkeit", "dokumente-und-behoerden"],
  },
  {
    slug: "steuern-geld-und-pension",
    number: "06",
    title: "Steuern, Geld und Pension",
    intro: "Wo Sie Steuern zahlen, ob zweimal besteuert wird und wie Ihre Rente aus dem Ausland zählt: Bei diesen Fragen brauchen Sie eine kroatische Fachperson.",
    questions: ["Wo bin ich steuerpflichtig, wenn ich im Jahr umziehe?", "Wird meine ausländische Rente in Kroatien besteuert?", "Wie eröffne ich ein Bankkonto?"],
    topics: ["Steuerliche Ansässigkeit", "Doppelbesteuerung", "Fünfjährige Lohnsteuerbefreiung", "Auslandseinkünfte", "Auslandsrenten", "Rentenanrechnung", "Sozialversicherungsabkommen", "Bankkonto", "Geldtransfer"],
    requires: ["dokumente-und-behoerden"],
  },
  {
    slug: "gesundheit-und-pflege",
    number: "07",
    title: "Gesundheit und Pflege",
    intro: "Die Versicherung beginnt je nach Grundlage an einem anderen Tag. Wer die Lücke nicht vorher plant, steht in den ersten Wochen ohne Deckung da.",
    questions: ["Ab wann bin ich in Kroatien krankenversichert?", "Wie überbrücke ich die Zeit dazwischen?", "Wie finde ich einen Hausarzt oder Kinderarzt?"],
    topics: ["Versicherungsbeginn je Grundlage", "Übergangsdeckung", "Zusatzversicherung", "Hausarzt und Kinderarzt finden", "Medikamente", "Schwangerschaft", "Chronische Erkrankung", "Pflege", "Barrierefreiheit"],
    requires: ["status-und-staatsangehoerigkeit", "dokumente-und-behoerden"],
  },
  {
    slug: "kinder-schule-und-ausbildung",
    number: "08",
    title: "Kinder, Schule und Ausbildung",
    intro: "Einschreibung, Schulbezirk und Sprachförderung hängen an der Wohnsitzmeldung. Zeugnisse aus dem Ausland brauchen ein eigenes Verfahren.",
    questions: ["Wie melde ich mein Kind in der Schule an?", "Werden die Zeugnisse anerkannt?", "Gibt es Sprachförderung für Kinder ohne Kroatisch?"],
    topics: ["Kindergarten", "Einschreibung", "Schulbezirk", "Zeugnisanerkennung", "Sprachförderung", "Besonderer Förderbedarf", "Kosten", "Berufsausbildung", "Studium", "Stipendien"],
    requires: ["dokumente-und-behoerden"],
  },
  {
    slug: "wohnen-und-regionen",
    number: "09",
    title: "Wohnen und Regionen",
    intro: "Dauerhafte Mieten sind in Küstenregionen saisonal knapp. Geerbtes Familienland hat oft ungeklärte Miteigentümer im Grundbuch.",
    questions: ["Darf ich als Ausländer in Kroatien kaufen?", "Was steht im Grundbuch und warum ist das wichtig?", "Wie finde ich eine Jahresmiete an der Küste?"],
    topics: ["Dauerhafte Miete", "Saisonale Verfügbarkeit", "Kaution", "Nebenkosten", "Kaufprüfung", "Kauf durch Ausländer", "Grundbuch", "Geerbtes Familienland", "Ungeklärte Miteigentümer", "Legalisierung", "Bau", "Kommunaler Wohnraum"],
    requires: [],
  },
  {
    slug: "sprache-und-gemeinschaft",
    number: "10",
    title: "Sprache und Gemeinschaft",
    intro: "Die Rückkehr scheitert selten an der Anmeldung, oft am Anschluss: Sprache, Vereine, Menschen, die einen mitnehmen.",
    questions: ["Wo lerne ich Kroatisch, online und vor Ort?", "Gibt es Stipendien für Sprachkurse?", "Wie finden Partner und Kinder Anschluss?"],
    topics: ["Kurse online und vor Ort", "Stipendien", "Sprachniveaus", "Alltagssprache", "Vereine", "Kirche", "Sport", "Mentoring", "Anschluss für Partner und Kinder"],
    requires: [],
  },
  {
    slug: "umzug-und-mobilitaet",
    number: "11",
    title: "Umzug und Mobilität",
    intro: "Übersiedlungsgut, Fahrzeugeinfuhr und Führerschein haben je eigene Fristen ab Anmeldung. Der Transport ist das kleinste Problem.",
    questions: ["Ist mein Hausrat zollfrei?", "Kann ich mein Auto mitnehmen?", "Muss ich meinen Führerschein umschreiben?"],
    topics: ["Hausrat", "Zoll und Übersiedlungsgut", "Fahrzeugeinfuhr", "Führerscheinumschreibung", "Haustiere", "Transportunternehmen", "Anreise", "Strom, Wasser, Internet, Telefon"],
    requires: ["dokumente-und-behoerden"],
  },
  {
    slug: "leistungen-und-foerderung",
    number: "12",
    title: "Leistungen und Förderung",
    intro: "Staat, Gespanschaften und Gemeinden fördern die Rückkehr, jeder für sich. Bei jeder Förderung sehen Sie, ob sie gerade beantragbar ist, woher die Angabe stammt und wann sie geprüft wurde.",
    questions: ["Welche Förderungen gibt es für Rückkehrer?", "Darf ich mehrere Leistungen kombinieren?", "Welche Bindungen und Rückzahlungspflichten gibt es?"],
    topics: ["Staatliche Leistungen", "Regionale und kommunale Leistungen", "Familie", "Wohnen", "Bildung", "Mobilität", "Gründung", "Anspruch", "Nachweise", "Kumulation", "Bindungen", "Rückzahlungspflichten"],
    requires: ["status-und-staatsangehoerigkeit", "dokumente-und-behoerden"],
  },
];

export function rubricBySlug(slug: string): Rubric | undefined {
  return RUBRICS.find((r) => r.slug === slug);
}

/** Texte einer Rubrik in der Sprache des Katalogs (rubrics.<slug>.*), Rückfall Deutsch. */
export function rubricText(r: Rubric, texts: Record<string, unknown>): { title: string; intro: string; questions: string[]; topics: string[] } {
  const node = ((texts.rubrics as Record<string, any>) ?? {})[r.slug] ?? {};
  return {
    title: node.title ?? r.title,
    intro: node.intro ?? r.intro,
    questions: r.questions.map((q, i) => node[`q${i + 1}`] ?? q),
    topics: r.topics.map((t, i) => node[`t${i + 1}`] ?? t),
  };
}

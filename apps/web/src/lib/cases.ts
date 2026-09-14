// Fünf Fallprofile aus docs/wizard-konzept.md 4, fiktiv und dort ausdrücklich als
// öffentliche Beispielwege freigegeben. Sie ersetzen Erfahrungsberichte, bis echte
// vorliegen, und sind als Beispiel gekennzeichnet.

export type Case = { name: string; line: string; shapes: string; first: string; situation: string };

export const CASES: Case[] = [
  {
    name: "Lucía, 32, Buenos Aires",
    line: "Urgrosseltern aus Dalmatien, kein kroatischer Pass, Partner ohne Bezug, ein Kind im Schulalter.",
    shapes: "Der Status ist offen, und die Urkundenkette über vier Generationen ist der längste Einzelschritt. Ihr Partner geht einen völlig anderen Weg.",
    first: "Prüfen lassen, ob die Abstammungskette vollständig belegbar ist. Nicht die Krankenkasse, nach der sie gesucht hat.",
    situation: "familie",
  },
  {
    name: "Marko, 41, Stuttgart",
    line: "Kroatischer Pass, Partnerin ebenfalls, zwei Kinder, will sich selbständig machen.",
    shapes: "Der Status ist geklärt, der Weg kurz. Entscheidend ist die Reihenfolge zwischen Förderantrag und Gründung, und dass die Lohnsteuerbefreiung bei Selbständigkeit möglicherweise nicht greift.",
    first: "Den aktuellen Förderaufruf lesen, bevor irgendetwas angemeldet wird.",
    situation: "selbstaendig",
  },
  {
    name: "Anna, 29, Wien",
    line: "EU-Bürgerin ohne kroatische Wurzeln, allein, arbeitet aus Kroatien für einen österreichischen Arbeitgeber.",
    shapes: "Der Aufenthalt ist unkompliziert. Ihr Risiko ist steuerlich: Ansässigkeit, Doppelbesteuerung und Sozialversicherung bei Arbeit für einen ausländischen Arbeitgeber, rückwirkend.",
    first: "Diesen Punkt vor dem Umzug klären, nicht danach.",
    situation: "arbeitgeber-im-ausland",
  },
  {
    name: "Ivan, 58, Toronto",
    line: "Kroatischer Pass, Partnerin ohne, lebt von einer kanadischen Rente, Umzug offen.",
    shapes: "Seine Partnerin hat einen anderen Weg als er. Die Krankenversicherung folgt bei ihm nicht aus einer Anstellung; dort entstehen Lücken. Rückkehrerförderungen für Arbeit und Gründung gelten für ihn nicht.",
    first: "Rentenanrechnung und Versicherungsgrundlage klären, mit dem Abkommen zwischen Kanada und Kroatien.",
    situation: "pensioniert",
  },
  {
    name: "Sofía, 26, Santiago de Chile",
    line: "Weiss nicht, ob ihre Grossmutter die Staatsbürgerschaft hatte. Allein, Umzug später oder unklar.",
    shapes: "Der Plan besteht fast nur aus Klärungsaufgaben, und das ist richtig so. Er zeigt, welche drei Auskünfte sie braucht, bevor irgendetwas planbar ist.",
    first: "Drei konkrete, erledigbare Schritte statt der Gewissheit, schon planen zu können.",
    situation: "ohne-pass",
  },
];

# @povratnik/engine

Regel-Engine nach ADR-0002: eigenes TypeScript-Paket ohne Abhängigkeiten, läuft im
Browser (Wizard) und in Node (Tests). Die fachliche Semantik steht verbindlich in
`docs/datenmodell.md` Abschnitte 2.3 bis 2.5 und 3; dieses README ist die Kurzfassung
für Entwickler.

## Was die Engine tut und was nicht

Sie wertet Regeln aus `content/rules` für Personen aus: Auswertbarkeit,
Fassungswahl, Personenkreis, Bedingungen, Frist, Konflikte. Sie liefert Zustände und
Textschlüssel, keine Texte. Sie liest nie die Uhr: das Referenzdatum ist Eingabe.
Sie lädt kein YAML; der Aufrufer übergibt geparste Objekte.

Nicht enthalten (spätere Module): Routen R0 bis R7, Wizard-Fragenlogik, Ableitung des
Staatsangehörigkeitsstatus aus Ländern, Leistungen und Programmstatus.

## API

```ts
import { evaluate, type EvaluationInput, type Rule } from "@povratnik/engine";

const input: EvaluationInput = {
  reference_date: "2026-09-13",
  persons: [{ id: "p1", facts: { /* siehe Fakten-Pfade */ } }],
  calendar: { holidays: [] },        // Feiertage sind Daten, nie Code
};
const output = evaluate(input, rules);                   // öffentlich: nur freigegebene, veröffentlichte Regeln
const test = evaluate(input, rules, { include: "all" }); // Tests: auch Entwürfe, nie withdrawn
```

Einzeln nutzbar: `computeDeadline`, `selectVersion`, `evaluateCondition`.

## Fakten-Pfade

Jeder Fakt trägt `availability` und bei `known` einen `value`. Ein fehlender Pfad ist
unbekannt; `not_applicable` und `not_existing` sind bekannt «kein Wert».

| Pfad | Wert |
|---|---|
| `person.citizenship_status` | Liste aus dem Vokabular, mehrere Status erlaubt |
| `person.residence_status`, `person.croatian_link` | ein Vokabularwert |
| `person.<name>` | beliebige weitere Angaben, die Bedingungen referenzieren |
| `event.<ereignisart>` | ISO-Datum des Ereignisses; steuert Fassungswahl und Frist |

## Ergebnis je Person

`results[]` mit `rule` (id@version), `procedure`, `task`, `eligibility` (`matches`,
`condition_missing`, `unclear`, `unchecked`), `text_key`, `deadline`,
`version_selection` (`by_event` oder `by_reference_date_provisional`), `conditions[]`.
Dazu `clarifications[]` im Format `<kind>:<subject>` (`missing:event.entry`,
`rule_conflict:<verfahren>`) und `errors[]` für Datenfehler (Typkonflikt, Pflichtwert
fehlt bei `on_unknown: fail`, überlappende Fassungen).

`text_key` ist der `status_text_key` der Regel nur bei `matches`, sonst
`results.<zustand>` beziehungsweise `results.rule_conflict`. So kann kein Regeltext
mehr behaupten als das Ergebnis.

## Fachlich zu bestätigende Annahmen

Die Zählregeln in `datenmodell.md` 2.3 (Fristbeginn, Monatsende, Verschiebung auf den
nächsten Werktag) sind allgemeine Definitionen. Ob sie die kroatischen
Verfahrensvorschriften korrekt abbilden, prüft die Fachprüfung vor der ersten
freigegebenen Regel. Bis dahin gibt es nur synthetische Regeln.

## Tests

```bash
npm test
```

`src/*.test.ts` sind Unit-Tests je Modul. `test/fixtures.test.ts` lässt jeden
Abnahmefall aus `content/tests` gegen alle Regeln in `content/rules` laufen und prüft
Ergebnisse, Aufgaben, Klärungen, Fristen und verbotene Texte als exakte Mengen.
`test/no-clock.test.ts` stellt sicher, dass der Quellcode die Uhr nicht liest.

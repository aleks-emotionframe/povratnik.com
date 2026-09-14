# ADR-0002: Technologiewahl für Website, Engine und Redaktion

Status: entschieden, 13.09.2026, durch die Produktverantwortung. Betrifft CLAUDE.md
Abschnitt 8, `umsetzungskonzept.md` Abschnitt 4. Baut auf ADR-0001 auf.

---

## Kontext

ADR-0001 hat festgelegt, dass Regeln, Aufgaben, Verfahren und Inhalte als YAML im
Repository liegen und die Datenbank für Orte, Geometrie, Einrichtungen und Leistungen
die Quelle ist. Daraus folgt bereits: PostgreSQL mit PostGIS und mehrsprachiger
Volltextsuche, und ein Übertragungsschritt bei jeder Freigabe.

Zwei weitere Punkte sind durch das Konzept festgelegt und keine Wahl mehr:

- Die Regelauswertung läuft im Browser (CLAUDE.md 2.5). Die Abnahmefälle müssen gegen
  denselben Code laufen. Also ist die Engine TypeScript, ausgeführt im Browser und in
  Node für Tests, unabhängig vom Rest.
- Informationsseiten werden statisch oder serverseitig gerendert und sind ohne
  JavaScript lesbar (CLAUDE.md 2.6), Budget 150 KB je Informationsseite
  (`betrieb.md` Abschnitt 2).

Offen war: das Framework für die Website, die Sprache der Redaktionsoberfläche (M3)
und der Datenbankzugriff. Kriterien in dieser Gewichtung (CLAUDE.md 8):

1. Das Team kann den Code in zwei Jahren warten. Erfahrung mit Laravel, React und
   Inertia zählt als Argument, ist aber nicht gesetzt.
2. Informationsseiten statisch oder serverseitig gerendert.
3. Räumliche Abfragen und mehrsprachige Volltextsuche in einem System.
4. Kein proprietäres Inhaltsformat, vollständiger Export.
5. Hosting in der EU.

## Optionen

**A: Astro mit TypeScript, eine Sprache für alles.**
Astro liefert Informationsseiten standardmässig ohne JavaScript aus, liest YAML als
Content Collections mit Schema-Prüfung und lädt interaktive Inseln (Wizard, Karte,
Filter) nur auf ihren eigenen Seiten. Die Engine, der Validator, die
Redaktionsoberfläche und die Website teilen sich Sprache, Typen und Schemas. Der
Datenbankzugriff läuft über eine kleine eigene Schicht (SQL mit Parametern, kein ORM
nötig). Die Redaktionsoberfläche (M3) wird als Astro-Anwendung mit serverseitigen
Endpunkten gebaut, die YAML-Dateien schreiben und Pull Requests erzeugen.

- Kriterium 1: React-Erfahrung ist nutzbar (Inseln in React oder Preact), Laravel-
  Erfahrung nicht. Eine Sprache und ein Werkzeugstand sind in zwei Jahren leichter zu
  warten als zwei.
- Kriterium 2: erfüllt, das ist Astros Kernaufgabe. Das 150-KB-Budget ist damit
  realistisch, mit React auf jeder Seite wäre es nicht haltbar.
- Kriterium 3: PostgreSQL mit PostGIS, unabhängig vom Framework.
- Kriterium 4: erfüllt, YAML im Repository.
- Kriterium 5: jeder EU-Anbieter mit Node.

**B: Laravel mit Blade, Engine als separates TypeScript-Paket.**
Website und Redaktionsoberfläche in Laravel, Seiten mit Blade ohne JavaScript, Wizard
und Karte als eingebettete TypeScript-Inseln. Inertia und React fallen weg, weil sie
jede Seite mit React belasten würden und Kriterium 2 verletzen.

- Kriterium 1: Laravel-Erfahrung voll nutzbar, Redaktionsoberfläche und
  Authentifizierung aus dem Ökosystem. Aber zwei Sprachen: Die YAML-Schemas müssen in
  PHP und TypeScript gleich interpretiert werden, die Regel-Engine liegt ausserhalb
  des Laravel-Codes, und der Validator existiert zweimal oder wird aus PHP als
  Node-Prozess aufgerufen.
- Kriterium 2: mit Blade erfüllt.
- Kriterium 3 bis 5: erfüllt.

**C: Next.js.**
Eine Sprache wie A, grosses Ökosystem. Aber React auf jeder Seite, auch bei statischer
Erzeugung wird das Framework für die Hydrierung geladen. Das 150-KB-Budget ist damit
nur mit ständiger Gegenarbeit haltbar. Verletzt den Geist von Kriterium 2.

## Entscheidung

Option A: Astro mit TypeScript.

| Schicht | Wahl |
|---|---|
| Sprache | TypeScript überall: Engine, Validator, Website, Redaktion |
| Website | Astro, statische Erzeugung für Informationsseiten, serverseitig für Suche und Ortsprofile |
| Interaktive Inseln | Preact oder React, nur auf Wizard, Karte und Filter geladen; Wahl in M2 nach Messung |
| Engine | eigenes Paket ohne Framework-Abhängigkeit, läuft im Browser und in Node |
| Datenbank | PostgreSQL mit PostGIS, Zugriff über eine kleine eigene Schicht mit parametrisierten Abfragen |
| Redaktion (M3) | Astro-Anwendung mit serverseitigen Endpunkten, schreibt YAML und erzeugt Pull Requests |
| PDF | im Browser erzeugt, Bibliothek erst bei Klick geladen |
| Hosting | EU, Node-fähig; konkreter Anbieter wird in M2 vor dem Pilot entschieden |

## Konsequenzen

Was die Wahl teuer macht, ausdrücklich:

- Die Redaktionsoberfläche (M3) mit Anmeldung, Rollen, Änderungsverlauf und
  Freigabe wird selbst gebaut. Laravel hätte hier Authentifizierung, Formulare und
  Berechtigungen mitgebracht. Das ist der grösste Einzelposten dieser Entscheidung.
- Laravel-Erfahrung im Team bleibt ungenutzt. Wer bisher vor allem Laravel gebaut hat,
  arbeitet sich in Astro und in serverseitiges TypeScript ein.
- Datenbankzugriff, Migrationen und Sicherung werden ohne ORM-Komfort aufgesetzt.
- Astro ist jünger als Laravel. Grössere Versionssprünge sind einzuplanen.

Was sie spart: kein doppelter Validator, keine zwei Interpretationen derselben
Schemas, keine Prozessgrenze zwischen Website und Engine, und ein Seitengewicht, das
das Budget ohne Gegenarbeit einhält.

Prüfpunkt: Wenn in M3 die Redaktionsoberfläche mehr als die Hälfte des Aufwands von
M2 kostet, wird diese Entscheidung erneut vorgelegt. Bis dahin gilt sie.

---

## Nachtrag 14.09.2026: Insel-Bibliothek und Redaktionsmuster

Entschieden in M2a: **Preact** für die interaktiven Inseln. Gemessen am Build der
Wizard-Seite: Preact mit Hooks und Signals 20,8 KB, Astro-Client 2,7 KB, Wizard-Insel
samt Engine 21,6 KB, zusammen 45 KB unkomprimiert und rund 17 KB komprimiert. Die
Startseite lädt kein JavaScript ausser dem EmotionFrame Footer (2,4 KB). Budget
`betrieb.md` Abschnitt 2 eingehalten; ein Test in `apps/web/test/build.test.ts`
wacht darüber.

Regelpaket: `apps/web/src/lib/content.ts` liest `content/` zur Bauzeit. Im Build
gelangen nur freigegebene, veröffentlichte, nicht synthetische Regeln in die Seite;
`astro dev` zeigt alle nicht zurückgezogenen Regeln mit sichtbarem Hinweisband. Ein
Test durchsucht `dist/` nach synthetischen oder unveröffentlichten Regeln.

PDF: Druckansicht des Browsers mit `@media print`, keine Bibliothek. Erst wenn
Testpersonen damit scheitern, wird eine Bibliothek geprüft (Budget 400 KB, nur auf
Aktion geladen).

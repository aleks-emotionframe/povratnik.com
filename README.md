# Leben in Kroatien

Mehrsprachige Informationsplattform für Menschen, die nach Kroatien zurückkehren oder
auswandern. Drei Zugänge zum selben Datenbestand: Wissen nach Thema, Orte nach Raum,
ein Wizard nach Zeit und Reihenfolge.

- `CLAUDE.md` Entwicklungsanweisung: Zweck, Grenzen, Arbeitsablauf
- `docs/README.md` Übersicht aller Konzeptdokumente und offenen Punkte
- `docs/adr/` Architekturentscheide
- `docs/rollen.md` wer entscheidet, wer prüft, wer freigibt

## Stand

M2a. Es gibt Schemas, einen Validator, CI, die Regel-Engine als eigenes Paket
(`packages/engine`, 13 Abnahmefälle) und die Website (`apps/web`): Startseite,
Rechtsseiten, Kurzcheck mit Haushalt, Auswertung im Browser, Abschlussplan mit
Druckansicht. Es gibt noch keine fachlich freigegebene Regel; der Kurzcheck läuft
lokal mit synthetischen Beispielregeln und sagt das sichtbar. Ein Produktionsbuild
enthält keine synthetische Regel (Test). Alle Datensätze unter `content/` sind
synthetische Beispiele und als solche gekennzeichnet.

## Struktur

```
content/          Regeln, Aufgaben, Verfahren, Seiten, Quellen, Abnahmefälle, Texte (YAML)
schemas/          JSON Schema je Datensatztyp, abgeleitet aus docs/datenmodell.md
scripts/          Validator und seine Tests
packages/engine/  Regel-Engine: Operatoren, Fristen, Fassungswahl, Konflikte, Fixture-Harness
apps/web/         Website (Astro): Seiten, Wizard-Insel (Preact), Regelpaket, Build-Test
docs/             Konzept, Datenmodell, Designsystem, Betrieb, ADRs
```

Orte, Einrichtungen und Leistungen liegen nicht im Repository, sondern in der
Datenbank (ADR-0001).

## Arbeiten

Voraussetzung: Node 22.6 oder neuer.

```bash
npm ci
npm run dev        # Website auf http://localhost:4321, mit synthetischen Regeln
npm run build      # Produktionsbuild nach apps/web/dist, nur freigegebene Regeln
npm run validate   # prüft content/ gegen Schemas und Querbezüge
npm test           # Validator, Engine, Abnahmefälle, Website, Build-Ergebnis
npm run typecheck  # Engine und Validator
npm run check:web  # Website
```

Jeder Pull Request lässt Typprüfung, Build, Tests und Validierung in der CI laufen. Rot bedeutet: keine
Auslieferung.

## Regeln für Datensätze

Kurzfassung von `CLAUDE.md` Abschnitt 4, vom Validator erzwungen:

- Jeder Datensatz trägt `synthetic`. Synthetische Beispiele werden nie freigegeben
  oder veröffentlicht.
- `published` setzt `approved` mit benanntem `reviewer` und mindestens eine Quelle
  mit Fundstelle und Prüfdatum voraus.
- Eine Regel gehört zu genau einem Verfahren. Operatoren sind abschliessend
  aufgezählt.
- Unbekannt wird nie zu null. Ein Wert steht nur bei `availability: known`.
- Fassungen bleiben erhalten: `supersedes` und `superseded_by` verweisen aufeinander.
- Dateiname ist `<id>.<version>.yaml`, bei Seiten `<id>.<lang>.yaml`.

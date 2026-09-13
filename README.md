# Leben in Kroatien

Mehrsprachige Informationsplattform für Menschen, die nach Kroatien zurückkehren oder
auswandern. Drei Zugänge zum selben Datenbestand: Wissen nach Thema, Orte nach Raum,
ein Wizard nach Zeit und Reihenfolge.

- `CLAUDE.md` Entwicklungsanweisung: Zweck, Grenzen, Arbeitsablauf
- `docs/README.md` Übersicht aller Konzeptdokumente und offenen Punkte
- `docs/adr/` Architekturentscheide
- `docs/rollen.md` wer entscheidet, wer prüft, wer freigibt

## Stand

M0 Grundlage. Es gibt Schemas, einen Validator und CI. Es gibt noch keine Website,
keine Regel-Engine und keine fachlich freigegebene Regel. Alle Datensätze unter
`content/` sind synthetische Beispiele und als solche gekennzeichnet.

## Struktur

```
content/     Regeln, Aufgaben, Verfahren, Seiten, Quellen, Abnahmefälle, Texte (YAML)
schemas/     JSON Schema je Datensatztyp, abgeleitet aus docs/datenmodell.md
scripts/     Validator und seine Tests
docs/        Konzept, Datenmodell, Designsystem, Betrieb, ADRs
```

Orte, Einrichtungen und Leistungen liegen nicht im Repository, sondern in der
Datenbank (ADR-0001).

## Arbeiten

Voraussetzung: Node 22.6 oder neuer.

```bash
npm ci
npm run validate   # prüft content/ gegen Schemas und Querbezüge
npm test           # Tests des Validators
npm run typecheck
```

Jeder Pull Request lässt diese drei Kommandos in der CI laufen. Rot bedeutet: keine
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

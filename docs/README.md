# Leben in Kroatien: Dokumentenübersicht

Stand 13.09.2026. Informationsplattform für Rückkehrer, Nachkommen und neue
Zuwanderer nach Kroatien.

---

## Welches Dokument regelt was

| Dokument | Regelt | Status |
|---|---|---|
| `../CLAUDE.md` | Entwicklungsanweisung: Zweck, Grenzen, Arbeitsablauf | v2.1, an ADR-0001 angeglichen |
| `strategie.md` | Geschäftsmodell, Positionierung, Wirtschaftlichkeit, Markteintritt | v1 |
| `inhaltskonzept.md` | Sitemap, Seitentypen, zwölf Rubriken, Checklisten, Prozessdarstellung | v1.1 |
| `wizard-konzept.md` | Fragenpfad, Statusgabelung, Fallprofile, Zusammenfassung | v1.2, Kurzcheck an Q01 bis Q09 angeglichen |
| `wizard-recherche.md` | Fragenkatalog Q01 bis Q48, Routen R0 bis R7, Entscheidungslogik L01 bis L09, 18 Abnahmefälle, 13 Klärungspunkte | v1, fachlich führend |
| `datenmodell.md` | Schema, drei Zustandsvokabulare, Zeit- und Fristmodell, Haushaltsmodell | v1.1 |
| `umsetzungskonzept.md` | Architektur, Komponenten, Technologiekriterien, Module, Rollen, Risiken | v1.1, an ADR-0001 und M0 bis M7 angeglichen |
| `redaktionsgrundsaetze.md` | Quellenhierarchie, Prüfzyklen, Arbeitsablauf, Unabhängigkeit, Tonfall | v1 |
| `betrieb.md` | Messprofile, Sicherung, Rücknahme, Datenschutz nach Bereichen, Positivliste Telemetrie, Abdeckung | v1.1 |
| `designsystem.md` | Tokens, Seitentypen, Zustandsdarstellung, Formulare, Mobil | v1.2 |
| `adr/0001-quelle-und-abgeleitete-kopie.md` | Welcher Bestand wird im Repository, welcher in der Datenbank gepflegt | entschieden |
| `adr/0002-technologiewahl.md` | Astro mit TypeScript, PostgreSQL mit PostGIS, Engine als eigenes Paket | entschieden |
| `rollen.md` | Besetzung der Rollen, wer gibt was frei | v1, Namen einzutragen |
| `recherche-faktenbasis.md` | Rechtslage, Förderungen, Zahlen, Wettbewerb, mit Quellen und Stand | v1 |
| `review-claude-md.md` | Review der Entwicklungsanweisung v1, Grundlage für v2 | v1, P0 und P1 abgearbeitet |

Bei Widerspruch gilt: `wizard-recherche.md` und `datenmodell.md` sind fachlich
führend, `CLAUDE.md` regelt Arbeitsweise, Grenzen und die verbindliche Modulreihenfolge
M0 bis M7, Architekturentscheide stehen in `adr/`.

Das Zustandsvokabular ist in `datenmodell.md` Abschnitt 1.1 an einer Stelle definiert:
Vokabular A für einen einzelnen Fachwert, Vokabular B für ein Programm, Vokabular C für
Verfahren und Eignung je Person. Alle anderen Dokumente verwenden diese Definition.

---

## Die vier Kernentscheidungen

1. **Veränderliche Fachwerte sind Daten, nie Code.** Sonst wird jede Rechtsänderung
   zum Entwicklungsauftrag.
2. **Die Person ist die Planungseinheit, der Haushalt die Klammer.** Ein Modell mit
   Hauptperson und Anhängseln bildet gemischte Familien nicht ab.
3. **Wert, Erhebung, Nachweis und Aktualität sind vier getrennte Dimensionen.** Ein
   Betrag kann bekannt, belegt und gleichzeitig veraltet sein.
4. **Wizard-Antworten bleiben im Browser.** Kein Konto, kein Endpunkt, keine
   Speicherung in den ersten Ausbaustufen.

---

## Offene Punkte vor Entwicklungsbeginn

Diese fünf Punkte blockieren. Keiner davon ist technisch.

1. **Datenlizenz** für den kommunalen Massnahmenbestand des Ministeriums, schriftlich.
   Ohne sie sind Karte und Leistungsdatenbank nicht aufbaubar.
2. **Geodatenlizenz** mit stabilen Gemeindekennungen.
3. **Benannte Fachprüfung.** Eine kroatische Fachperson für Recht und Steuern. Diese
   Rolle kann bei einem Zweierteam nicht intern besetzt werden, und ohne sie darf
   keine Rechtsregel produktiv geladen werden.
4. **Kroatischsprachige Fachredaktion.** Die kritische Dauerressource. Entwicklung
   lässt sich einkaufen, dieses Profil kaum.
5. **Pilotgemeinden.** Drei bis fünf, mit verbindlicher Zusage und benannter
   Ansprechperson.

Technisch offen, vor M2 zu erledigen: Namen in `rollen.md` eintragen und den
Branch-Schutz für `main` auf GitHub aktivieren (Pull Request erforderlich,
Status-Check `validate`). Bis dahin sind direkte Pushes auf `main` bewusst erlaubt.

Zusätzlich zu klären, weil es eine Ausbaustufe betrifft: eine lizenzierbare Quelle für
regionale Lohn-, Miet- und Lebenshaltungskosten. Ohne sie ist die Simulation nicht
seriös umsetzbar.

Die 13 Klärungspunkte O01 bis O13 aus der Wizard-Recherche bleiben als fachliche
Arbeitsliste bestehen.

Entschieden am 13.09.2026 durch die Produktverantwortung: Der Kurzcheck fragt nach
Staatsangehörigkeiten (Mehrfachauswahl) und Bezug zu Kroatien, nicht nach dem Pass.
Er hat sechs Frageschritte, die Q01 bis Q09 der Recherche abdecken (Q01 ist der
Sprachwechsel, Q06 wird mit Q05 gestellt, Q09 ist ein Angebot nach dem ersten
Ergebnis). Umgesetzt in `wizard-konzept.md` 2.2 und 3 sowie `inhaltskonzept.md` 6.1.

---

## Reihenfolge

```
M0  Grundlage        Repo, CI, Validierung, Schemas, ADR Technologiewahl, Rollen
M1  Machbarkeit      Regelformat, Auswertung, Fristen, Fassungswahl
M2  Pilot            ein durchgängiger Weg von der Frage bis zum PDF
M3  Redaktion        Oberfläche, erzeugt Pull Requests
M4  Website          Seitentypen, Suche, Sprachen
M5  Orte             Karte, Filter, Profile, Vergleich
M6  Wizard           vollständig, Kurzcheck und ausführlicher Check
M7  Ausbau           Länder, Sprachen, Gemeinden, Auswertung
```

M2 ist der wichtigste Meilenstein. Ein schmaler, aber vollständiger Weg, geprüft mit
echten Testpersonen, beweist die Produktannahmen, bevor Breite aufgebaut wird.

Betrieb läuft mit, nicht hinterher: Sicherung, erprobte Wiederherstellung,
Zugriffsrechte, Fehlerkontakt und die Rücknahme einer falschen Fachausgabe müssen vor
der ersten öffentlichen Veröffentlichung funktionieren.

---

## Was bewusst nicht gebaut wird

Anbindung an staatliche Antragsverfahren, elektronische Identifikation,
Dokumentenablage, gespeicherte Pläne auf Servern, native App, offener KI-Chat,
automatische Anspruchsbescheide, Ranglisten von Gemeinden, erfundene
Genehmigungswahrscheinlichkeiten, erfundene Werte für reale Orte.

# CLAUDE.md

Version 2.3, 14.09.2026. Ersetzt Version 1. Änderung in 2.2: Hosting in Abschnitt 8. Änderung in 2.3: Teststufe in Abschnitt 4 (ADR-0004). Projektanweisung für die Entwicklung, wird
zu Beginn jeder Sitzung gelesen und ist verbindlich. Bei Konflikt zwischen dieser
Datei und einer Einzelanweisung im Chat: nachfragen, nicht stillschweigend abweichen.

Diese Datei enthält Zweck, Grenzen und Arbeitsablauf. Fachmodelle, Schemas,
Designsystem, Messprofile und Betriebspläne stehen in `docs/`. Sie ist bewusst kurz
gehalten und soll kein zweites Pflichtenheft werden.

---

## 1. Was wir bauen

Eine mehrsprachige Informationsplattform für Menschen, die nach Kroatien zurückkehren
oder auswandern. Drei Zugänge zum selben Datenbestand: Wissen nach Thema, Orte nach
Raum, ein Wizard nach Zeit und Reihenfolge.

Die Plattform richtet sich an Menschen weltweit. Als erste Pilotgruppe gelten
Nachkommen kroatischer Auswanderer in Südamerika, die mit einem Mobiltelefon bei
mässiger Verbindung auf die Seite kommen. Das ist eine überprüfbare Pilotpriorität und
keine Einschränkung des Produkts. Andere Nutzergruppen dürfen dadurch nicht
unbemerkt herausfallen.

Fachliche Wahrheit liegt in `docs/`:

- `docs/strategie.md` Geschäftsmodell, Positionierung, Unabhängigkeit
- `docs/inhaltskonzept.md` Sitemap, Seitentypen, Rubriken, Checklisten
- `docs/wizard-recherche.md` Fragenkatalog, Routen, Entscheidungslogik, Abnahmefälle
- `docs/umsetzungskonzept.md` Architektur, Datenmodell, Etappen
- `docs/redaktionsgrundsaetze.md` Quellenhierarchie, Prüfzyklen, Tonfall
- `docs/datenmodell.md` Zustände, Zeitmodell, Haushalts- und Beziehungsmodell
- `docs/designsystem.md` Typografie, Raster, Seitentypen, Zustände in der Oberfläche
- `docs/betrieb.md` Sicherung, Wiederherstellung, Rücknahme, Rechte, Messprofile, Positivliste erlaubter Telemetrie-Ereignisse
- `docs/adr/` Architekturentscheide: ADR-0001 Quelle und abgeleitete Kopie, ADR-0002 Technologiewahl, ADR-0003 Hosting, ADR-0004 Teststufe
- `docs/rollen.md` Besetzung der Rollen, wer gibt was frei

Widerspricht der Code diesen Dokumenten, sind die Dokumente massgeblich. Ändert sich
eine fachliche Entscheidung, wird zuerst das Dokument geändert, dann der Code.

---

## 2. Verbindliche Grenzen

**2.1 Veränderliche Fachwerte sind Daten, nie Code.** Beträge, Fristen,
Personenkreise, Anspruchsbedingungen, Ergebnistexte und Quellen werden als
versionierte Daten gepflegt. Der Code implementiert ihre allgemeine Auswertung:
Datums- und Mengenoperationen, Umgang mit unbekannten Werten, Erkennung von
Konflikten. Konkrete Fachwerte dürfen in zugeordneten Testfixtures vorkommen, nicht
verstreut in Oberfläche und Geschäftslogik. Findet sich ein Fachwert ausserhalb von
Daten und Fixtures, ist das ein Fehler und wird gemeldet.

**2.2 Zeit ist Teil jeder Regel.** Jede Regel benennt die Ereignisart, die sie
auslöst, ihr Gültigkeitsfenster, geltendes Übergangsrecht und die Art der
Fristberechnung. Die anzuwendende Fassung ergibt sich aus Verfahren und Ereignis der
Person, nicht aus dem heutigen Datum. Fachliche Freigabe, Veröffentlichungsstatus und
zeitliche Gültigkeit sind getrennte Felder: Eine heute ersetzte Fassung bleibt für ein
historisches Ereignis auswertbar. Details in `docs/datenmodell.md`.

**2.3 Die Person ist die Planungseinheit, der Haushalt die Klammer.** Jedes Mitglied
hat eigene Staatsangehörigkeiten, Dokumente, Routen und Versicherungsgrundlagen.
Beziehungen sind eigene Objekte mit Rechtsart, Gültigkeit und Nachweisstatus. Kein
Modell mit Hauptperson und Anhängseln. Der leistungsrechtliche Haushalt kann von den
Mitziehenden abweichen und wird je Leistung definiert.

**2.4 Wert, Erhebung, Nachweis und Aktualität sind vier getrennte Dimensionen.** Ein
Wert kann bekannt, belegt und gleichzeitig veraltet sein. Unbekannt wird nie zu null
oder falsch. Ein Fachfeld bleibt nur leer, wo die Schema-Semantik ein offenes Ende
ausdrücklich definiert und benennt.

**2.5 Wizard-Antworten bleiben lokal.** Sie werden im Browser ausgewertet und nicht an
Betreiber oder Dritte übermittelt: keine Antwortwerte in URLs, Telemetrie,
Fehlerberichten oder Suchanfragen, kein Endpunkt, der sie entgegennimmt, und kein Link
mit kodierten Antworten. PDF wird lokal erzeugt. Für die anonyme Auswertung gilt
ausschliesslich die Positivliste in `docs/betrieb.md` Abschnitt 4.1; alles, was dort
nicht steht, wird nicht erhoben. Betriebsdaten, Redaktionskonten, Gemeindezugänge und Kontaktanfragen
sind davon getrennt und im Datenschutz- und Berechtigungskonzept geregelt. Wird in
einer Sitzung vorgeschlagen, Antworten zu speichern, zu senden oder zu protokollieren,
ist das abzulehnen und zu melden.

**2.6 Inhalt vor Interaktion.** Informationsseiten werden serverseitig gerendert oder
statisch ausgeliefert, sind ohne JavaScript lesbar, druckbar und teilbar. Interaktiv
sind Karte, Filter und Wizard; sie laden ihr JavaScript nur auf ihren eigenen Seiten
und haben definierte Lade- und Ausfallzustände.

**2.7 Leistung und Barrierefreiheit werden gemessen, nicht behauptet.** Budgets gelten
je Seitentyp nach dem Messprofil in `docs/betrieb.md`. Barrierefreiheit nach WCAG 2.2
AA wird automatisiert und zusätzlich manuell geprüft; ein grüner automatischer Test
allein ist keine Freigabe.

**2.8 Nichts ohne Quelle.** Jede veröffentlichte Regel und jeder Fachwert trägt
Quelle, Prüfdatum und verantwortliche Person. Datensätze ohne diese Felder werden von
der Validierung abgelehnt.

**2.9 Export jederzeit möglich.** Inhalte und Regeln müssen vollständig als
strukturierte Daten exportierbar sein.

**2.10 Bezahlte Leistungen verändern keine fachlichen Ergebnisse.** Keine bezahlte
Platzierung, keine Bezahlschranke vor Kerninformationen, Werbung und
Vermittlungsvergütung werden gekennzeichnet.

---

## 3. Sprache

Code, Feldnamen, Zustandskennungen, Commits und Dateinamen auf **Englisch**. Inhalte
und Oberflächentexte auf **Deutsch** als Ausgangssprache, daneben Kroatisch, Englisch,
Spanisch, später Portugiesisch.

Kroatische Amtsbegriffe (OIB, prebivalište, Domovnica, Javni poziv) werden als eigenes
Feld im Original geführt **und** zusätzlich verständlich erklärt. Das Original
verschwindet nie, weil der Nutzer es am Schalter braucht; das Verstehen darf daran
aber nicht scheitern.

Für kroatische Rechtsregeln bleibt der amtliche kroatische Text die fachliche
Referenz. Übersetzungen sind Arbeitsfassungen.

Deutsche Inhalte in Schweizer Rechtschreibung: ss statt ß. Keine Gedankenstriche,
stattdessen Komma, Doppelpunkt oder Punkt.

---

## 4. Regeln als Dateien

Regeln, Aufgaben, Verfahren, Inhalte und Testfälle liegen versioniert im Repository.
Freigabe über Pull Request, damit die fachliche Prüfung nachvollziehbar bleibt.

**Was Quelle ist und was abgeleitete Kopie, regelt ADR-0001.** Kurzfassung: Das
Repository ist Quelle für Regeln, Verfahren, Inhalte und Quellenregister; die Datenbank
ist dafür ein lesbarer Index und nie eine Schreibquelle. Orte, Geometrie,
Einrichtungen und Leistungen werden dagegen in der Datenbank gepflegt. Wird ein Regel-
oder Inhaltsdatensatz direkt in der Datenbank geändert, ist das ein Fehler.

```
content/
  rules/  tasks/  procedures/  pages/
  sources/  tests/  i18n/
```

Orte, Einrichtungen und Leistungen liegen nach ADR-0001 nicht hier, sondern in der
Datenbank. Format YAML, Felder Englisch, Werte mehrsprachig. Das verbindliche Schema steht in
`docs/datenmodell.md`. Mindestanforderungen an jeden veröffentlichten Datensatz:

- eindeutiger Geltungsbereich: Personenkreis **und** Verfahren, getrennt modelliert
- benannte Ereignisart mit dem konkreten auslösenden Datum
- Fristart und Berechnungsregel, nicht nur eine Tageszahl
- Gültigkeitsfenster und Bezug zu Vorgänger- und Nachfolgefassung
- Quelle mit Fundstelle und Prüfdatum
- Freigabe mit Person und Datum, getrennt vom Veröffentlichungsstatus

Die Validierung läuft in der Continuous Integration und lehnt unvollständige
Datensätze ab. Nicht fachlich freigegebene Regeln werden öffentlich nie ausgewertet.

**Teststufe (ADR-0004, Entscheid vom 14.09.2026):** Bis zur ersten Fachfreigabe läuft die
Website auf der Stufe `test`, festgelegt an genau einer Stelle in
`apps/web/src/lib/stage.ts`. Dort wertet der Kurzcheck auch synthetische und nicht
freigegebene Regeln aus, jede Seite ist als Teststufe gekennzeichnet und nicht
indexierbar, und der Build-Test erzwingt die Kennzeichnung. Der Link wird auf dieser
Stufe an niemanden ausserhalb des Teams herausgegeben. Der Wechsel auf `public` ist
ein Pull Request und setzt eine benannte Fachprüfung in `docs/rollen.md` voraus; ab
dann gilt der Satz davor wieder ohne Ausnahme.

**Beispieldateien sind als synthetisch zu kennzeichnen und dürfen nicht produktiv
geladen werden.** Ein Beispiel trägt niemals den Status einer fachlichen Freigabe.
Jede produktiv geladene Rechtsregel braucht eine namentliche Freigabe durch die
benannte Fachprüfung.

---

## 5. Abnahmefälle

Die Testfälle aus `docs/wizard-recherche.md` liegen als deklarative Fixtures in
`content/tests/` und laufen bei jedem Durchlauf. Zusätzlich verpflichtend:

- **Negativtests je Geltungsbereich:** Eine Regel für eine Personengruppe darf nicht
  auf eine andere angewendet werden.
- **Verfahrenstrennung:** Aufenthaltsregistrierung, Wohnsitzmeldung und
  Unterkunftsmeldung sind verschiedene Vorgänge mit eigenen Kennungen.
- **Stichtagstests:** Tag davor, Stichtag, Tag danach; fehlendes Ereignisdatum;
  historische ersetzte Fassung; zwei widersprüchliche Regeln.
- **Reproduzierbarkeit:** Ein früherer Plan lässt sich aus gespeicherten Antworten und
  Regelversion identisch nachvollziehen.
- **Texttests:** Kein Ergebnistext trifft eine stärkere Aussage als das Regelergebnis.

Ein Test schlägt fehl, wenn eine unklare Voraussetzung als erfüllt gilt, eine
notwendige Person fehlt, eine falsche Regelfassung gewählt wird oder ein Text eine
Zusage enthält, die keine Regel deckt. Rot bedeutet: keine Auslieferung.

---

## 6. Arbeitsweise nach Tragweite

Nicht jede Änderung braucht denselben Ablauf.

| Art der Änderung | Ablauf |
|---|---|
| Fachlich kritisch (Anspruch, Frist, Route, Abhängigkeit) | Spezifikation, Tests zuerst, technisches Review **und** unabhängige Fachfreigabe |
| Sicherheitsrelevant | Risiko dokumentieren, Tests, technisches Review |
| Reversibles Detail in Oberfläche oder Text | eigenständig innerhalb der Vorgaben, gezielt prüfen, dokumentieren |
| Neue wesentliche Produktentscheidung | Optionen und Folgen vorlegen, Entscheidung durch Produktverantwortung |
| Unabhängige Teilaufgaben | parallel erlaubt, wenn Schnittstellen geklärt sind |

**Rollen sind Funktionen und müssen benannt sein.** Ein zweiter Entwickler erkennt
technische Fehler, ist damit aber nicht zur rechtlichen Prüfung befähigt. Produktverantwortung,
technische Verantwortung und Fachfreigabe werden getrennt benannt. Eine Prüfung durch
ein KI-System ersetzt keine qualifizierte unabhängige Fachperson. Kein Selbstmerge bei
fachlich kritischen Änderungen.

Architekturentscheide als kurzer Eintrag in `docs/adr/`: Kontext, Optionen,
Entscheidung, Konsequenzen. Eine Entscheidung der Produktverantwortung wird als
Änderung dokumentiert und blockiert danach nicht erneut.

**Definition of Done:** Spezifikation vorhanden (bei kritischen Änderungen), Tests und
Abnahmefälle grün, Performancebudget eingehalten, Barrierefreiheit geprüft, keine
Fachwerte ausserhalb von Daten und Fixtures, Review durch die zuständige Rolle, ADR
falls Architekturentscheid, Dokumentation aktualisiert.

---

## 7. Module und Reihenfolge

Die Repo-Struktur deckt das Gesamtsystem ab. Die Arbeit läuft nicht modulweise bis zur
Vollständigkeit, sondern in einem frühen durchgängigen Schnitt.

| # | Modul | Inhalt |
|---|---|---|
| M0 | Grundlage | Repo, CI, Validierung, Schemas, ADR zur Technologiewahl, Rollen benannt |
| M1 | Machbarkeitsnachweis | Regelformat, Auswertung, Fristberechnung, Fassungswahl an wenigen freigegebenen Regeln |
| M2 | Durchgängiger Pilot | ein Haushalt, ein Frageablauf, ein geprüfter Regelsatz, ein Ortsprofil, ein Plan, ein PDF, ein Redaktionsdurchlauf |
| M3 | Redaktion | Oberfläche für Regeln und Inhalte, erzeugt Pull Requests, Prüfzyklen, Freigabe |
| M4 | Website | Seitentypen, Navigation, Suche, Mehrsprachigkeit, Glossar |
| M5 | Orte | Karte, Filter, Ortsprofile, Vergleich, Leistungsdatenbank |
| M6 | Wizard vollständig | Kurzcheck und ausführlicher Check, Checklisten, Abdeckungsmatrix |
| M7 | Ausbau | weitere Länder, Sprachen, Gemeinden, anonyme Auswertung |

M2 ist der wichtigste Meilenstein: ein schmaler, aber vollständiger Weg von der Frage
bis zum PDF, geprüft mit echten Testpersonen. Er beweist die Produktannahmen, bevor
Breite aufgebaut wird.

**Betrieb läuft mit, nicht hinterher.** Vor der ersten öffentlichen Veröffentlichung
müssen funktionieren: Sicherung und erprobte Wiederherstellung, Zugriffsrechte und
starke Anmeldung für die Redaktion, ein Fehlerkontakt und die sofortige Rücknahme
einer falschen Fachausgabe mit nachvollziehbarer Wiederfreigabe.

Der Änderungswächter darf eine Prüfung anstossen. Er übernimmt niemals automatisch
eine geänderte Quelle in eine freigegebene Regel.

---

## 8. Technologiewahl

Entschieden. ADR-0001 legt fest, welcher Bestand wo gepflegt wird: PostgreSQL mit
PostGIS und mehrsprachiger Volltextsuche, Übertragungsschritt bei jeder Freigabe.
ADR-0002 legt Astro mit TypeScript für Website und Redaktion fest, die Regel-Engine
als eigenes TypeScript-Paket ohne Framework-Abhängigkeit, das im Browser und in Node
läuft. Hosting: ADR-0003 (statische Website auf Hostpoint, Schweiz; Datenbank- und
Node-Hosting wird entschieden, sobald das Ortsprofil sie braucht).

Bei der Umsetzung der Redaktionsoberfläche (M3) zu prüfen: gleichzeitige Bearbeitung
derselben Datei, Übersetzungsfreigabe je Sprachfassung, Rollen in der Oberfläche und
das Verhalten bei fehlgeschlagener Übertragung.

Die Kriterien, nach denen entschieden wurde, in dieser Gewichtung:

1. Das Team kann den Code in zwei Jahren warten. Erfahrung mit Laravel, React und
   Inertia zählt als Argument, ist aber nicht gesetzt.
2. Informationsseiten statisch oder serverseitig gerendert.
3. Räumliche Abfragen und mehrsprachige Volltextsuche in einem System.
4. Kein proprietäres Inhaltsformat, vollständiger Export.
5. Hosting in der EU oder in der Schweiz (Änderung vom 14.09.2026 durch die
   Produktverantwortung: die Schweiz hat einen Angemessenheitsbeschluss der EU, das
   DSG gilt, und Schweizer Nutzer sind eine benannte Zielgruppe).

Der Vorschlag benennt ausdrücklich, was die Wahl teuer macht.

---

## 9. Ergebnistexte

Freundlich im Ton, exakt in der Aussage. Der Text darf den Prüfstatus nie verändern.

| Tatsächlicher Zustand | Ergebnistext |
|---|---|
| Angabe fehlt | Für die Prüfung fehlt noch diese Information. |
| Bedingung nicht erfüllt | Diese Voraussetzung erfüllen Sie nach Ihren Angaben derzeit nicht. Diese Alternative könnte passen. |
| Rechtsfrage ungeklärt | Dieser Punkt braucht eine fachliche Klärung. Zuständig ist diese Stelle. |
| Nach Angaben passend | Nach Ihren Angaben kommt dieser Weg infrage. Über den Antrag entscheidet die zuständige Stelle. |
| Nichts offen | Für diesen Bereich sind derzeit keine weiteren Schritte erkennbar. |

Verbindlich: Unbekannt wird nie zu «kein Anspruch», und eine bekannte Hürde wird nie
als blosse Informationslücke beschönigt. Der Plan priorisiert **bis zu** drei sinnvolle
nächste Schritte und füllt nicht auf drei auf. Zahlen zu Aufwand und Dauer nur, wenn
sie aus dem konkreten Plan folgen. Keine Superlative ohne Beleg, keine Zusage ohne
deckende freigegebene Regel.

---

## 10. Was nicht gebaut wird

Ohne ausdrückliche Freigabe nicht anfangen: Anbindung an staatliche Antragsverfahren,
elektronische Identifikation, Dokumentenablage, gespeicherte Pläne auf Servern, Export
mit Wiederimport, native App, offener KI-Chat, automatische Anspruchsbescheide,
Ranglisten von Gemeinden, erfundene Genehmigungswahrscheinlichkeiten.

`prototyp.html` ist Gestaltungsreferenz und keine Codebasis: eine Einzeldatei mit per
JavaScript umgeschalteten Ansichten, also das Gegenteil von Abschnitt 2.6. Übernommen
werden Farbe, Typografie, Raster und Zustandsdarstellung, nicht die Umsetzung.

Keine erfundenen Werte für reale Orte, auch nicht in Demos und Screenshots. Fehlt ein
Beleg, steht dort ein Zustand. Vollständig fiktive und deutlich gekennzeichnete Orte
und Haushalte sind für Entwicklung und Tests dagegen erlaubt und erwünscht.

Ein nicht abgedeckter Fall führt nie zu einem negativen Ergebnis. Wissen, zuständige
Stelle und ein konkreter Klärungsschritt bleiben zugänglich.

---

## 11. Wenn etwas unklar ist

Nachfragen statt annehmen, besonders bei Fachwerten ohne Quelle, Fristberechnungen,
Abhängigkeiten zwischen Routen und allem, was eine Aussage über einen Anspruch trifft.

Bei ungeklärter Fachfrage wird die betroffene Detailausgabe ausgesetzt und eine
konkrete Klärungsfrage vorbereitet, statt zu raten oder die Aussage stehen zu lassen.

Ein falscher Fahrplan ist schädlicher als gar keiner, weil ihm geglaubt wird.

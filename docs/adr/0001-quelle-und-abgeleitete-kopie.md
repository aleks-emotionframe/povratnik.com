# ADR-0001: Was ist Quelle, was abgeleitete Kopie

Status: entschieden, 13.09.2026. Betrifft CLAUDE.md Abschnitt 4 und 8,
`umsetzungskonzept.md` Abschnitt 4 und 5.

---

## Kontext

CLAUDE.md legt Regeln als YAML-Dateien im Repository mit Freigabe über Pull Request
fest. Das Umsetzungskonzept beschrieb die Datenbank als einzige Wahrheit für alle
Bestände. Beides zugleich geht nur, wenn eindeutig ist, welcher Bestand Quelle ist und
welcher daraus abgeleitet wird. Ohne diese Antwort entstehen zwei Wahrheiten und damit
genau die Widersprüche, die das Produkt verhindern soll.

Erschwerend: Die beiden Bestände haben gegensätzliche Anforderungen. Rechtsregeln sind
wenige, ändern sich selten, brauchen aber lückenlose Nachvollziehbarkeit und
namentliche Freigabe. Ortsdaten sind viele, ändern sich laufend in Massen und müssen
räumlich und mehrsprachig abfragbar sein.

## Optionen

**A: Alles in der Datenbank.** Einfacher Betrieb, gute Abfragen. Freigabe,
Versionierung und Änderungsverlauf müssten selbst gebaut werden. Die fachliche
Nachvollziehbarkeit, die das ganze Vertrauensmodell trägt, wäre Eigenentwicklung.

**B: Alles im Repository.** Versionierung und Freigabe geschenkt. Für mehrere tausend
Orte mit Geometrie und laufenden Änderungen ungeeignet: keine räumlichen Abfragen,
Konflikte bei gleichzeitiger Bearbeitung, langsame Verarbeitung.

**C: Getrennte Quellen nach Bestandsart.** Mehr Abstimmung, aber jede Anforderung
wird dort erfüllt, wo sie hingehört.

## Entscheidung

Option C.

| Bestand | Quelle | Begründung |
|---|---|---|
| Regeln, Aufgaben, Verfahren | Repository, YAML | Freigabe, Versionierung und Änderungsverlauf sind hier zwingend und über Pull Requests kostenlos |
| Inhaltsseiten und Sprachfassungen | Repository | dieselbe Prüfkette wie die Regeln |
| Quellenregister | Repository | wird mit den Regeln gemeinsam geprüft |
| Orte, Geometrie, Einrichtungen | Datenbank | Umfang, räumliche Abfragen, laufende Massenänderungen |
| Leistungen (national, regional, kommunal) | Datenbank | Umfang und Verknüpfung zu Orten; die **Freigabe** jeder Leistung wird dennoch protokolliert wie bei einer Regel |
| Suchindex | abgeleitet | jederzeit neu erzeugbar |

**Fluss.** Das Repository ist Quelle. Bei jeder Freigabe werden Regeln und Inhalte in
die Datenbank übertragen. Die Datenbank ist für diese Bestände ein **lesbarer Index**,
nie eine Schreibquelle. Umgekehrt werden Ortsdaten in der Datenbank gepflegt und nicht
im Repository gespiegelt.

**Redaktionsoberfläche.** Sie schreibt für Regeln und Inhalte in die Dateien und
erzeugt im Hintergrund Pull Requests. Für Ortsdaten schreibt sie direkt in die
Datenbank, mit eigenem Änderungsprotokoll, Freigabestatus und Prüfdatum je Datensatz.
Die Redaktion merkt den Unterschied nicht; die Oberfläche verbirgt ihn.

**Prüfregel für die Entwicklung.** Wird ein Regel- oder Inhaltsdatensatz direkt in der
Datenbank geändert, ist das ein Fehler. Ein Abgleich prüft regelmässig, ob der Index
dem Repository entspricht, und meldet Abweichungen.

## Konsequenzen

Die Technologiewahl ist damit nicht mehr völlig offen: Es braucht eine Datenbank mit
räumlicher Erweiterung und mehrsprachiger Volltextsuche sowie einen Übertragungsschritt
bei jeder Freigabe. Die verbleibende Wahl betrifft Framework, CMS und Hosting und wird
in ADR-0002 entschieden.

Zu prüfen bei der Umsetzung: gleichzeitige Bearbeitung derselben Datei,
Übersetzungsfreigabe je Sprachfassung, Rollen in der Oberfläche, Verhalten bei
fehlgeschlagener Übertragung.

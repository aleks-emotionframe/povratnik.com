# Review der Entwicklungsanweisung

Prüfung der CLAUDE.md Version 1 vom 13.09.2026. Alle P0-Befunde sind in Version 2
abgearbeitet. Dieses Dokument bleibt als Nachweis erhalten, damit die Korrekturen
nachvollziehbar sind und nicht versehentlich rückgängig gemacht werden.

---

## 1. Gesamturteil

Als Entwicklungsleitlinie geeignet, als alleinige Bauspezifikation nicht ausreichend.
Das ist kein Mangel, solange die referenzierten Fachspezifikationen die Details liefern
und die Zuständigkeiten eindeutig sind.

Die grösste Schwäche lag nicht in der Produktidee, sondern in absoluten
Formulierungen, die Interpretationsspielraum liessen oder den eigenen Beispielen
widersprachen. Ein falsches, als freigegeben dargestelltes Regelbeispiel war besonders
kritisch, weil es unverändert in die Software gelangen könnte.

---

## 2. Was bleiben sollte

Gemeinsamer Datenbestand für Wissen, Orte und Wizard. Personenmodell mit eigenen
Rechten je Haushaltsmitglied. Quellen und Freigabe vor Auswertung. Zeitliche
Fassungen. Mobile Zielgruppe als Architekturvorgabe. Redaktionsoberfläche von Beginn
an. Lesbare Informationsseiten ohne JavaScript. Barrierefreiheit mit
Listenalternative zur Karte. Strukturierter Export. Begrenzter erster Ausbau ohne
Antragsautomatisierung, ohne erfundene Genehmigungswahrscheinlichkeiten, ohne offenen
KI-Chat.

Ergänzung: Südamerika ist eine **Pilotpriorität und überprüfbare Annahme**, keine
Begrenzung des Produkts. Andere Nutzergruppen dürfen nicht unbemerkt herausfallen.

---

## 3. Abgearbeitete P0-Befunde

### 3.1 Regelbeispiel zu breit zugeordnet

**Befund.** Die Beispielregel umfasste `hr_citizen`, `eea_citizen` und
`third_country_temp` und erzeugte für alle drei Gruppen 15 Tage nach Einreise, gestützt
auf Art. 51 NN 55/2026. Diese Vorschrift ändert Art. 178 Abs. 1 des Ausländergesetzes,
dessen Gegenstand die Wohn- und Adressmeldung für Drittstaatsangehörige mit
vorübergehendem Aufenthalt ist. Die Quelle trägt keine gemeinsame Regel für
kroatische Staatsbürger, EWR-Bürger und diesen Drittstaatenfall. MUP beschreibt für
EWR-Bürger einen eigenen Rahmen, für die Registrierung eines Aufenthalts über drei
Monate spätestens acht Tage nach Ablauf der drei Monate. Der Datensatz trug zudem
`status: approved`.

**Erledigt in v2.** Das Beispiel ist ersatzlos entfernt. An seiner Stelle stehen
Mindestanforderungen an jeden Datensatz und die Regel, dass Beispiele als synthetisch
zu kennzeichnen sind und nie den Status einer Freigabe tragen. Das verbindliche Schema
steht in `datenmodell.md`. Aufenthaltsregistrierung, Wohnsitzmeldung und
Unterkunftsmeldung sind dort als getrennte Verfahren mit eigenen Kennungen
festgelegt, ebenso Staatsangehörigkeit und Aufenthaltsstatus als getrennte Felder.

**Abnahme.** Negativtests verhindern, dass eine Regel für eine Personengruppe auf eine
andere angewendet wird. Ein weiterer Test unterscheidet Adresswechsel und Einreise.

### 3.2 Datenschutzversprechen widersprüchlich

**Befund.** «Bis M7 keine Personendaten» stand neben Redaktions- und
Gemeindezugängen in M3 und M7, die zwangsläufig personenbezogene Konten sind.
Verarbeitung ist weiter gefasst als Übermittlung. Antworten könnten zudem indirekt über
Suchparameter, Kartenanfragen oder Fehlerberichte abfliessen.

**Erledigt in v2.** Vier getrennte Datenbereiche in `betrieb.md`: Wizard-Antworten
lokal und ohne Übermittlung, technischer Betrieb, Redaktions- und Gemeindekonten,
Statistik. Ausdrücklich ausgeschlossen: Antwortwerte in URLs, Telemetrie,
Fehlerberichten und Suchanfragen. Abnahme durch Untersuchung des Netzwerkverkehrs beim
Ausfüllen, Filtern und PDF-Erstellen.

### 3.3 Zustandsmodell verkürzt

**Befund.** Fünf Werte in einem Statusfeld, während Wert, Beleglage und Aktualität
verschiedene Eigenschaften sind. Ein Betrag kann bekannt, dokumentiert und gleichzeitig
veraltet sein. Zusätzlich stand `valid_until: null` neben dem Verbot von NULL in
Fachfeldern.

**Erledigt in v2.** Vier unabhängige Dimensionen in `datenmodell.md`: `value`,
`availability`, `evidence`, `currency`. Leere Felder nur über eine ausdrücklich
definierte Schema-Semantik mit `kind: open_ended`, `date` oder `unknown`.

**Abnahme.** Derselbe Datensatz muss einen bekannten, aber veralteten Wert darstellen
können.

### 3.4 Ergebnistexte verändern die Aussage

**Befund.** «Voraussetzungen nicht erfüllt» durch «lässt sich noch nicht beurteilen»
zu ersetzen, verändert die Bedeutung. Eine nicht erfüllte Bedingung und eine
unbekannte Bedingung sind verschiedene Sachverhalte. Die Vorgabe, jeder Plan müsse
mindestens drei erledigbare Aufgaben enthalten, erzeugt erfundene Aufgaben, wenn nur
eine sinnvoll ist.

**Erledigt in v2.** Fünf Zustände mit je eigener Formulierung in CLAUDE.md Abschnitt 9
und in `redaktionsgrundsaetze.md`. Der Plan priorisiert **bis zu** drei Schritte und
füllt nicht auf. Unbekannt wird nie zu «kein Anspruch», eine bekannte Hürde nie zur
Informationslücke.

---

## 4. Abgearbeitete P1-Befunde

**Zeit- und Konfliktlogik.** Ereignisart, Fassungswahl, Fristberechnung, mehrere
passende Regeln, keine passende Regel und Freigabe gegen Ersetzung sind in
`datenmodell.md` Abschnitt 2 festgelegt. Freigabe, Veröffentlichung und zeitliche
Gültigkeit sind drei getrennte Felder, damit ersetzte Fassungen für historische
Ereignisse auswertbar bleiben.

**Grenze zwischen Daten und Code.** Präzisiert: veränderliche Fachwerte in die Daten,
allgemeine Auswertung in den Code, Fachwerte in zugeordneten Testfixtures erlaubt. Die
Operatoren sind abschliessend aufgezählt, damit keine Programmiersprache in YAML
entsteht.

**Arbeitsweise nach Tragweite.** Fünf Änderungsarten mit unterschiedlichem Ablauf.
Reversible Detailänderungen dürfen eigenständig erfolgen. Kritische Fachlogik braucht
Spezifikation, Tests und unabhängige Fachfreigabe.

**Rollen.** Produktverantwortung, technische Verantwortung und Fachfreigabe werden
getrennt benannt. Ein zweiter Entwickler erkennt technische Fehler, ist aber nicht zur
rechtlichen Prüfung befähigt. Eine KI-Prüfung ersetzt keine qualifizierte unabhängige
Fachperson.

**Modulreihenfolge.** Statt M1 vollständig abzuschliessen, folgt auf einen begrenzten
Machbarkeitsnachweis früh ein durchgängiger Pilot von der Frage über Regelbewertung und
Ortsbezug bis zum PDF, geprüft mit echten Testpersonen.

**Betrieb vorgezogen.** Sicherung, erprobte Wiederherstellung, Zugriffsrechte,
Fehlerkontakt und die Rücknahme einer falschen Fachausgabe müssen vor der ersten
öffentlichen Veröffentlichung funktionieren.

**Design und Messung.** Messprofil und Budgets je Seitentyp in `betrieb.md`,
Designsystem in `designsystem.md`. Barrierefreiheit wird automatisiert und manuell
geprüft; ein grüner automatischer Test allein ist keine Freigabe.

**Demo-Daten.** Keine erfundenen Werte für reale Orte. Vollständig fiktive und
gekennzeichnete Orte und Haushalte sind für Entwicklung und Tests erlaubt.

**Amtsbegriffe.** Das Original verschwindet nie, wird aber immer zusätzlich erklärt.
Der amtliche kroatische Rechtstext bleibt die fachliche Referenz.

---

## 5. Offen geblieben

Diese Punkte sind in den Dokumenten adressiert, aber noch nicht entschieden:

- Abdeckungsmatrix nach Land und Personengruppe muss vor dem öffentlichen Pilot
  festgelegt und sichtbar sein.
- Priorität bei mehreren möglichen Wegen: Kriterien wie Familienzusammenhalt,
  Arbeitsmöglichkeit und Dauer, ohne erfundene Erfolgswahrscheinlichkeiten.
- Rückkehr und Wiederaufnahme: Ohne Speicherung muss nach Schliessen des Fensters neu
  begonnen werden. Das muss früh verständlich sein.
- Ein Export mit Wiederimport wäre eine neue Speicherfunktion und ist nicht
  freigegeben.
- Fehler melden darf nie ungewollt das Haushaltsprofil mitsenden.
- Die benannte Fachprüfung ist noch nicht besetzt. Ohne sie darf keine Rechtsregel
  produktiv geladen werden.

---

## 6. Grundlage

Geprüfte Datei: CLAUDE.md Version 1. Rechtliche Belege: NN 55/2026 Art. 51 und 70, NN
133/2020 Art. 178, MUP zu EWR-Bürgern und ihren Familien, DSGVO Art. 4, W3C WAI zur
Bewertung von Barrierefreiheit. Die Produktvorschläge sind eigenständige Empfehlungen,
keine Aussagen der verlinkten Behörden.

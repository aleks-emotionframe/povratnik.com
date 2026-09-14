# Datenmodell

Verbindliche Grundlage für Schema, Zustände, Zeitlogik und Haushaltsmodell.
Version 1.2, 14.09.2026. Referenziert aus CLAUDE.md Abschnitt 2.2, 2.3, 2.4 und 4.
Änderungen in 1.2 (M1): Zählregeln in 2.3, Fassungswahl bei unbekanntem Ereignisdatum
in 2.4, Konfliktdefinition und Prioritätsrichtung in 2.5, Feld `trigger`, Semantik von
`on_unknown` und Fakten-Pfade in 3.

---

## 1. Vier Zustandsdimensionen

Die häufigste Fehlerquelle in Systemen dieser Art ist, Wert, Beleglage und Aktualität
in ein einziges Statusfeld zu pressen. Ein Betrag kann bekannt, dokumentiert und
gleichzeitig veraltet sein. Deshalb vier unabhängige Dimensionen an jedem Fachwert.

| Dimension | Werte | Zweck |
|---|---|---|
| `value` | der eigentliche Wert | Betrag, Datum, Land, Wahrheitswert |
| `availability` | `known`, `unknown`, `not_collected`, `not_applicable`, `not_existing` | Unbekannt wird nie zu null oder falsch |
| `evidence` | `self_reported`, `document`, `expert_verified`, `conflicting` | Beleglage getrennt vom Wert |
| `currency` | `current`, `review_due`, `outdated` mit `checked_at` und `next_check` | Historischer Wert bleibt nachvollziehbar |

Beispiel, das ohne diese Trennung nicht darstellbar wäre:

```yaml
amount:
  value: 500
  unit: EUR
  availability: known
  evidence: document
  currency: outdated
  checked_at: 2025-04-12
  note:
    de: "Stand 2025, durch damalige Satzung belegt. Aktuelle Höhe ungeklärt."
```

Das Portal kann so den früheren Betrag einordnen und zugleich verhindern, dass er als
heutiger Anspruch erscheint.

**Leere Felder.** Ein Fachfeld bleibt nur leer, wo die Schema-Semantik ein offenes Ende
ausdrücklich definiert. Statt `valid_until: null` wird geschrieben:

```yaml
valid_until:
  kind: open_ended        # open_ended | date | unknown
  date: null              # nur bei kind: date gesetzt
```

`kind: unknown` bedeutet, dass ein Ende existieren kann, aber nicht bekannt ist. Das
ist etwas anderes als `open_ended`.

### 1.1 Welches Vokabular für welches Objekt

Es gibt drei getrennte Vokabulare. Sie beschreiben verschiedene Dinge und werden nie
vermischt. Die Oberfläche übersetzt die englischen Kennungen.

**Vokabular A, Fachwert.** Gilt für jeden einzelnen Wert: Betrag, Datum, Kapazität,
Kontakt. Das sind die vier Dimensionen aus Abschnitt 1: `availability`, `evidence`,
`currency` und der Wert selbst.

**Vokabular B, Programmstatus.** Gilt für ein Programm, eine Leistung oder einen
Förderaufruf als Ganzes, also für das Objekt `benefit`:

| Kennung | Anzeige | Bedeutung |
|---|---|---|
| `open` | offen | Anträge sind derzeit möglich |
| `announced` | angekündigt | beschlossen oder angekündigt, Antragszeitraum noch nicht begonnen |
| `closed` | geschlossen | Antragszeitraum abgelaufen |
| `exhausted` | ausgeschöpft | Mittel verbraucht, obwohl der Zeitraum läuft |
| `unconfirmed` | unbestätigt | Angabe liegt vor, Satzung oder Ausschreibung fehlt |
| `budget_unknown` | Budget unbekannt | Zeitraum offen, verfügbare Mittel nicht belegt |

**Vokabular C, Verfahren und Eignung.** Gilt je Person und Route. Es sind die vier
Zustandsdimensionen aus `umsetzungskonzept.md` Abschnitt 6.2 und
`wizard-recherche.md` Abschnitt 15, hier mit ihren Kennungen. Die vierte Dimension,
Programmstatus, ist Vokabular B.

| Dimension | Kennungen | Anzeige |
|---|---|---|
| `facts` Sachverhalt | `self_reported`, `document`, `expert_verified`, `conflicting`, `unknown` | Selbstauskunft, Dokument vorhanden, fachlich geprüft, widersprüchlich, unbekannt |
| `eligibility` Eignung nach Regeln | `matches`, `condition_missing`, `unclear`, `unchecked` | nach Angaben passend, Bedingung fehlt, unklar, nicht geprüft |
| `procedure` Verfahrensstand | `not_started`, `preparable`, `submittable`, `submitted`, `decided`, `follow_up_open` | nicht begonnen, vorbereitbar, einreichbar, eingereicht, entschieden, Folgehandlung offen |
| `program` Programmstatus | Vokabular B | siehe oben |

`facts` verwendet dieselben Kennungen wie `evidence` in Vokabular A, ergänzt um
`unknown`, weil auf Routenebene die Beleglage als Ganzes unbekannt sein kann.

**Zuordnung in der Oberfläche.** Ein Ortsprofil zeigt bei einer Leistung Vokabular B
als Marke und bei jedem einzelnen Feld Vokabular A. «Unbekannt» und «veraltet» sind
deshalb Aussagen über einen Fachwert, «geschlossen» und «ausgeschöpft» Aussagen über
ein Programm. `designsystem.md` Abschnitt 4 bildet beide ab.

---

## 2. Zeit- und Fristmodell

### 2.1 Ereignisarten

Eine Regel gilt nie pauschal «ab Umzug». Sie benennt die Handlung, an die sie
anknüpft. Zulässige Ereignisarten:

`entry` Einreise · `address_change` Adresswechsel innerhalb Kroatiens ·
`residence_registration` Registrierung eines Aufenthalts · `application_submitted`
Antragstellung · `decision_served` Zustellung eines Bescheids · `permit_expiry`
Ablauf eines Titels · `employment_start` Beginn einer Beschäftigung ·
`business_registration` Gründung · `insurance_end_abroad` Ende der bisherigen
Versicherung

### 2.2 Getrennte Verfahren

Aufenthaltsregistrierung, Wohnsitzmeldung und Unterkunftsmeldung sind verschiedene
Vorgänge mit eigenen Kennungen, eigenen Rechtsgrundlagen, eigenen Fristen und
unterschiedlichen Personenkreisen. Sie dürfen niemals in einer Regel
zusammengefasst werden. Dasselbe gilt für Staatsangehörigkeit und Aufenthaltsstatus:
zwei Felder, zwei Bedeutungen.

### 2.3 Fristberechnung

```yaml
deadline:
  trigger: entry                # Ereignisart aus 2.1
  interval: 15
  unit: calendar_days           # calendar_days | working_days | months
  counting_starts: day_after    # same_day | day_after
  weekend_holiday_rule: extend_to_next_working_day
  kind: statutory               # statutory | funding | recommended | user_reminder
```

Kein globales «Datum plus X». Fehlt das auslösende Ereignis, gibt das System aus:
«Termin berechenbar, sobald das Einreisedatum bestätigt ist.» Die vier Fristarten
werden in der Oberfläche sichtbar unterschieden; eine empfohlene Vorlaufzeit darf nie
wie eine gesetzliche Frist aussehen.

**Zählregeln der Engine.** Sie sind allgemeine Definitionen, keine Fachwerte; welche
Kombination eine konkrete Regel braucht, steht in der Regel selbst. Fachlich zu
bestätigen ist nur, dass die Definitionen die kroatischen Fristvorschriften abbilden
können.

- `first` ist der Ereignistag (`same_day`) oder der Folgetag (`day_after`).
- `calendar_days`: Fristende = `first` + `interval` − 1 Tage. Beispiel: Einreise am
  1., `day_after`, 30 Tage → Ende am 31.
- `working_days`: Fristende = der `interval`-te Werktag ab `first`, `first` zählt mit,
  wenn er ein Werktag ist. Werktag = nicht Samstag, nicht Sonntag, nicht Feiertag.
- `months`: Fristende = `first` + `interval` Monate mit gleichem Tag; existiert der Tag
  im Zielmonat nicht, gilt der letzte Tag des Zielmonats.
- `interval: 0` bedeutet: fällig am Ereignistag.
- `extend_to_next_working_day`: fällt das Ende auf Samstag, Sonntag oder Feiertag,
  verschiebt es sich auf den nächsten Werktag. Die Feiertagsliste ist ein Datensatz
  und wird der Engine als Eingabe übergeben; sie steht nie im Code.

### 2.4 Fassungswahl

Drei Felder, die nie vermischt werden:

```yaml
approval:                    # fachliche Freigabe
  state: approved            # draft | in_review | approved | rejected
  reviewer: "<Name, Funktion>"
  approved_at: 2026-09-13
publication:                 # Sichtbarkeit
  state: published           # unpublished | published | withdrawn
validity:                    # zeitliche Geltung
  valid_from: 2026-06-04
  valid_until: { kind: open_ended, date: null }
  supersedes: <rule-id>@2
  superseded_by: null
  transitional: <text oder null>
```

Eine heute ersetzte Fassung bleibt für ein historisches Ereignis auswertbar. Sie
verschwindet nicht aus dem Bestand, sie wird nur für neue Ereignisse nicht mehr
gewählt.

**Ablauf der Fassungswahl.** Massgeblich ist das Datum des Ereignisses, das die Regel
in `trigger` benennt, nie das heutige Datum. Eine Fassung ist Kandidat, wenn
`valid_from` nicht nach dem Ereignisdatum liegt und `valid_until` es nicht
ausschliesst (`open_ended` und `unknown` schliessen nichts aus). Alle Fassungen einer
Regel-Id beschreiben dieselbe Pflicht: gleicher `trigger`, gleiches Verfahren, und
Gültigkeitsfenster, die sich nicht überschneiden. Ändert sich das Ereignis oder das
Verfahren, ist das eine neue Regel-Id. Der Validator lehnt Verstösse ab. Findet
sich keine Fassung, ist die Regel für dieses Ereignis nicht in Kraft und liefert kein
Ergebnis. Ist das Ereignisdatum unbekannt, wählt die Engine die am Referenzdatum
gültige Fassung, kennzeichnet die Wahl als provisorisch, stuft das Ergebnis höchstens
als `unclear` ein und erzeugt eine Klärungsaufgabe für das fehlende Datum.

Öffentlich ausgewertet werden nur Fassungen mit `synthetic: false`,
`approval.state: approved` und `publication.state: published`. Eine zurückgezogene
Fassung (`withdrawn`) wird nie ausgewertet, auch nicht für historische Ereignisse.

### 2.5 Konflikte

Treffen mehrere Regeln gleichzeitig zu, wird der Konflikt nie stillschweigend
aufgelöst. Entweder ist eine ausdrückliche Priorität hinterlegt, oder es entsteht eine
benannte Klärungsaufgabe. Findet sich keine passende Regel, lautet das Ergebnis
`unchecked` oder `clarification_required`, niemals «nicht berechtigt».

**Definition.** Ein Konflikt liegt vor, wenn für dieselbe Person im selben Verfahren
mehr als eine Regel ein Ergebnis `matches` oder `unclear` liefert. Er ist nur
aufgelöst, wenn alle beteiligten Regeln eine `priority` tragen und diese verschieden
sind; dann gilt die kleinste Zahl (1 ist die höchste Priorität), die übrigen Regeln
entfallen. Andernfalls werden alle beteiligten Ergebnisse auf `unclear` gesetzt und es
entsteht die Klärungsaufgabe `rule_conflict:<verfahren>`.

---

## 3. Regelschema

```yaml
id: <kebab-case>
version: <int>
trigger: <ereignisart aus 2.1>     # das Ereignis, das die Regel auslöst; steuert Fassungswahl
scope:
  applies_to_persons:
    citizenship_status: [<aus kontrollierter Liste>]
    residence_status: [<aus kontrollierter Liste>]
    # Staatsangehörigkeit und Aufenthaltsstatus sind getrennte Felder
  procedure: <procedure-id>        # genau ein Verfahren je Regel
conditions:
  - field: <pfad>
    operator: <in | eq | gte | lte | between | exists>
    value: <wert>
    on_unknown: clarify              # clarify | skip | fail
priority: <int, optional>          # 1 ist die höchste, siehe 2.5
result:
  task: <task-id>
  deadline: { ... }                  # Schema aus 2.3
  status_text_key: <i18n-key>
sources:
  - id: <source-id>
    reference: "<genaue Fundstelle>"
    checked: <datum>
approval: { ... }                    # Schema aus 2.4
publication: { ... }
validity: { ... }
review:
  next_check: <datum>
  cycle: weekly | monthly | quarterly | biannual
```

**Erlaubte Operatoren sind abschliessend aufgezählt.** Es gibt keine frei ausführbaren
Ausdrücke in YAML. Braucht ein Fall eine Operation, die nicht in der Liste steht, ist
das eine Erweiterung der Auswertungslogik im Code und keine Notlösung in den Daten.

Bedeutung der Operatoren: `in` (der Wert steht in der Liste; bei Listenwerten genügt
ein Element), `eq` (nur Einzelwerte), `gte`, `lte` (Zahlen oder ISO-Daten), `between`
(beide Grenzen eingeschlossen), `exists` (der Wert ist bekannt). Ein Typkonflikt zwischen Faktwert und
Vergleichswert ist ein Datenfehler und wird von der Engine gemeldet, nie stillschweigend
als «nicht erfüllt» gewertet.

**Fakten-Pfade.** Bedingungen, Fassungswahl und Fristen lesen dieselben Fakten. Jeder
Fakt trägt die Dimensionen aus Abschnitt 1; die Engine wertet `availability` und
`value` aus.

- `person.<name>` für Angaben zur Person, darunter immer `person.citizenship_status`
  (Liste der Status), `person.residence_status` und `person.croatian_link`.
- `event.<ereignisart>` für das Datum eines Ereignisses aus 2.1. So erzeugt ein
  fehlendes Einreisedatum genau eine Klärungsaufgabe, egal ob es die Fassungswahl, die
  Frist oder eine Bedingung betrifft.
- Ein fehlender Pfad gilt als `not_collected`, also unbekannt. `not_applicable` und
  `not_existing` sind dagegen bekannte Aussagen «kein Wert»: eine Bedingung darauf ist
  nicht erfüllt, nie unklar.

**Bedeutung von `on_unknown`,** wenn der Fakt einer Bedingung unbekannt ist:

| Wert | Ergebnis der Regel | Klärungsaufgabe |
|---|---|---|
| `clarify` | `unclear` | ja, `missing:<pfad>` |
| `skip` | `unchecked`; die Regel wird für diese Person nicht abschliessend geprüft | nein |
| `fail` | kein Fachergebnis; die Engine meldet einen Fehler, weil der Wert Pflichteingabe ist | nein |

Eine bekannt nicht erfüllte Bedingung führt immer zu `condition_missing`, auch wenn
andere Bedingungen unbekannt sind: eine bekannte Hürde wird nie als Informationslücke
beschönigt. Sind alle Bedingungen erfüllt, ist das Ergebnis `matches`. Nur dann wird
der `status_text_key` der Regel verwendet; in allen anderen Zuständen kommt der
generische Text zum Zustand aus CLAUDE.md Abschnitt 9. Damit kann kein Regeltext eine
stärkere Aussage treffen als das Regelergebnis.

**Trennlinie Daten und Code:**

| In den Daten | Im Code |
|---|---|
| Beträge, Fristen, Gültigkeitszeiträume | Datums-, Vergleichs- und Rechenoperationen |
| Personenkreis, Bedingungen, Ausnahmen | Auswertung der Operatoren, Umgang mit `unknown` |
| Quellen, Zuständigkeit, Ergebnistexte | erklärbare Zusammenstellung der betroffenen Regeln |
| Abhängigkeiten zwischen Aufgaben | Erkennung von Konflikten und Zyklen |

---

## 4. Person, Beziehung, Haushalt

### 4.1 Person

Jede Person trägt eigene Staatsangehörigkeiten (mehrfach, mit Belegstatus),
Dokumente, Aufenthalts- und Erwerbsintervalle, Versicherungsgrundlagen und Routen.
Kein Modell mit Hauptperson und Anhängseln.

```yaml
person:
  id: p1
  citizenships:
    - country: ar
      evidence: document
    - country: hr
      availability: unknown        # vermutet, nicht belegt
  croatian_link: ancestor          # citizen | parent | ancestor | partner | former_residence | none | unknown
  documents: [...]
  intervals:
    residence: [...]
    employment: [...]
    insurance: [...]
```

### 4.2 Beziehung

Beziehungen sind eigene Objekte, nicht Attribute einer Person.

```yaml
relationship:
  between: [p1, p2]
  kind: marriage        # marriage | registered_partnership | unmarried_partnership
                        # | parent_child | guardianship | dependency | other
  valid_from: <datum>
  evidence: document
  representation_rights: <für Minderjährige: wer darf entscheiden>
```

Nicht jeder Mitziehende ist rechtlich Familienangehöriger. Eine Person kann
gleichzeitig eine eigene Aufenthaltsoption und einen abgeleiteten Familienweg haben;
das System vergleicht beide, statt eine zu unterstellen.

### 4.3 Haushalt ist nicht gleich Haushalt

Der **Planungshaushalt** sind die Personen, die mitziehen. Der **leistungsrechtliche
Haushalt** wird je Leistung eigens definiert und kann abweichen, etwa beim
Einkommenskriterium für Kindergeld. Eine einzige globale Haushaltsliste reicht nicht.
Jede Leistung trägt deshalb:

```yaml
household_definition:
  members: <wer zählt für dieses Programm>
  income_reference_year: <bezugsjahr>
  income_definition: <welche Einkommensart>
```

### 4.4 Zeitversetzter Umzug

Jede Person hat eigene Ereignisdaten für Einreise, Anmeldung, Versicherungsbeginn und
Schulstart. Ein gemeinsamer Umzugstermin ist ein Szenario, kein Datum. Das System
erzeugt nie eine fiktive gemeinsame Frist.

---

## 5. Weitere Kernobjekte

**Ort.** Amtlicher Gemeindeschlüssel als stabile Kennung, Name mit Schreibvarianten,
Ebene (Siedlung, Gemeinde, Stadt, Gespanschaft), übergeordnete Einheit, Geometrie,
Entwicklungsindex, Datentiefe, Lizenz des Geodatensatzes.

**Einrichtung.** Typ, Ort, Adresse, Träger, Kontakt, Sprachen, Barrierefreiheit.
**Kapazität ist kein Feld der Einrichtung**, sondern ein eigenes zeitbezogenes Objekt
mit Bestätigungsdatum und Quelle. Vorhandensein einer Schule ist nicht Verfügbarkeit
eines Platzes.

**Leistung.** Anbieter, räumlicher Geltungsbereich, Zielgruppe, strukturierte
Kriterien, Betrag oder Berechnungsart, Antragszeitraum, Budgetstatus, Bindungen,
Rückzahlungspflichten, Ausschreibungsversion, Haushaltsdefinition nach 4.3.

**Verfahren.** Eigene Kennung je Vorgang, zuständige Stelle, Voraussetzungen,
Schritte, Formulare, Fristregel, gültige Fassung.

**Aufgabe.** Titel als Handlung, Zweck, Phase, betroffene Person, verantwortliche
Person, Voraussetzungen, Unterlagen, zuständige Stelle, Fristart, Fristauslöser,
Dauer, Kosten, Abschlussnachweis, Folgeaufgaben, Regelversion.

**Quelle.** URL, Titel, Herausgeber, Veröffentlichungsdatum, Abrufdatum, Prüfdatum,
Prüfer, Weiterverwendungsrecht, Änderungsverlauf. Ein frisches Abrufdatum beweist
keinen aktuellen Regelinhalt: Linkprüfung und inhaltliche Prüfung sind zwei
verschiedene Vorgänge mit eigenen Feldern.

---

## 6. Mehrsprachigkeit

Jede Sprachfassung hat eigenen Status, eigene Fassung und eigenes Prüfdatum. Ändert
sich die Rechtsgrundlage, werden alle Sprachfassungen als prüfbedürftig markiert; nicht
geprüfte werden als solche ausgewiesen und nicht stillschweigend weiterverwendet.

Kroatische Amtsbegriffe stehen in einem eigenen Feld `term_hr`, das nie übersetzt
wird, begleitet von `term_explained` in der jeweiligen Sprache. Der amtliche
kroatische Rechtstext bleibt die fachliche Referenz; Übersetzungen sind
Arbeitsfassungen.

---

## 7. Nachvollziehbarkeit eines Plans

Ein erzeugter Plan speichert die verwendeten Antworten, die Regelversionen und das
Erstellungsdatum. Daraus muss sich dasselbe Ergebnis identisch reproduzieren lassen.
Ein exportiertes PDF trägt Erstellungsdatum, Regel- und Quellenstand und den Hinweis,
vor einer Antragstellung erneut zu prüfen.
